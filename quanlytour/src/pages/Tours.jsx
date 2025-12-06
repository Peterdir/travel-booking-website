import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tourAPI } from '../services/api';
import './Tours.css';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    days: ''
  });

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async (filterParams = {}) => {
    try {
      setLoading(true);
      const response = await tourAPI.getAll(filterParams);
      setTours(response.data);
    } catch (error) {
      console.error('Error fetching tours:', error);
      alert('Không thể tải danh sách tour');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    fetchTours(cleanFilters);
  };

  const handleReset = () => {
    setFilters({ location: '', minPrice: '', maxPrice: '', days: '' });
    fetchTours();
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="tours-page">
      <div className="tours-header">
        <h1>Khám Phá Các Tour Du Lịch</h1>
        <p>Tìm kiếm và đặt tour du lịch yêu thích của bạn</p>
      </div>

      <form className="filter-form" onSubmit={handleSearch}>
        <input
          type="text"
          name="location"
          placeholder="Địa điểm (VD: Đà Lạt)"
          value={filters.location}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="minPrice"
          placeholder="Giá từ"
          value={filters.minPrice}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Giá đến"
          value={filters.maxPrice}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="days"
          placeholder="Số ngày"
          value={filters.days}
          onChange={handleFilterChange}
        />
        <button type="submit" className="btn btn-primary">Tìm kiếm</button>
        <button type="button" className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
      </form>

      <div className="tours-grid">
        {tours.length === 0 ? (
          <p className="no-tours">Không tìm thấy tour nào</p>
        ) : (
          tours.map((tour) => (
            <div key={tour._id} className="tour-card">
              <img src={tour.coverImage} alt={tour.name} />
              <div className="tour-info">
                <h3>{tour.name}</h3>
                <p className="location">📍 {tour.location}</p>
                <p className="duration">⏱️ {tour.days} ngày</p>
                <p className="price">{tour.price.toLocaleString('vi-VN')}đ/người</p>
                <p className="description">{tour.description?.substring(0, 100)}...</p>
                <Link to={`/tours/${tour._id}`} className="btn btn-primary">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tours;
