import React from 'react';

const StatCard = ({ title, value, subtitle, icon, color = 'blue', onClick }) => {
  return (
    <div
      className={`stat-card stat-card-${color} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      <div className="stat-card-body">
        <div className="stat-card-info">
          <span className="stat-card-title">{title}</span>
          <h3 className="stat-card-value">{value}</h3>
          {subtitle && <span className="stat-card-subtitle">{subtitle}</span>}
        </div>
        <div className={`stat-card-icon-wrap icon-bg-${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
