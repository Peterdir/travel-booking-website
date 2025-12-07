import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          🌍 Travel Booking
        </Link>

        <ul className="navbar-menu">
          <li><Link to="/">Trang chủ</Link></li>
          <li><Link to="/tours">Tours</Link></li>
          
          {isAuthenticated ? (
            <>
              {isAdmin() && (
                <li><Link to="/admin">Quản trị</Link></li>
              )}
              <li className="user-menu">
                <span>👤 {user?.fullName}</span>
                <button onClick={handleLogout} className="btn btn-small">
                  Đăng xuất
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">Đăng nhập</Link></li>
              <li><Link to="/register" className="btn btn-primary btn-small">Đăng ký</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
