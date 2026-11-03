import React from 'react';

export const PrivacyPolicy = () => {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '850px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--primary-900)' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Last Updated: October 2026 | In compliance with Indian Digital Personal Data Protection (DPDP) Act.
        </p>

        <div style={{ color: 'var(--text-main)', lineHeight: '1.8', fontSize: '0.95rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-800)' }}>1. Collection of Student Information</h3>
          <p>
            Sri Vidyodaya Composite Pre-University College collects personal details including candidate name, guardian details, telephone contact, academic marks records, and email addresses solely for administering admission applications, counselling, and official Pre-University Board reporting.
          </p>

          <h3 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-800)' }}>2. Purpose and Data Utilization</h3>
          <p>
            Information supplied via admission enquiry forms is used to generate official registration references, evaluate eligibility, schedule counselling, and communicate board circulars.
          </p>

          <h3 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-800)' }}>3. Non-Disclosure & Security</h3>
          <p>
            We do not sell, rent, or trade student records to commercial marketing agencies. Access to submitted enquiries is restricted to authenticated college administrative staff and protected by secure encryption.
          </p>
        </div>
      </div>
    </div>
  );
};
