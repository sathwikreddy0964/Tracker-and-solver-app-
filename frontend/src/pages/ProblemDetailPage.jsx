import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { problemService } from '../services/api';
import {
  HelpCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  History,
  Send,
  Award,
  AlertTriangle,
  Calendar,
  Tag,
  ShieldAlert,
  RotateCcw,
} from 'lucide-react';

const ProblemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add solution state
  const [solutionText, setSolutionText] = useState('');
  const [outcome, setOutcome] = useState('Attempted');
  const [submittingSolution, setSubmittingSolution] = useState(false);

  // Mark solved modal state
  const [isSolving, setIsSolving] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [savingResolution, setSavingResolution] = useState(false);

  const fetchProblem = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await problemService.getProblemById(id);
      setProblem(res.data.problem);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch problem details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const handleAddSolution = async (e) => {
    e.preventDefault();
    if (!solutionText.trim()) return;

    try {
      setSubmittingSolution(true);
      const res = await problemService.addSolution(id, {
        solutionText: solutionText.trim(),
        outcome,
      });
      setProblem(res.data.problem);
      setSolutionText('');
      setOutcome('Attempted');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add solution attempt');
    } finally {
      setSubmittingSolution(false);
    }
  };

  const handleMarkSolved = async (e) => {
    e.preventDefault();
    try {
      setSavingResolution(true);
      const res = await problemService.solveProblem(id, { resolutionNotes });
      setProblem(res.data.problem);
      setIsSolving(false);
      setResolutionNotes('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark problem as solved');
    } finally {
      setSavingResolution(false);
    }
  };

  const handleReopen = async () => {
    if (window.confirm('Do you want to reopen this problem for further investigation?')) {
      try {
        const res = await problemService.updateProblem(id, {
          status: 'In Progress',
        });
        setProblem(res.data.problem);
      } catch (err) {
        alert('Failed to reopen problem');
      }
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Loading problem solver workspace...</p>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="alert alert-danger my-4">
        <AlertTriangle size={20} />
        <span>{error || 'Problem not found'}</span>
      </div>
    );
  }

  const isSolved = problem.status === 'Solved';

  return (
    <div className="problem-detail-page">
      <div className="mb-3 flex-between">
        <Link to="/problems" className="back-link">
          <ArrowLeft size={16} /> Back to Problem Solver
        </Link>
        <div className="flex gap-2">
          {!isSolved ? (
            <button
              className="btn btn-success"
              onClick={() => setIsSolving(true)}
            >
              <CheckCircle size={18} /> Mark as Solved
            </button>
          ) : (
            <button className="btn btn-outline" onClick={handleReopen}>
              <RotateCcw size={16} /> Reopen Problem
            </button>
          )}
        </div>
      </div>

      {/* Solved Banner */}
      {isSolved && (
        <div className="alert alert-success solved-banner mb-4">
          <Award size={24} />
          <div>
            <h4 className="font-bold">Problem Successfully Resolved!</h4>
            <p>
              Solved on: {new Date(problem.solvedAt).toLocaleString()}
            </p>
            {problem.resolutionNotes && (
              <p className="mt-1">
                <strong>Resolution Notes:</strong> {problem.resolutionNotes}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Problem Card */}
      <div className="card mb-4">
        <div className="card-header">
          <div className="flex-between flex-wrap gap-2">
            <div className="problem-badges">
              <span className="badge badge-category">
                <Tag size={12} /> {problem.category}
              </span>
              <span className={`badge badge-severity-${problem.severity.toLowerCase()}`}>
                <ShieldAlert size={12} /> {problem.severity} Severity
              </span>
              <span className={`status-pill status-${problem.status.toLowerCase().replace(' ', '-')}`}>
                {problem.status}
              </span>
            </div>
            <span className="text-muted text-sm flex items-center gap-1">
              <Calendar size={13} /> Recorded: {new Date(problem.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="problem-main-title mt-2">{problem.title}</h1>
        </div>

        <div className="card-body">
          <div className="problem-description-box">
            <h4 className="section-subtitle-sm">Problem Description &amp; Context:</h4>
            <p className="problem-description-text">{problem.description}</p>
          </div>
        </div>
      </div>

      {/* Modal: Mark As Solved */}
      {isSolving && (
        <div className="modal-backdrop">
          <div className="modal-dialog card">
            <div className="card-header">
              <h3 className="card-title flex items-center gap-2">
                <Award size={20} className="text-success" /> Mark Problem as Resolved
              </h3>
            </div>
            <form onSubmit={handleMarkSolved} className="card-body">
              <p className="text-muted mb-3">
                Summarize what finally fixed this issue so you and your team can reference it in the future.
              </p>
              <div className="form-group">
                <label className="form-label">Final Resolution Summary / Root Cause</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="e.g. Updated mongoose connection string with replicaSet parameter and restarted cluster."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsSolving(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={savingResolution}
                >
                  {savingResolution ? 'Saving...' : 'Confirm Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Solutions Section & Timeline */}
      <div className="grid grid-2 gap-4">
        {/* Solution History Timeline */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center gap-2">
              <History size={18} className="text-purple" /> Solution History &amp; Attempts (
              {problem.solutions?.length || 0})
            </h3>
          </div>

          <div className="card-body">
            {problem.solutions && problem.solutions.length > 0 ? (
              <div className="timeline">
                {problem.solutions.map((sol, index) => (
                  <div key={sol._id || index} className="timeline-item">
                    <div className="timeline-badge" />
                    <div className="timeline-content">
                      <div className="timeline-header flex-between">
                        <span className={`outcome-pill outcome-${sol.outcome.toLowerCase().replace(' ', '-')}`}>
                          {sol.outcome}
                        </span>
                        <span className="text-xs text-muted">
                          {new Date(sol.recordedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="timeline-text mt-2">{sol.solutionText}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state text-center p-4">
                <Clock size={32} className="text-muted mb-2" />
                <p>No solution attempts recorded yet.</p>
                <small className="text-muted">
                  Use the form on the right to log your first hypothesis or diagnostic step.
                </small>
              </div>
            )}
          </div>
        </div>

        {/* Add Solution Attempt Form */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center gap-2">
              <Send size={18} className="text-primary" /> Log New Solution Attempt
            </h3>
          </div>

          <div className="card-body">
            <form onSubmit={handleAddSolution} className="standard-form">
              <div className="form-group">
                <label className="form-label">Solution Attempt / Hypothesis</label>
                <textarea
                  className="form-control"
                  rows={5}
                  placeholder="Detail the technical approach or configuration tested..."
                  value={solutionText}
                  onChange={(e) => setSolutionText(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Outcome of this Attempt</label>
                <select
                  className="form-control"
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                >
                  <option value="Attempted">Attempted (Inconclusive or didn't work)</option>
                  <option value="Partially Effective">Partially Effective (Progress made)</option>
                  <option value="Resolved">Resolved (This fixed the issue!)</option>
                </select>
                <small className="text-muted">
                  Selecting <strong>Resolved</strong> will automatically mark this problem as Solved.
                </small>
              </div>

              <button
                type="submit"
                className="btn btn-purple btn-block mt-3"
                disabled={submittingSolution}
              >
                <Send size={16} />
                {submittingSolution ? 'Recording...' : 'Record Solution Attempt'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailPage;
