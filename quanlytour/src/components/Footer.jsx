import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🌍 Travel Booking</h3>
            <p>Nền tảng đặt tour du lịch hàng đầu Việt Nam</p>
          </div>

          <div className="footer-section">
            <h4>Liên hệ</h4>
            <p>📧 Email: info@travelbooking.vn</p>
            <p>📞 Hotline: 1900-xxxx</p>
            <p>📍 Địa chỉ: Hà Nội, Việt Nam</p>
          </div>

          <div className="footer-section">
            <h4>Thông tin</h4>
            <ul>
              <li><a href="#">Về chúng tôi</a></li>
              <li><a href="#">Điều khoản</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Theo dõi</h4>
            <div className="social-links">
              <a href="#">Facebook</a>
              <a href="#">Instagram</a>
              <a href="#">YouTube</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Travel Booking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
