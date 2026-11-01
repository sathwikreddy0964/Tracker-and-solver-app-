import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';
import {
  ProgressBar,
  WeeklyTrendChart,
  CategoryBarChart,
  StatusDonutChart,
} from '../components/Charts';
import {
  TrendingUp,
  Calendar,
  CheckCircle2,
  Award,
  Zap,
  Flame,
  Target,
  BarChart3,
  AlertTriangle,
} from 'lucide-react';

const ProgressPage = () => {
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, progRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getProgress(),
        ]);
        setStats(statsRes.data.stats);
        setProgress(progRes.data.progress);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load progress statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Crunching productivity analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-4">
        <AlertTriangle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="progress-page">
      <div className="page-header">
        <h1 className="page-title flex items-center gap-2">
          <TrendingUp size={26} className="text-primary" /> Productivity &amp; Velocity Analytics
        </h1>
        <p className="page-subtitle">
          Longitudinal insights into your daily, weekly, and monthly task execution and problem resolution
        </p>
      </div>

      {/* Timeframe Progress Cards */}
      <div className="stats-grid mb-4">
        {/* Daily Card */}
        <div className="stat-card stat-card-blue">
          <div className="stat-card-body">
            <div className="stat-card-info">
              <span className="stat-card-title flex items-center gap-1">
                <Flame size={16} color="#3b82f6" /> Today's Achievements
              </span>
              <h3 className="stat-card-value">
                {progress?.daily?.tasksCompleted || 0}{' '}
                <span className="text-sm font-normal text-muted">Tasks Done</span>
              </h3>
              <span className="stat-card-subtitle">
                {progress?.daily?.problemsSolved || 0} Problems Solved Today
              </span>
            </div>
            <div className="stat-card-icon-wrap icon-bg-blue">
              <Calendar size={22} />
            </div>
          </div>
        </div>

        {/* Weekly Card */}
        <div className="stat-card stat-card-green">
          <div className="stat-card-body">
            <div className="stat-card-info">
              <span className="stat-card-title flex items-center gap-1">
                <Zap size={16} color="#10b981" /> This Week's Velocity
              </span>
              <h3 className="stat-card-value">
                {progress?.weekly?.tasksCompleted || 0}{' '}
                <span className="text-sm font-normal text-muted">Tasks Done</span>
              </h3>
              <span className="stat-card-subtitle">
                {progress?.weekly?.problemsSolved || 0} Problems Resolved
              </span>
            </div>
            <div className="stat-card-icon-wrap icon-bg-green">
              <Target size={22} />
            </div>
          </div>
        </div>

        {/* Monthly Card */}
        <div className="stat-card stat-card-purple">
          <div className="stat-card-body">
            <div className="stat-card-info">
              <span className="stat-card-title flex items-center gap-1">
                <BarChart3 size={16} color="#8b5cf6" /> This Month's Milestone
              </span>
              <h3 className="stat-card-value">
                {progress?.monthly?.tasksCompleted || 0}{' '}
                <span className="text-sm font-normal text-muted">Tasks Done</span>
              </h3>
              <span className="stat-card-subtitle">
                {progress?.monthly?.problemsSolved || 0} Problems Resolved
              </span>
            </div>
            <div className="stat-card-icon-wrap icon-bg-purple">
              <Award size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Completion Percentage Section */}
      <div className="grid grid-2 gap-4 mb-4">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green" /> Overall Task Completion Rate
            </h3>
          </div>
          <div className="card-body">
            <div className="big-stat-display mb-3">
              <span className="big-stat-number text-green">{stats?.taskCompletionRate || 0}%</span>
              <span className="text-muted ml-2">Efficiency Rating</span>
            </div>
            <ProgressBar
              percentage={stats?.taskCompletionRate || 0}
              color="#10b981"
              height={14}
            />
            <div className="flex-between mt-3 text-sm text-muted">
              <span>Completed: {stats?.completedTasks || 0}</span>
              <span>Pending / In-Progress: {(stats?.pendingTasks || 0) + (stats?.inProgressTasks || 0)}</span>
              <span>Total: {stats?.totalTasks || 0}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center gap-2">
              <Award size={18} className="text-purple" /> Problem Resolution Success Rate
            </h3>
          </div>
          <div className="card-body">
            <div className="big-stat-display mb-3">
              <span className="big-stat-number text-purple">{stats?.problemSolveRate || 0}%</span>
              <span className="text-muted ml-2">Resolution Rate</span>
            </div>
            <ProgressBar
              percentage={stats?.problemSolveRate || 0}
              color="#8b5cf6"
              height={14}
            />
            <div className="flex-between mt-3 text-sm text-muted">
              <span>Solved: {stats?.solvedProblems || 0}</span>
              <span>Open / In Progress: {(stats?.openProblems || 0) + (stats?.inProgressProblems || 0)}</span>
              <span>Total Logged: {stats?.totalProblems || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-2 gap-4 mb-4">
        {/* 7-day activity velocity */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Daily Execution Velocity (Past 7 Days)</h3>
          </div>
          <div className="card-body">
            <WeeklyTrendChart data={progress?.last7Days} />
          </div>
        </div>

        {/* Problem Categories Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Problem Classification by Domain</h3>
          </div>
          <div className="card-body">
            <CategoryBarChart distribution={progress?.categoryDistribution} />
          </div>
        </div>
      </div>

      {/* Priority Distribution & Task Status breakdown */}
      <div className="grid grid-2 gap-4">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Task Distribution by Priority</h3>
          </div>
          <div className="card-body">
            <div className="priority-summary-grid">
              <div className="priority-summary-box priority-high">
                <h4>High Priority</h4>
                <p className="priority-val">{progress?.priorityDistribution?.High || 0}</p>
                <small>Requires immediate focus</small>
              </div>
              <div className="priority-summary-box priority-medium">
                <h4>Medium Priority</h4>
                <p className="priority-val">{progress?.priorityDistribution?.Medium || 0}</p>
                <small>Standard workflows</small>
              </div>
              <div className="priority-summary-box priority-low">
                <h4>Low Priority</h4>
                <p className="priority-val">{progress?.priorityDistribution?.Low || 0}</p>
                <small>Non-blocking items</small>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Task Status Proportions</h3>
          </div>
          <div className="card-body">
            <StatusDonutChart
              pending={stats?.pendingTasks || 0}
              inProgress={stats?.inProgressTasks || 0}
              completed={stats?.completedTasks || 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
