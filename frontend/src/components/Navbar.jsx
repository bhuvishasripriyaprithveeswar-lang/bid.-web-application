import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';
import useTrack from '../hooks/useTrack';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const track = useTrack();

  const handleLogout = () => { track('logout-btn'); logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/about" className="navbar-brand" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span><span style={{ color: 'var(--danger)' }}>b</span>id.</span>
          <span style={{ fontSize: '.6rem', fontWeight: 400, color: 'var(--muted)', letterSpacing: '.02em', marginTop: '.15rem' }}>the W is yours.</span>
        </Link>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          {user ? (
            <>
              <Link to="/create-product" onClick={() => track('nav-sell-item')}>Sell Item</Link>
              <Link to="/my-products" onClick={() => track('nav-my-listings')}>My Listings</Link>
              <Link to="/wishlist" onClick={() => track('nav-wishlist')}>Wishlist</Link>
              {user.role === 'admin' && (
                <>
                  <Link to="/admin">Admin</Link>
                  <Link to="/admin/sales">Sales</Link>
                  <Link to="/admin/analytics">Analytics</Link>
                </>
              )}
              <NotificationPanel />
              <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
