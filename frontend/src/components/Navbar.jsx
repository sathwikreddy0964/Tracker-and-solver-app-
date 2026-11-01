import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, LogOut, User, ShieldCheck, CheckCircle2 } from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-navbar">
      <div className="navbar-left">
        {isAuthenticated && (
          <button
            className="btn-icon sidebar-toggle-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <Menu size={22} />
          </button>
        )}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="navbar-brand">
          <div className="brand-icon">
            <CheckCircle2 size={24} color="#3b82f6" />
          </div>
          <span className="brand-text">
            Tracker<strong>&</strong>Solver
          </span>
        </Link>
      </div>

      <div className="navbar-right">
        {isAuthenticated ? (
          <div className="user-menu">
            <Link to="/profile" className="user-info-pill" title="View Profile">
              <div className="user-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-details-mini">
                <span className="user-name">{user?.name}</span>
                {isAdmin && (
                  <span className="admin-badge">
                    <ShieldCheck size={12} /> Admin
                  </span>
                )}
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm logout-btn"
              title="Sign Out"
            >
              <LogOut size={16} />
              <span className="btn-text">Logout</span>
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="btn btn-outline">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
