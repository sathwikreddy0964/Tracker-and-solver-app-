import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService, taskService } from '../services/api';
import StatCard from '../components/StatCard';
import {
  ProgressBar,
  StatusDonutChart,
  WeeklyTrendChart,
  CategoryBarChart,
} from '../components/Charts';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Award,
  PlusCircle,
  PlusSquare,
  ArrowRight,
  Calendar,
  Tag,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsRes, progRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getProgress(),
      ]);
      setStats(statsRes.data.stats);
      setProgress(progRes.data.progress);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleQuickStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      fetchDashboardData(); // Refresh stats
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard analytics...</p>
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
    <div className="dashboard-page">
      {/* Header with Greeting & Quick Actions */}
      <div className="page-header flex-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Workspace Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, <strong>{user?.name}</strong>. Here is your productivity summary.
          </p>
        </div>
        <div className="header-actions flex gap-2">
          <Link to="/tasks/new" className="btn btn-primary">
            <PlusCircle size={18} /> Add Task
          </Link>
          <Link to="/problems/new" className="btn btn-purple">
            <PlusSquare size={18} /> Record Problem
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Tasks"
          value={stats?.totalTasks || 0}
          subtitle="All tasks logged"
          icon={<CheckSquare size={22} color="#3b82f6" />}
          color="blue"
        />
        <StatCard
          title="Pending Tasks"
          value={stats?.pendingTasks || 0}
          subtitle="Awaiting action"
          icon={<Clock size={22} color="#f59e0b" />}
          color="yellow"
        />
        <StatCard
          title="Completed Tasks"
          value={stats?.completedTasks || 0}
          subtitle={`${stats?.taskCompletionRate || 0}% completion`}
          icon={<CheckCircle2 size={22} color="#10b981" />}
          color="green"
        />
        <StatCard
          title="Total Problems"
          value={stats?.totalProblems || 0}
          subtitle="Issues tracked"
          icon={<HelpCircle size={22} color="#8b5cf6" />}
          color="purple"
        />
        <StatCard
          title="Solved Problems"
          value={stats?.solvedProblems || 0}
          subtitle={`${stats?.problemSolveRate || 0}% resolution`}
          icon={<Award size={22} color="#ec4899" />}
          color="pink"
        />
      </div>

      {/* Productivity Progress Bars */}
      <div className="progress-overview-card card mb-4">
        <div className="card-header">
          <h3 className="card-title">Overall Performance Rates</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-2 gap-4">
            <div>
              <ProgressBar
                percentage={stats?.taskCompletionRate || 0}
                color="#10b981"
                height={12}
                label="Task Completion Rate"
              />
              <small className="text-muted">
                {stats?.completedTasks || 0} out of {stats?.totalTasks || 0} tasks finished
              </small>
            </div>
            <div>
              <ProgressBar
                percentage={stats?.problemSolveRate || 0}
                color="#8b5cf6"
                height={12}
                label="Problem Resolution Rate"
              />
              <small className="text-muted">
                {stats?.solvedProblems || 0} out of {stats?.totalProblems || 0} problems solved
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-3 gap-4 mb-4">
        {/* Weekly Trend Bar Chart */}
        <div className="card col-span-2">
          <div className="card-header">
            <h3 className="card-title">Weekly Activity Velocity (Last 7 Days)</h3>
          </div>
          <div className="card-body">
            <WeeklyTrendChart data={progress?.last7Days} />
          </div>
        </div>

        {/* Task Status Donut Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Task Breakdown</h3>
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

      {/* Recent Activity Sections */}
      <div className="grid grid-2 gap-4">
        {/* Recent Tasks */}
        <div className="card">
          <div className="card-header flex-between">
            <h3 className="card-title">Recent Tasks</h3>
            <Link to="/tasks" className="card-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="card-body p-0">
            {stats?.recentTasks && stats.recentTasks.length > 0 ? (
              <div className="activity-list">
                {stats.recentTasks.map((t) => (
                  <div key={t._id} className="activity-item">
                    <div className="activity-main">
                      <div className="activity-title-row">
                        <h4 className="activity-title">{t.title}</h4>
                        <span className={`badge badge-priority-${t.priority.toLowerCase()}`}>
                          {t.priority}
                        </span>
                      </div>
                      <p className="activity-desc">{t.description}</p>
                      <div className="activity-meta">
                        <span className="meta-item">
                          <Calendar size={13} /> Due:{' '}
                          {new Date(t.dueDate).toLocaleDateString()}
                        </span>
                        <span className={`status-pill status-${t.status}`}>
                          {t.status}
                        </span>
                      </div>
                    </div>
                    <div className="activity-actions">
                      {t.status !== 'completed' ? (
                        <button
                          className="btn btn-xs btn-outline-success"
                          onClick={() => handleQuickStatusChange(t._id, 'completed')}
                          title="Mark Completed"
                        >
                          Mark Done
                        </button>
                      ) : (
                        <button
                          className="btn btn-xs btn-outline"
                          onClick={() => handleQuickStatusChange(t._id, 'pending')}
                          title="Reopen Task"
                        >
                          Reopen
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state p-4 text-center">
                <CheckSquare size={32} className="text-muted mb-2" />
                <p>No tasks recorded yet.</p>
                <Link to="/tasks/new" className="btn btn-sm btn-primary mt-2">
                  Create First Task
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Problems */}
        <div className="card">
          <div className="card-header flex-between">
            <h3 className="card-title">Recent Problems &amp; Hypotheses</h3>
            <Link to="/problems" className="card-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="card-body p-0">
            {stats?.recentProblems && stats.recentProblems.length > 0 ? (
              <div className="activity-list">
                {stats.recentProblems.map((p) => (
                  <div key={p._id} className="activity-item">
                    <div className="activity-main">
                      <div className="activity-title-row">
                        <Link to={`/problems/${p._id}`} className="activity-title link">
                          {p.title}
                        </Link>
                        <span className={`badge badge-severity-${p.severity.toLowerCase()}`}>
                          {p.severity}
                        </span>
                      </div>
                      <p className="activity-desc">{p.description}</p>
                      <div className="activity-meta">
                        <span className="meta-item">
                          <Tag size={13} /> {p.category}
                        </span>
                        <span className="meta-item">
                          {p.solutions?.length || 0} solution attempts
                        </span>
                        <span className={`status-pill status-${p.status.toLowerCase().replace(' ', '-')}`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                    <div className="activity-actions">
                      <Link to={`/problems/${p._id}`} className="btn btn-xs btn-outline-primary">
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state p-4 text-center">
                <HelpCircle size={32} className="text-muted mb-2" />
                <p>No problems logged yet.</p>
                <Link to="/problems/new" className="btn btn-sm btn-purple mt-2">
                  Record First Problem
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
