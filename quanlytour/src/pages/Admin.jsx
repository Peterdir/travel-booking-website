import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tourAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice, parsePrice, fileToBase64, validateImageFile } from '../utils/helpers';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('tours');
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedDates, setSelectedDates] = useState([]);
  const [tourForm, setTourForm] = useState({
    name: '',
    coverImage: '',
    price: '',
    location: '',
    days: '',
    maxGuests: '',
    description: '',
    startDates: '',
  });

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    fetchTours();
    fetchBookings();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await tourAPI.getAll();
      setTours(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getAll();
      setBookings(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleOpenModal = (tour = null) => {
    if (tour) {
      setEditingTour(tour);
      setImagePreview(tour.coverImage);
      const dates = tour.startDates?.map(d => new Date(d).toISOString().split('T')[0]) || [];
      setSelectedDates(dates);
      setTourForm({
        name: tour.name,
        coverImage: tour.coverImage,
        price: formatPrice(tour.price),
        location: tour.location,
        days: tour.days,
        maxGuests: tour.maxGuests,
        description: tour.description || '',
        startDates: '',
      });
    } else {
      setEditingTour(null);
      setImagePreview('');
      setSelectedDates([]);
      setTourForm({
        name: '',
        coverImage: '',
        price: '',
        location: '',
        days: '',
        maxGuests: '',
        description: '',
        startDates: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTour(null);
    setImagePreview('');
    setSelectedDates([]);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      validateImageFile(file);
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      setTourForm({ ...tourForm, coverImage: base64 });
    } catch (error) {
      alert(error.message);
    }
  };

  const handlePriceChange = (e) => {
    const formatted = formatPrice(e.target.value);
    setTourForm({ ...tourForm, price: formatted });
  };

  const handleAddDate = () => {
    const dateInput = tourForm.startDates;
    if (!dateInput) {
      alert('Vui lòng chọn ngày');
      return;
    }
    
    if (selectedDates.includes(dateInput)) {
      alert('Ngày này đã được thêm');
      return;
    }

    setSelectedDates([...selectedDates, dateInput]);
    setTourForm({ ...tourForm, startDates: '' });
  };

  const handleRemoveDate = (dateToRemove) => {
    setSelectedDates(selectedDates.filter(date => date !== dateToRemove));
  };

  const handleFormChange = (e) => {
    setTourForm({ ...tourForm, [e.target.name]: e.target.value });
  };

  const handleSubmitTour = async (e) => {
    e.preventDefault();
    
    if (selectedDates.length === 0) {
      alert('Vui lòng thêm ít nhất một ngày khởi hành');
      return;
    }

    setLoading(true);

    try {
      const startDatesArray = selectedDates.map(date => new Date(date).toISOString());

      const availability = startDatesArray.map(date => ({
        startDate: date,
        remaining: Number(tourForm.maxGuests)
      }));

      const tourData = {
        ...tourForm,
        price: Number(parsePrice(tourForm.price)),
        days: Number(tourForm.days),
        maxGuests: Number(tourForm.maxGuests),
        startDates: startDatesArray,
        availability
      };

      if (editingTour) {
        await tourAPI.update(editingTour._id, tourData);
        alert('Cập nhật tour thành công!');
      } else {
        await tourAPI.create(tourData);
        alert('Tạo tour thành công!');
      }

      handleCloseModal();
      fetchTours();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTour = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa tour này?')) return;

    try {
      await tourAPI.delete(id);
      alert('Xóa tour thành công!');
      fetchTours();
    } catch (error) {
      alert('Xóa tour thất bại');
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await bookingAPI.update(id, { status });
      alert('Cập nhật trạng thái thành công!');
      fetchBookings();
    } catch (error) {
      alert('Cập nhật thất bại');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Quản trị viên</h1>
        <p>Xin chào, {user?.fullName}</p>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === 'tours' ? 'active' : ''}
          onClick={() => setActiveTab('tours')}
        >
          Quản lý Tours
        </button>
        <button
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          Quản lý Bookings
        </button>
      </div>

      {activeTab === 'tours' && (
        <div className="admin-content">
          <div className="admin-actions">
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              + Tạo Tour Mới
            </button>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên Tour</th>
                <th>Địa điểm</th>
                <th>Giá</th>
                <th>Số ngày</th>
                <th>Số người tối đa</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour) => (
                <tr key={tour._id}>
                  <td>{tour.name}</td>
                  <td>{tour.location}</td>
                  <td>{tour.price.toLocaleString('vi-VN')}đ</td>
                  <td>{tour.days} ngày</td>
                  <td>{tour.maxGuests}</td>
                  <td>
                    <button
                      className="btn btn-small btn-secondary"
                      onClick={() => handleOpenModal(tour)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => handleDeleteTour(tour._id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="admin-content">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Email</th>
                <th>Tour</th>
                <th>Số người</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.customer.fullName}</td>
                  <td>{booking.customer.email}</td>
                  <td>{booking.tour?.name || 'N/A'}</td>
                  <td>{booking.partySize}</td>
                  <td>{booking.totalPrice.toLocaleString('vi-VN')}đ</td>
                  <td>
                    <span className={`status-badge status-${booking.status}`}>
                      {booking.status === 'paid' ? 'Đã thanh toán' : 
                       booking.status === 'unpaid' ? 'Chưa thanh toán' : 'Đã hủy'}
                    </span>
                  </td>
                  <td>
                    {booking.status === 'unpaid' && (
                      <>
                        <button
                          className="btn btn-small btn-success"
                          onClick={() => handleUpdateBookingStatus(booking._id, 'paid')}
                        >
                          Đánh dấu đã TT
                        </button>
                        <button
                          className="btn btn-small btn-danger"
                          onClick={() => handleUpdateBookingStatus(booking._id, 'cancelled')}
                        >
                          Hủy
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingTour ? 'Sửa Tour' : 'Tạo Tour Mới'}</h2>
            <form onSubmit={handleSubmitTour}>
              <div className="form-group">
                <label>Tên Tour *</label>
                <input
                  type="text"
                  name="name"
                  value={tourForm.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Ảnh bìa *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
                <p className="form-hint">Chỉ chấp nhận JPG, PNG, WEBP. Tối đa 5MB</p>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Giá (VNĐ) *</label>
                  <input
                    type="text"
                    name="price"
                    value={tourForm.price}
                    onChange={handlePriceChange}
                    placeholder="10,000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Địa điểm *</label>
                  <input
                    type="text"
                    name="location"
                    value={tourForm.location}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Số ngày *</label>
                  <input
                    type="number"
                    name="days"
                    value={tourForm.days}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Số người tối đa *</label>
                  <input
                    type="number"
                    name="maxGuests"
                    value={tourForm.maxGuests}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  name="description"
                  value={tourForm.description}
                  onChange={handleFormChange}
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Ngày khởi hành *</label>
                <div className="date-picker-group">
                  <input
                    type="date"
                    name="startDates"
                    value={tourForm.startDates}
                    onChange={handleFormChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-small"
                    onClick={handleAddDate}
                  >
                    Thêm ngày
                  </button>
                </div>
                
                {selectedDates.length > 0 && (
                  <div className="selected-dates">
                    <p className="form-hint">Các ngày đã chọn:</p>
                    <div className="date-tags">
                      {selectedDates.map((date, index) => (
                        <span key={index} className="date-tag">
                          {new Date(date).toLocaleDateString('vi-VN')}
                          <button 
                            type="button"
                            onClick={() => handleRemoveDate(date)}
                            className="remove-date"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Đang lưu...' : editingTour ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
