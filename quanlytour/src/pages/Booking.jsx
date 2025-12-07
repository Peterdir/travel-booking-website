import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tourAPI, bookingAPI } from '../services/api';
import { formatPrice } from '../utils/helpers';
import './Booking.css';

const Booking = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    startDate: '',
    fullName: '',
    email: '',
    phone: '',
    partySize: 1
  });

  useEffect(() => {
    fetchTour();
  }, [tourId]);

  const fetchTour = async () => {
    try {
      const response = await tourAPI.getById(tourId);
      setTour(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Không thể tải thông tin tour');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    return tour ? tour.price * formData.partySize : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.startDate) {
      alert('Vui lòng chọn ngày khởi hành');
      return;
    }

    try {
      const bookingData = {
        tour: tourId,
        startDate: formData.startDate,
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone
        },
        partySize: Number(formData.partySize)
      };

      await bookingAPI.create(bookingData);
      alert('Đặt tour thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
      navigate('/tours');
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Đặt tour thất bại. Vui lòng thử lại.');
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (!tour) return <div className="error">Không tìm thấy tour</div>;

  return (
    <div className="booking-page">
      <h1>Đặt Tour: {tour.name}</h1>
      
      <div className="booking-container">
        <form className="booking-form" onSubmit={handleSubmit}>
          <h2>Thông tin đặt tour</h2>

          <div className="form-group">
            <label>Ngày khởi hành *</label>
            <select
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            >
              <option value="">Chọn ngày khởi hành</option>
              {tour.startDates?.map((date, index) => (
                <option key={index} value={date}>
                  {new Date(date).toLocaleDateString('vi-VN')}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Số người *</label>
            <input
              type="number"
              name="partySize"
              min="1"
              max={tour.maxGuests}
              value={formData.partySize}
              onChange={handleChange}
              required
            />
          </div>

          <h2>Thông tin liên hệ</h2>

          <div className="form-group">
            <label>Họ và tên *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0123456789"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-large">
            Xác nhận đặt tour
          </button>
        </form>

        <div className="booking-summary">
          <h2>Tóm tắt đặt tour</h2>
          <div className="summary-item">
            <span>Tour:</span>
            <strong>{tour.name}</strong>
          </div>
          <div className="summary-item">
            <span>Địa điểm:</span>
            <strong>{tour.location}</strong>
          </div>
          <div className="summary-item">
            <span>Thời gian:</span>
            <strong>{tour.days} ngày</strong>
          </div>
          <div className="summary-item">
            <span>Giá/người:</span>
            <strong>{tour.price.toLocaleString('vi-VN')}đ</strong>
          </div>
          <div className="summary-item">
            <span>Số người:</span>
            <strong>{formData.partySize}</strong>
          </div>
          <hr />
          <div className="summary-total">
            <span>Tổng tiền:</span>
            <strong className="total-price">
              {calculateTotal().toLocaleString('vi-VN')}đ
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
