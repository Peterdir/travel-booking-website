import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tourAPI } from '../services/api';
import './TourDetail.css';

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTour();
  }, [id]);

  const fetchTour = async () => {
    try {
      const response = await tourAPI.getById(id);
      setTour(response.data);
    } catch (error) {
      console.error('Error fetching tour:', error);
      alert('Không thể tải thông tin tour');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    navigate(`/booking/${id}`);
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (!tour) return <div className="error">Không tìm thấy tour</div>;

  return (
    <div className="tour-detail">
      <div className="tour-hero">
        <img src={tour.coverImage} alt={tour.name} />
        <div className="tour-hero-overlay">
          <h1>{tour.name}</h1>
          <p className="location">📍 {tour.location}</p>
        </div>
      </div>

      <div className="tour-content">
        <div className="tour-main">
          <section className="tour-section">
            <h2>Mô tả</h2>
            <p>{tour.description || 'Chưa có mô tả'}</p>
          </section>

          <section className="tour-section">
            <h2>Thông tin tour</h2>
            <ul className="tour-details-list">
              <li>⏱️ Thời gian: <strong>{tour.days} ngày {tour.days - 1} đêm</strong></li>
              <li>👥 Số người tối đa: <strong>{tour.maxGuests} người</strong></li>
              <li>💰 Giá: <strong>{tour.price.toLocaleString('vi-VN')}đ/người</strong></li>
            </ul>
          </section>

          <section className="tour-section">
            <h2>Lịch khởi hành</h2>
            <div className="start-dates">
              {tour.startDates?.map((date, index) => (
                <div key={index} className="date-item">
                  📅 {new Date(date).toLocaleDateString('vi-VN')}
                </div>
              ))}
            </div>
          </section>

          {tour.availability && tour.availability.length > 0 && (
            <section className="tour-section">
              <h2>Số chỗ còn lại</h2>
              <div className="availability-list">
                {tour.availability.map((avail, index) => (
                  <div key={index} className="availability-item">
                    <span>{new Date(avail.startDate).toLocaleDateString('vi-VN')}</span>
                    <span className={avail.remaining > 0 ? 'available' : 'full'}>
                      {avail.remaining > 0 ? `${avail.remaining} chỗ` : 'Đã hết chỗ'}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="tour-sidebar">
          <div className="booking-card">
            <h3>Đặt tour ngay</h3>
            <p className="price-highlight">{tour.price.toLocaleString('vi-VN')}đ</p>
            <p className="price-note">Giá/người</p>
            <button className="btn btn-primary btn-large" onClick={handleBooking}>
              Đặt ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
