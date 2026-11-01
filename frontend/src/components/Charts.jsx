import React, { useState } from 'react';

// Linear Progress Bar
export const ProgressBar = ({ percentage, color = '#3b82f6', height = 10, label }) => {
  const safePercent = Math.min(Math.max(percentage || 0, 0), 100);
  return (
    <div className="progress-bar-wrapper">
      {label && (
        <div className="progress-bar-label">
          <span>{label}</span>
          <span className="font-semibold">{safePercent}%</span>
        </div>
      )}
      <div className="progress-bar-track" style={{ height: `${height}px` }}>
        <div
          className="progress-bar-fill"
          style={{
            width: `${safePercent}%`,
            backgroundColor: color,
            height: `${height}px`,
          }}
        />
      </div>
    </div>
  );
};

// SVG Donut / Pie Chart for Task Statuses
export const StatusDonutChart = ({ pending = 0, inProgress = 0, completed = 0 }) => {
  const total = pending + inProgress + completed;
  if (total === 0) {
    return (
      <div className="empty-chart-notice">
        <p>No tasks recorded yet to display distribution.</p>
      </div>
    );
  }

  const pPending = (pending / total) * 100;
  const pProgress = (inProgress / total) * 100;
  const pCompleted = (completed / total) * 100;

  // SVG circle circumference = 2 * PI * r
  const r = 40;
  const c = 2 * Math.PI * r;

  const strokePending = (pPending / 100) * c;
  const strokeProgress = (pProgress / 100) * c;
  const strokeCompleted = (pCompleted / 100) * c;

  const offsetPending = 0;
  const offsetProgress = -strokePending;
  const offsetCompleted = -(strokePending + strokeProgress);

  return (
    <div className="donut-chart-container">
      <div className="donut-svg-wrapper">
        <svg viewBox="0 0 100 100" className="donut-svg">
          {/* Background circle */}
          <circle cx="50" cy="50" r={r} fill="transparent" stroke="#e2e8f0" strokeWidth="14" />
          {/* Completed Segment */}
          {completed > 0 && (
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="transparent"
              stroke="#10b981"
              strokeWidth="14"
              strokeDasharray={`${strokeCompleted} ${c}`}
              strokeDashoffset={offsetCompleted}
              className="donut-segment"
            />
          )}
          {/* In-Progress Segment */}
          {inProgress > 0 && (
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="transparent"
              stroke="#3b82f6"
              strokeWidth="14"
              strokeDasharray={`${strokeProgress} ${c}`}
              strokeDashoffset={offsetProgress}
              className="donut-segment"
            />
          )}
          {/* Pending Segment */}
          {pending > 0 && (
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth="14"
              strokeDasharray={`${strokePending} ${c}`}
              strokeDashoffset={offsetPending}
              className="donut-segment"
            />
          )}
        </svg>
        <div className="donut-center-text">
          <span className="donut-total">{total}</span>
          <span className="donut-label">Total</span>
        </div>
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color-dot" style={{ backgroundColor: '#10b981' }} />
          <span className="legend-name">Completed</span>
          <span className="legend-count">{completed} ({Math.round(pCompleted)}%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color-dot" style={{ backgroundColor: '#3b82f6' }} />
          <span className="legend-name">In Progress</span>
          <span className="legend-count">{inProgress} ({Math.round(pProgress)}%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color-dot" style={{ backgroundColor: '#f59e0b' }} />
          <span className="legend-name">Pending</span>
          <span className="legend-count">{pending} ({Math.round(pPending)}%)</span>
        </div>
      </div>
    </div>
  );
};

// Weekly Trend Bar Chart (Tasks Created vs Completed)
export const WeeklyTrendChart = ({ data = [] }) => {
  const [hovered, setHovered] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="empty-chart-notice">
        <p>No activity logs recorded in the last 7 days.</p>
      </div>
    );
  }

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.created || 0, d.completed || 0)),
    4
  );

  return (
    <div className="bar-chart-container">
      <div className="chart-legend mb-3 justify-center">
        <div className="legend-item">
          <span className="legend-color-dot" style={{ backgroundColor: '#6366f1' }} />
          <span className="legend-name">Tasks Created</span>
        </div>
        <div className="legend-item">
          <span className="legend-color-dot" style={{ backgroundColor: '#10b981' }} />
          <span className="legend-name">Tasks Completed</span>
        </div>
      </div>

      <div className="trend-bars-grid">
        {data.map((item, index) => {
          const createdH = Math.round(((item.created || 0) / maxVal) * 120);
          const completedH = Math.round(((item.completed || 0) / maxVal) * 120);

          return (
            <div
              key={index}
              className="trend-bar-column"
              onMouseEnter={() => setHovered(item)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="trend-bars-pair">
                <div
                  className="trend-bar created-bar"
                  style={{ height: `${Math.max(createdH, 4)}px` }}
                  title={`Created: ${item.created}`}
                />
                <div
                  className="trend-bar completed-bar"
                  style={{ height: `${Math.max(completedH, 4)}px` }}
                  title={`Completed: ${item.completed}`}
                />
              </div>
              <span className="trend-bar-day">{item.day}</span>
            </div>
          );
        })}
      </div>

      {hovered && (
        <div className="chart-tooltip-badge">
          <strong>{hovered.day}</strong>: {hovered.created} Created, {hovered.completed} Completed
        </div>
      )}
    </div>
  );
};

// Horizontal Category Distribution Chart
export const CategoryBarChart = ({ distribution = {} }) => {
  const entries = Object.entries(distribution);
  if (entries.length === 0) {
    return (
      <div className="empty-chart-notice">
        <p>No problem categories recorded yet.</p>
      </div>
    );
  }

  const maxVal = Math.max(...Object.values(distribution), 1);
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#06b6d4', '#64748b'];

  return (
    <div className="category-bars-container">
      {entries.map(([category, count], idx) => {
        const percent = Math.round((count / maxVal) * 100);
        const color = colors[idx % colors.length];

        return (
          <div key={category} className="category-row">
            <div className="category-meta">
              <span className="category-name">{category}</span>
              <span className="category-count">{count}</span>
            </div>
            <div className="category-track">
              <div
                className="category-fill"
                style={{ width: `${percent}%`, backgroundColor: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
