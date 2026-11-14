import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Lock, User, ArrowLeft, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const [loginError, setLoginError] = useState(
    location.state?.accessDenied ? 'This account is not authorized to use the admin portal.' : ''
  );
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setLoginError('');
    const res = await login(data.username, data.password);
    setSubmitting(false);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setLoginError(res.message || 'Invalid username or password');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--primary-950)',
      padding: '1.5rem',
      position: 'relative'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '54px', height: '54px',
            backgroundColor: 'var(--primary-50)',
            color: 'var(--primary-800)',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem auto',
            border: '2px solid var(--gold-500)'
          }}>
            <Shield size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-900)', fontWeight: '800' }}>
            SVCPUC Portal
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Authorized administrators only
          </p>
        </div>

        {loginError && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #f87171',
            color: '#b91c1c',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Username or Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. admin"
                style={{ paddingLeft: '2.4rem' }}
                {...register('username', { required: 'Username is required' })}
              />
              <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
            {errors.username && <span className="form-error">{errors.username.message}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                style={{ paddingLeft: '2.4rem' }}
                {...register('password', { required: 'Password is required' })}
              />
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
          >
            {submitting ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          fontSize: '0.8rem',
          color: '#475569',
          lineHeight: '1.4'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ color: '#0f172a' }}>Default Credentials:</strong>
            <button
              type="button"
              onClick={() => {
                const userInput = document.querySelector('input[name="username"]');
                const passInput = document.querySelector('input[name="password"]');
                if (userInput) { userInput.value = 'admin'; userInput.dispatchEvent(new Event('input', { bubbles: true })); }
                if (passInput) { passInput.value = 'Admin@2026!'; passInput.dispatchEvent(new Event('input', { bubbles: true })); }
              }}
              style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
            >
              Autofill
            </button>
          </div>
          <div style={{ marginTop: '0.25rem' }}>
            User: <code style={{ color: '#1e40af', fontWeight: '700' }}>admin</code> &bull; Pass: <code style={{ color: '#1e40af', fontWeight: '700' }}>Admin@2026!</code>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <ArrowLeft size={14} /> Back to Public College Website
          </Link>
        </div>
      </div>
    </div>
  );
};
