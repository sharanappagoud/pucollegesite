import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="section" style={{ textAlign: 'center', padding: '6rem 0' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div style={{
          width: '70px', height: '70px',
          backgroundColor: 'var(--primary-50)', color: 'var(--primary-800)',
          borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <GraduationCap size={36} />
        </div>
        <h1 style={{ fontSize: '4.5rem', fontWeight: '800', color: 'var(--primary-900)', lineHeight: '1', marginBottom: '0.5rem' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          The requested page could not be located on the college website. It may have been moved or updated.
        </p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} /> Return to Homepage
        </Link>
      </div>
    </div>
  );
};
