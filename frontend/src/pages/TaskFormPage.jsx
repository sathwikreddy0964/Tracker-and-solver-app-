import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { taskService } from '../services/api';
import { CheckSquare, ArrowLeft, Save, AlertCircle } from 'lucide-react';

const TaskFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  // Tomorrow's date formatted as YYYY-MM-DD
  const defaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'pending',
    dueDate: defaultDueDate(),
  });

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      taskService
        .getTaskById(id)
        .then((res) => {
          const t = res.data.task;
          setFormData({
            title: t.title || '',
            description: t.description || '',
            priority: t.priority || 'Medium',
            status: t.status || 'pending',
            dueDate: t.dueDate ? t.dueDate.split('T')[0] : defaultDueDate(),
          });
        })
        .catch((err) => {
          setError(err.response?.data?.message || 'Failed to load task details');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.description.trim() || !formData.dueDate) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      if (isEditMode) {
        await taskService.updateTask(id, formData);
      } else {
        await taskService.createTask(formData);
      }
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Loading task details...</p>
      </div>
    );
  }

  return (
    <div className="form-page-container">
      <div className="mb-3">
        <Link to="/tasks" className="back-link">
          <ArrowLeft size={16} /> Back to Tasks
        </Link>
      </div>

      <div className="card form-card">
        <div className="card-header">
          <div className="flex items-center gap-2">
            <CheckSquare size={22} className="text-primary" />
            <h2 className="card-title">
              {isEditMode ? 'Edit Task' : 'Create New Task'}
            </h2>
          </div>
          <p className="card-subtitle">
            {isEditMode
              ? 'Update the parameters and progress of this task'
              : 'Define a task with priority, due date, and detailed specifications'}
          </p>
        </div>

        <div className="card-body">
          {error && (
            <div className="alert alert-danger mb-4">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="standard-form">
            <div className="form-group">
              <label className="form-label">
                Task Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="e.g. Implement User Authentication with JWT"
                value={formData.title}
                onChange={handleChange}
                maxLength={120}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Task Description <span className="text-danger">*</span>
              </label>
              <textarea
                name="description"
                className="form-control"
                rows={4}
                placeholder="Detailed breakdown of tasks, requirements, and deliverables..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-3 gap-3">
              <div className="form-group">
                <label className="form-label">Priority Level</label>
                <select
                  name="priority"
                  className="form-control"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Due Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  name="dueDate"
                  className="form-control"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions mt-4 flex gap-2 justify-end">
              <Link to="/tasks" className="btn btn-outline">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                <Save size={18} />
                {saving ? 'Saving Task...' : isEditMode ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskFormPage;
