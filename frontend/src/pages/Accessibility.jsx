import React from 'react';

export const Accessibility = () => {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '850px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--primary-900)' }}>Accessibility Statement</h1>
        <div style={{ color: 'var(--text-main)', lineHeight: '1.8', fontSize: '0.95rem' }}>
          <p>
            Sri Vidyodaya Composite Pre-University College is dedicated to ensuring digital accessibility for people with disabilities. We continually improve the user experience for all visitors and adhere to relevant accessibility standards (WCAG 2.1 Level AA guidelines).
          </p>
          <h3 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-800)' }}>Keyboard Navigation & Screen Readers</h3>
          <p>
            All critical workflows, including navigation, course browsing, and admission enquiry form submission, are designed to be fully navigable via keyboard and compatible with assistive screen reader technology.
          </p>
        </div>
      </div>
    </div>
  );
};
