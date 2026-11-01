import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { problemService } from '../services/api';
import { HelpCircle, ArrowLeft, Save, AlertCircle, Sparkles } from 'lucide-react';

const ProblemFormPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical',
    severity: 'Medium',
    description: '',
    initialSolution: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and problem description are required');
      return;
    }

    try {
      setSaving(true);
      const res = await problemService.createProblem(formData);
      const createdId = res.data.problem._id;
      navigate(`/problems/${createdId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record problem');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-page-container">
      <div className="mb-3">
        <Link to="/problems" className="back-link">
          <ArrowLeft size={16} /> Back to Problem Solver
        </Link>
      </div>

      <div className="card form-card">
        <div className="card-header">
          <div className="flex items-center gap-2">
            <HelpCircle size={22} className="text-purple" />
            <h2 className="card-title">Record Problem or Technical Block</h2>
          </div>
          <p className="card-subtitle">
            Document symptoms, classify root domains, and record hypothetical solutions
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
                Problem Title / Issue Summary <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="e.g. MongoDB Connection Timeout in Cloud Environment"
                value={formData.title}
                onChange={handleChange}
                maxLength={140}
                required
              />
            </div>

            <div className="grid grid-2 gap-3">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Technical">Technical</option>
                  <option value="Academic">Academic</option>
                  <option value="Algorithm">Algorithm</option>
                  <option value="Debugging">Debugging</option>
                  <option value="Logic">Logic</option>
                  <option value="System">System</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Severity Level</label>
                <select
                  name="severity"
                  className="form-control"
                  value={formData.severity}
                  onChange={handleChange}
                >
                  <option value="Low">Low (Minor annoyance)</option>
                  <option value="Medium">Medium (Impacting workflow)</option>
                  <option value="High">High (Major blocker)</option>
                  <option value="Critical">Critical (System down / complete roadblock)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Detailed Problem Description <span className="text-danger">*</span>
              </label>
              <textarea
                name="description"
                className="form-control"
                rows={4}
                placeholder="Explain the context, error messages, stack trace, and conditions where the issue occurs..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label flex items-center gap-1">
                <Sparkles size={16} className="text-purple" />
                Initial Hypothesis / First Solution Attempt (Optional)
              </label>
              <textarea
                name="initialSolution"
                className="form-control"
                rows={3}
                placeholder="Record the first action or hypothesis you plan to test..."
                value={formData.initialSolution}
                onChange={handleChange}
              />
              <small className="text-muted">
                You can add more solutions and track outcomes anytime from the Problem Workspace.
              </small>
            </div>

            <div className="form-actions mt-4 flex gap-2 justify-end">
              <Link to="/problems" className="btn btn-outline">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-purple"
                disabled={saving}
              >
                <Save size={18} />
                {saving ? 'Recording...' : 'Save Problem & Open Workspace'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProblemFormPage;
