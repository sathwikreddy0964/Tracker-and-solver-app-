import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../services/api';
import {
  CheckSquare,
  PlusCircle,
  Search,
  Filter,
  Calendar,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      if (search.trim()) params.search = search.trim();

      const res = await taskService.getTasks(params);
      setTasks(res.data.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchTasks();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter, priorityFilter]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      fetchTasks();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (taskId, title) => {
    if (window.confirm(`Are you sure you want to delete task: "${title}"?`)) {
      try {
        await taskService.deleteTask(taskId);
        setTasks(tasks.filter((t) => t._id !== taskId));
      } catch (err) {
        alert('Failed to delete task');
      }
    }
  };

  return (
    <div className="tasks-page">
      <div className="page-header flex-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Task Management</h1>
          <p className="page-subtitle">Track, filter, and complete your daily goals</p>
        </div>
        <Link to="/tasks/new" className="btn btn-primary">
          <PlusCircle size={18} /> New Task
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card filter-bar-card mb-4">
        <div className="card-body">
          <div className="filter-grid">
            <div className="search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search tasks by title or details..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-select-wrap">
              <Filter size={16} className="filter-icon" />
              <select
                className="form-control"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="filter-select-wrap">
              <select
                className="form-control"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="alert alert-danger mb-4">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Tasks Grid / List */}
      {loading ? (
        <div className="page-loading">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      ) : tasks.length > 0 ? (
        <div className="task-cards-grid">
          {tasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isOverdue =
              !isCompleted && new Date(task.dueDate) < new Date();

            return (
              <div
                key={task._id}
                className={`task-card ${isCompleted ? 'task-card-completed' : ''} ${
                  isOverdue ? 'task-card-overdue' : ''
                }`}
              >
                <div className="task-card-header">
                  <span className={`badge badge-priority-${task.priority.toLowerCase()}`}>
                    {task.priority} Priority
                  </span>
                  <div className="task-actions-top">
                    <Link
                      to={`/tasks/edit/${task._id}`}
                      className="btn-icon-link"
                      title="Edit Task"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <button
                      className="btn-icon-link btn-icon-delete"
                      onClick={() => handleDelete(task._id, task.title)}
                      title="Delete Task"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="task-card-title">{task.title}</h3>
                <p className="task-card-desc">{task.description}</p>

                <div className="task-card-footer">
                  <div className="task-date-info">
                    <Calendar size={14} />
                    <span className={isOverdue ? 'text-danger font-semibold' : ''}>
                      {new Date(task.dueDate).toLocaleDateString()}
                      {isOverdue && ' (Overdue)'}
                    </span>
                  </div>

                  <div className="task-status-selector">
                    <select
                      className={`status-select status-${task.status}`}
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card empty-state-card text-center p-5">
          <CheckSquare size={48} className="text-muted mb-3" />
          <h3>No tasks found</h3>
          <p className="text-muted">
            {search || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try adjusting your search filters.'
              : 'Start by creating your first task!'}
          </p>
          <Link to="/tasks/new" className="btn btn-primary mt-3">
            <PlusCircle size={18} /> Create New Task
          </Link>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
