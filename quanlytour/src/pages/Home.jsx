import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Khám Phá Việt Nam Cùng Chúng Tôi</h1>
          <p>Trải nghiệm những chuyến du lịch tuyệt vời với các tour chất lượng cao</p>
          <Link to="/tours" className="btn btn-primary btn-large">
            Khám phá ngay
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Tại sao chọn chúng tôi?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌟</div>
              <h3>Tour chất lượng</h3>
              <p>Các tour được tuyển chọn kỹ lưỡng với dịch vụ tốt nhất</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Giá cả hợp lý</h3>
              <p>Cam kết giá tốt nhất thị trường, minh bạch và rõ ràng</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>An toàn đảm bảo</h3>
              <p>Bảo hiểm du lịch và đội ngũ hỗ trợ 24/7</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Đặt tour nhanh chóng</h3>
              <p>Chỉ vài bước đơn giản để hoàn tất đặt tour</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Sẵn sàng cho chuyến đi tiếp theo?</h2>
          <p>Hàng trăm tour đang chờ bạn khám phá</p>
          <Link to="/tours" className="btn btn-primary btn-large">
            Xem tất cả tour
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
