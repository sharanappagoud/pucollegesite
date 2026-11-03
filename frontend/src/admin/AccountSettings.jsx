import React, { useState, useEffect } from 'react';
import { User, Lock, Shield, CheckCircle2, AlertCircle, Save, KeyRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AccountSettings = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [securityInfo, setSecurityInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState(null);

  const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfile } = useForm();
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword } = useForm();

  const fetchProfile = () => {
    setLoading(true);
    Promise.all([
      api.get('/admin/account/me'),
      api.get('/admin/account/security-info')
    ])
      .then(([meRes, secRes]) => {
        if (meRes.success && meRes.data) {
          setProfile(meRes.data);
          resetProfile({
            fullName: meRes.data.fullName || '',
            email: meRes.data.email || '',
            phone: meRes.data.phone || ''
          });
        }
        if (secRes.success && secRes.data) {
          setSecurityInfo(secRes.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onProfileSubmit = async (data) => {
    setProfileSuccess(false);
    try {
      const res = await api.put('/admin/account/profile', data);
      if (res.success) {
        setProfile(res.data);
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      }
    } catch (err) {
      alert(err.message || 'Profile update failed');
    }
  };

  const onPasswordSubmit = async (data) => {
    setPasswordSuccess(false);
    setPasswordError(null);

    if (data.newPassword !== data.confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return;
    }
    if (data.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    try {
      const res = await api.put('/admin/account/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      if (res.success) {
        setPasswordSuccess(true);
        resetPassword();
        setTimeout(() => setPasswordSuccess(false), 3500);
      }
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Loading account profile...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Security & Account Settings</h1>
          <p className="admin-header-subtitle">
            Manage your administrator profile, change passwords, and inspect active session credentials
          </p>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '2rem' }}>
        {/* Profile Card */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} style={{ color: 'var(--primary-700)' }} /> Personal Administrator Profile
          </h3>

          {profileSuccess && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#dcfce7', color: '#15803d', padding: '0.65rem 0.85rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.88rem' }}>
              <CheckCircle2 size={16} /> Profile details saved successfully!
            </div>
          )}

          <div style={{ marginBottom: '1.25rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Username:</div>
            <div style={{ fontWeight: '700', fontFamily: 'monospace', color: 'var(--primary-900)', fontSize: '0.95rem' }}>
              {profile?.username}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Assigned Roles:</div>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
              {Array.from(profile?.roles || []).map(r => (
                <span key={r} style={{ fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#dbeafe', color: '#1e40af', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                  {r.replace('ROLE_', '')}
                </span>
              ))}
            </div>
          </div>

          <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" className="form-control" {...registerProfile('fullName', { required: true })} />
            </div>

            <div className="form-group">
              <label className="form-label">Official Email *</label>
              <input type="email" className="form-control" {...registerProfile('email', { required: true })} />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input type="text" className="form-control" {...registerProfile('phone')} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Save size={16} /> Save Profile
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div>
          <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <KeyRound size={20} style={{ color: '#d97706' }} /> Update Security Password
            </h3>

            {passwordSuccess && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#dcfce7', color: '#15803d', padding: '0.65rem 0.85rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.88rem' }}>
                <CheckCircle2 size={16} /> Password updated successfully!
              </div>
            )}
            {passwordError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.65rem 0.85rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.88rem' }}>
                <AlertCircle size={16} /> {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
              <div className="form-group">
                <label className="form-label">Current Password *</label>
                <input type="password" className="form-control" placeholder="••••••••" {...registerPassword('currentPassword', { required: true })} />
              </div>

              <div className="form-group">
                <label className="form-label">New Secure Password (min 6 chars) *</label>
                <input type="password" className="form-control" placeholder="••••••••" {...registerPassword('newPassword', { required: true, minLength: 6 })} />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password *</label>
                <input type="password" className="form-control" placeholder="••••••••" {...registerPassword('confirmPassword', { required: true })} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary btn-sm">
                  Change Password
                </button>
              </div>
            </form>
          </div>

          {/* Session Security Overview */}
          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #16a34a' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-900)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={16} style={{ color: '#16a34a' }} /> Session Security Health
            </h4>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div><strong>Authentication:</strong> {securityInfo?.sessionPolicy || 'Stateless JWT'}</div>
              <div><strong>Encryption:</strong> {securityInfo?.passwordStatus || 'BCrypt Hashed'}</div>
              <div><strong>Token Expiry:</strong> {securityInfo?.jwtExpiryMinutes || 1440} Minutes</div>
              <div><strong>Client Device:</strong> {securityInfo?.activeDevice || 'Web Browser'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
