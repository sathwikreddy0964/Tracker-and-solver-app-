import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import StatCard from '../components/StatCard';
import {
  ShieldAlert,
  Users,
  CheckSquare,
  HelpCircle,
  Award,
  Trash2,
  UserCheck,
  UserX,
  AlertTriangle,
  RefreshCw,
  Search,
} from 'lucide-react';

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [problems, setProblems] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsRes, usersRes, tasksRes, probsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
        adminService.getAllTasks(),
        adminService.getAllProblems(),
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users || []);
      setTasks(tasksRes.data.tasks || []);
      setProblems(probsRes.data.problems || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch administrative data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (
      window.confirm(
        `Are you sure you want to change this user's role to "${newRole.toUpperCase()}"?`
      )
    ) {
      try {
        await adminService.updateUserRole(userId, newRole);
        setUsers(
          users.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to update user role');
      }
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (
      window.confirm(
        `DANGER: Are you sure you want to permanently delete user "${userName}"? All their tasks and problem logs will also be permanently deleted.`
      )
    ) {
      try {
        await adminService.deleteUser(userId);
        setUsers(users.filter((u) => u._id !== userId));
        fetchAdminData(); // Refresh overall stats
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Loading administrative dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header flex-between flex-wrap gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <ShieldAlert size={26} className="text-danger" /> System Administration Console
          </h1>
          <p className="page-subtitle">
            System-wide analytics, account access controls, and multi-tenant management
          </p>
        </div>
        <button className="btn btn-outline" onClick={fetchAdminData}>
          <RefreshCw size={16} /> Refresh Telemetry
        </button>
      </div>

      {error && (
        <div className="alert alert-danger mb-4">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Admin KPI Stats Grid */}
      <div className="stats-grid mb-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          subtitle={`${stats?.totalAdmins || 0} Administrators`}
          icon={<Users size={22} color="#3b82f6" />}
          color="blue"
        />
        <StatCard
          title="Total System Tasks"
          value={stats?.totalTasks || 0}
          subtitle={`${stats?.completedTasks || 0} completed (${stats?.taskCompletionRate || 0}%)`}
          icon={<CheckSquare size={22} color="#10b981" />}
          color="green"
        />
        <StatCard
          title="Total Problems Logged"
          value={stats?.totalProblems || 0}
          subtitle={`${stats?.solvedProblems || 0} resolved (${stats?.problemSolveRate || 0}%)`}
          icon={<HelpCircle size={22} color="#8b5cf6" />}
          color="purple"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs-nav mb-4">
        <button
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={16} /> User Management ({users.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <CheckSquare size={16} /> All Tasks ({tasks.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'problems' ? 'active' : ''}`}
          onClick={() => setActiveTab('problems')}
        >
          <HelpCircle size={16} /> All Problems ({problems.length})
        </button>
      </div>

      {/* Tab 1: User Management */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="card-header flex-between flex-wrap gap-2">
            <h3 className="card-title">Registered Accounts</h3>
            <div className="search-input-wrap" style={{ maxWidth: '280px' }}>
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="form-control"
                placeholder="Search user by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Tasks Logged</th>
                    <th>Problems Logged</th>
                    <th>Joined</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar-sm">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{u.name}</strong>
                            <div className="text-xs text-muted">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            u.role === 'admin' ? 'badge-priority-high' : 'badge-category'
                          }`}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td>{u.taskCount} tasks</td>
                      <td>{u.problemCount} problems</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            className="btn btn-xs btn-outline"
                            title={
                              u.role === 'admin'
                                ? 'Demote to regular user'
                                : 'Promote to administrator'
                            }
                            onClick={() => handleRoleToggle(u._id, u.role)}
                          >
                            {u.role === 'admin' ? (
                              <UserX size={14} className="text-warning" />
                            ) : (
                              <UserCheck size={14} className="text-success" />
                            )}
                            <span className="ml-1">
                              {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                            </span>
                          </button>
                          <button
                            className="btn btn-xs btn-outline-danger"
                            title="Delete User"
                            onClick={() => handleDeleteUser(u._id, u.name)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: System-Wide Tasks */}
      {activeTab === 'tasks' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">All Tasks Across System</h3>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Task Title</th>
                    <th>Assigned User</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t) => (
                    <tr key={t._id}>
                      <td>
                        <strong>{t.title}</strong>
                        <div className="text-xs text-muted line-clamp-1">{t.description}</div>
                      </td>
                      <td>
                        {t.user?.name || 'Unknown'}
                        <div className="text-xs text-muted">{t.user?.email}</div>
                      </td>
                      <td>
                        <span className={`badge badge-priority-${t.priority.toLowerCase()}`}>
                          {t.priority}
                        </span>
                      </td>
                      <td>{new Date(t.dueDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-pill status-${t.status}`}>{t.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: System-Wide Problems */}
      {activeTab === 'problems' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">All Problems &amp; Hypotheses Across System</h3>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Problem Title</th>
                    <th>User</th>
                    <th>Category</th>
                    <th>Severity</th>
                    <th>Attempts</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {problems.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <strong>{p.title}</strong>
                        <div className="text-xs text-muted line-clamp-1">{p.description}</div>
                      </td>
                      <td>
                        {p.user?.name || 'Unknown'}
                        <div className="text-xs text-muted">{p.user?.email}</div>
                      </td>
                      <td>
                        <span className="badge badge-category">{p.category}</span>
                      </td>
                      <td>
                        <span className={`badge badge-severity-${p.severity.toLowerCase()}`}>
                          {p.severity}
                        </span>
                      </td>
                      <td>{p.solutions?.length || 0} attempts</td>
                      <td>
                        <span className={`status-pill status-${p.status.toLowerCase().replace(' ', '-')}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
