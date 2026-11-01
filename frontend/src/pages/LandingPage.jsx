import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Database,
  Layers,
  Sparkles,
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} /> Advanced Academic MERN Stack Application
          </div>
          <h1 className="hero-title">
            Organize Tasks. <span className="highlight-text">Solve Complex Problems.</span> Boost Productivity.
          </h1>
          <p className="hero-subtitle">
            A comprehensive, full-stack workflow system integrating structured daily activity
            management, systematic problem &amp; hypothesis tracking, and real-time velocity analytics.
          </p>

          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Your Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Create Free Account <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>

          <div className="tech-stack-strip">
            <span className="tech-badge"><Database size={16} /> MongoDB</span>
            <span className="tech-badge"><Layers size={16} /> Express.js</span>
            <span className="tech-badge"><Layers size={16} /> React.js</span>
            <span className="tech-badge"><Layers size={16} /> Node.js</span>
            <span className="tech-badge"><ShieldCheck size={16} /> JWT Auth</span>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="features-section">
        <div className="section-header text-center">
          <h2 className="section-title">Engineered for Technical Excellence</h2>
          <p className="section-subtitle">
            Built following industry-standard MERN architecture with clear separation of concerns.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon bg-blue">
              <CheckCircle2 size={28} />
            </div>
            <h3>Intelligent Task Tracker</h3>
            <p>
              Create, organize, and prioritize daily activities with custom due dates, status cycles
              (Pending, In-Progress, Completed), dynamic filtering, and search capabilities.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon bg-purple">
              <HelpCircle size={28} />
            </div>
            <h3>Structured Problem Solver</h3>
            <p>
              Record technical roadblocks, categorize by domain (Algorithm, Debugging, Logic, System),
              maintain a step-by-step solution attempt history, and document final resolutions.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon bg-green">
              <TrendingUp size={28} />
            </div>
            <h3>Velocity &amp; Progress Analytics</h3>
            <p>
              Monitor your daily, weekly, and monthly completion ratios with interactive visual metrics,
              category heatmaps, and priority distributions.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon bg-amber">
              <ShieldCheck size={28} />
            </div>
            <h3>Role-Based Access &amp; Admin Console</h3>
            <p>
              Strict data isolation ensures users only see their own tasks and problems. Administrators
              benefit from system-wide oversight, user management, and health telemetry.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="cta-banner">
        <div className="cta-container">
          <h2>Ready to streamline your workflow?</h2>
          <p>Register today and gain complete clarity over your tasks and problem solutions.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
