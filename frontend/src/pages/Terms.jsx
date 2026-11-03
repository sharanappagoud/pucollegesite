import React from 'react';

export const Terms = () => {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '850px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--primary-900)' }}>Terms & Conditions</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Effective: Academic Year 2026-27
        </p>

        <div style={{ color: 'var(--text-main)', lineHeight: '1.8', fontSize: '0.95rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-800)' }}>1. Admission Enquiry & Seat Allotment</h3>
          <p>
            Submission of an online admission enquiry or application does not constitute a confirmed admission. Final admission is granted strictly based on merit, seat availability in the chosen combination (PCMB, PCMC, CEBA, MEBA, SEBA, MSBA), document verification, and fee payment.
          </p>

          <h3 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-800)' }}>2. Academic Code of Conduct</h3>
          <p>
            Students admitted to Sri Vidyodaya Composite PU College are subject to the disciplinary regulations of the Karnataka Pre-University Education Board and college administration regarding minimum 75% attendance and mandatory uniform compliance.
          </p>
        </div>
      </div>
    </div>
  );
};
