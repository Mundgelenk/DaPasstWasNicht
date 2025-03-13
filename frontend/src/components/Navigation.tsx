import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <nav className="bottom-navigation">
      <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        <span className="nav-icon">🏠</span>
        <span className="nav-text">Home</span>
      </NavLink>
      
      <NavLink to="/report" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        <span className="nav-icon">📷</span>
        <span className="nav-text">Report</span>
      </NavLink>
      
      <NavLink to="/issues" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        <span className="nav-icon">📋</span>
        <span className="nav-text">Issues</span>
      </NavLink>
      
      <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        <span className="nav-icon">👤</span>
        <span className="nav-text">Profile</span>
      </NavLink>
    </nav>
  );
};

export default Navigation; 