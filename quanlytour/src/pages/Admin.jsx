import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tourAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
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
      setTourForm({
        name: tour.name,
        coverImage: tour.coverImage,
        price: tour.price,
        location: tour.location,
        days: tour.days,
        maxGuests: tour.maxGuests,
        description: tour.description || '',
        startDates: tour.startDates?.map(d => new Date(d).toISOString().split('T')[0]).join(', ') || '',
      });
    } else {
      setEditingTour(null);
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
  };

  const handleFormChange = (e) => {
    setTourForm({ ...tourForm, [e.target.name]: e.target.value });
  };

  const handleSubmitTour = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const startDatesArray = tourForm.startDates
        .split(',')
        .map(date => new Date(date.trim()).toISOString());

      const availability = startDatesArray.map(date => ({
        startDate: date,
        remaining: Number(tourForm.maxGuests)
      }));

      const tourData = {
        ...tourForm,
        price: Number(tourForm.price),
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
                <label>Ảnh bìa (URL) *</label>
                <input
                  type="url"
                  name="coverImage"
                  value={tourForm.coverImage}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Giá (VNĐ) *</label>
                  <input
                    type="number"
                    name="price"
                    value={tourForm.price}
                    onChange={handleFormChange}
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
                <label>Ngày khởi hành (phân cách bằng dấu phẩy) *</label>
                <input
                  type="text"
                  name="startDates"
                  value={tourForm.startDates}
                  onChange={handleFormChange}
                  placeholder="2025-12-15, 2025-12-20"
                  required
                />
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
