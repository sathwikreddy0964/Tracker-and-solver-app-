import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { problemService } from '../services/api';
import {
  HelpCircle,
  PlusSquare,
  Search,
  Filter,
  CheckCircle2,
  Tag,
  AlertTriangle,
  ArrowRight,
  Trash2,
  History,
} from 'lucide-react';

const ProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchProblems = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (severityFilter !== 'all') params.severity = severityFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res = await problemService.getProblems(params);
      setProblems(res.data.problems || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch problems');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProblems();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, categoryFilter, severityFilter, statusFilter]);

  const handleDelete = async (probId, title) => {
    if (window.confirm(`Are you sure you want to delete problem record: "${title}"?`)) {
      try {
        await problemService.deleteProblem(probId);
        setProblems(problems.filter((p) => p._id !== probId));
      } catch (err) {
        alert('Failed to delete problem');
      }
    }
  };

  return (
    <div className="problems-page">
      <div className="page-header flex-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Problem Solver</h1>
          <p className="page-subtitle">
            Log technical obstacles, formulate hypotheses, and track resolution histories
          </p>
        </div>
        <Link to="/problems/new" className="btn btn-purple">
          <PlusSquare size={18} /> Record New Problem
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card filter-bar-card mb-4">
        <div className="card-body">
          <div className="filter-grid filter-grid-4">
            <div className="search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search problems by keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-select-wrap">
              <Tag size={16} className="filter-icon" />
              <select
                className="form-control"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Technical">Technical</option>
                <option value="Academic">Academic</option>
                <option value="Algorithm">Algorithm</option>
                <option value="Debugging">Debugging</option>
                <option value="Logic">Logic</option>
                <option value="System">System</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="filter-select-wrap">
              <select
                className="form-control"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <option value="all">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="filter-select-wrap">
              <select
                className="form-control"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Solved">Solved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger mb-4">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="page-loading">
          <div className="spinner"></div>
          <p>Loading problems and hypotheses...</p>
        </div>
      ) : problems.length > 0 ? (
        <div className="problem-cards-grid">
          {problems.map((problem) => {
            const isSolved = problem.status === 'Solved';
            return (
              <div
                key={problem._id}
                className={`problem-card ${isSolved ? 'problem-card-solved' : ''}`}
              >
                <div className="problem-card-header">
                  <div className="problem-badges">
                    <span className="badge badge-category">{problem.category}</span>
                    <span className={`badge badge-severity-${problem.severity.toLowerCase()}`}>
                      {problem.severity}
                    </span>
                  </div>
                  <div className="problem-actions-top">
                    <button
                      className="btn-icon-link btn-icon-delete"
                      onClick={() => handleDelete(problem._id, problem.title)}
                      title="Delete Problem"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <Link to={`/problems/${problem._id}`} className="problem-card-title-link">
                  <h3 className="problem-card-title">{problem.title}</h3>
                </Link>
                <p className="problem-card-desc">{problem.description}</p>

                <div className="problem-card-footer">
                  <div className="problem-solution-count">
                    <History size={14} />
                    <span>{problem.solutions?.length || 0} solution attempts</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`status-pill status-${problem.status.toLowerCase().replace(' ', '-')}`}>
                      {problem.status}
                    </span>
                    <Link
                      to={`/problems/${problem._id}`}
                      className="btn btn-xs btn-outline-purple"
                    >
                      Solve <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card empty-state-card text-center p-5">
          <HelpCircle size={48} className="text-muted mb-3" />
          <h3>No problems logged</h3>
          <p className="text-muted">
            {search || categoryFilter !== 'all' || severityFilter !== 'all' || statusFilter !== 'all'
              ? 'No problems match the specified criteria.'
              : 'Log an issue or problem to start experimenting with solutions!'}
          </p>
          <Link to="/problems/new" className="btn btn-purple mt-3">
            <PlusSquare size={18} /> Record New Problem
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProblemsPage;
