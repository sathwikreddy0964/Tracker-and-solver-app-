import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CheckSquare,
  PlusCircle,
  HelpCircle,
  PlusSquare,
  TrendingUp,
  User,
  ShieldAlert,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/tasks', label: 'Task Tracker', icon: <CheckSquare size={20} /> },
    { to: '/tasks/new', label: 'Create Task', icon: <PlusCircle size={20} /> },
    { to: '/problems', label: 'Problem Solver', icon: <HelpCircle size={20} /> },
    { to: '/problems/new', label: 'Record Problem', icon: <PlusSquare size={20} /> },
    { to: '/progress', label: 'Progress Tracking', icon: <TrendingUp size={20} /> },
    { to: '/profile', label: 'My Profile', icon: <User size={20} /> },
  ];

  if (isAdmin) {
    navItems.push({
      to: '/admin',
      label: 'Admin Console',
      icon: <ShieldAlert size={20} />,
      isAdminOnly: true,
    });
  }

  return (
    <>
      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-section-title">MAIN NAVIGATION</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''} ${item.isAdminOnly ? 'admin-link' : ''}`
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
              {item.isAdminOnly && <span className="sidebar-badge">Admin</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-academic-tag">
            <small>B.Tech CSE Project</small>
            <span>v1.0.0 Stable</span>
          </div>
        </div>
      </aside>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
    </>
  );
};

export default Sidebar;
