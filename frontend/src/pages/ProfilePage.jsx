import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Calendar,
  Save,
  CheckCircle,
  AlertCircle,
  KeyRound,
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile, isAdmin } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!name.trim() || !email.trim()) {
      setErrorMsg('Name and email cannot be blank');
      return;
    }

    const payload = { name: name.trim(), email: email.trim() };

    if (newPassword) {
      if (newPassword.length < 6) {
        setErrorMsg('New password must be at least 6 characters long');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('New passwords do not match');
        return;
      }
      payload.password = newPassword;
    }

    try {
      setSaving(true);
      await updateProfile(payload);
      setSuccessMsg('Profile updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1 className="page-title">User Account Profile</h1>
        <p className="page-subtitle">Manage your personal credentials, identity, and security preferences</p>
      </div>

      <div className="grid grid-3 gap-4">
        {/* Left Column: User Card */}
        <div className="card profile-info-card">
          <div className="card-body text-center">
            <div className="profile-avatar-large">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 className="profile-name mt-2">{user?.name}</h2>
            <p className="profile-email text-muted">{user?.email}</p>

            <div className="profile-badge-row mt-3">
              <span className={`badge ${isAdmin ? 'badge-priority-high' : 'badge-category'}`}>
                <ShieldCheck size={14} /> {user?.role?.toUpperCase()} ACCOUNT
              </span>
            </div>

            <div className="profile-meta-list mt-4 text-left">
              <div className="profile-meta-item">
                <Calendar size={16} className="text-muted" />
                <span>Account ID: <code className="text-xs">{user?._id}</code></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Update Form */}
        <div className="card col-span-2">
          <div className="card-header">
            <h3 className="card-title flex items-center gap-2">
              <User size={18} className="text-primary" /> Edit Account Details &amp; Password
            </h3>
          </div>

          <div className="card-body">
            {successMsg && (
              <div className="alert alert-success mb-4">
                <CheckCircle size={18} />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="alert alert-danger mb-4">
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="standard-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <hr className="my-4 form-divider" />

              <h4 className="section-subtitle-sm flex items-center gap-2 mb-3">
                <KeyRound size={16} className="text-muted" /> Change Password (Optional)
              </h4>

              <div className="grid grid-2 gap-3">
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Leave blank to keep current"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Re-type new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions mt-4 flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={saving}
                >
                  <Save size={18} />
                  {saving ? 'Saving Changes...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
