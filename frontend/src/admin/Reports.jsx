import React, { useState, useEffect } from 'react';
import { BarChart3, Download, FileSpreadsheet, Users, UserCheck, BookOpen, Award, ShieldAlert, CheckCircle } from 'lucide-react';
import api from '../services/api';

export const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  const fetchSummary = () => {
    setLoading(true);
    api.get('/admin/reports/summary')
      .then(res => {
        if (res.success) setSummary(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const downloadCsv = async (endpoint, filename) => {
    setDownloading(filename);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/admin/reports/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('CSV Export request failed');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err.message || 'Export error');
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Generating analytics report...</p>
      </div>
    );
  }

  const statusBreakdown = summary?.applicationStatusBreakdown || {};
  const streamBreakdown = summary?.enquiryStreamBreakdown || {};

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Reports & CSV Data Export</h1>
          <p className="admin-header-subtitle">
            Institutional metrics, admission funnel conversion analytics, and compliant CSV downloads
          </p>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary-700)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admission Enquiries</div>
          <div style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--primary-900)', marginTop: '0.25rem' }}>
            {summary?.totalEnquiries || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#16a34a', marginTop: '0.25rem' }}>Prospective candidates</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #0284c7' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Formal Applications</div>
          <div style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--primary-900)', marginTop: '0.25rem' }}>
            {summary?.totalApplications || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#0284c7', marginTop: '0.25rem' }}>Verified registrations</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #16a34a' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Faculty Members</div>
          <div style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--primary-900)', marginTop: '0.25rem' }}>
            {summary?.totalFaculty || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#16a34a', marginTop: '0.25rem' }}>Active teaching staff</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #d97706' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>State Ranks & Awards</div>
          <div style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--primary-900)', marginTop: '0.25rem' }}>
            {summary?.totalAchievements || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#d97706', marginTop: '0.25rem' }}>Hall of fame records</div>
        </div>
      </div>

      {/* Visual Funnel and Stream Breakdowns */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Application Status Funnel */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserCheck size={18} style={{ color: 'var(--primary-700)' }} /> Admission Application Status Funnel
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['SUBMITTED', 'VERIFIED', 'APPROVED', 'ADMITTED', 'REJECTED'].map(st => {
              const count = statusBreakdown[st] || 0;
              const total = summary?.totalApplications || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={st}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: '600' }}>{st}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      backgroundColor: st === 'ADMITTED' ? '#16a34a' : st === 'APPROVED' ? '#0284c7' : st === 'VERIFIED' ? '#f59e0b' : st === 'REJECTED' ? '#ef4444' : '#64748b'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stream Breakdown */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={18} style={{ color: 'var(--primary-700)' }} /> Stream Preference Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(streamBreakdown).map(([stream, count]) => {
              const total = summary?.totalEnquiries || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={stream}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: '600' }}>{stream} Stream</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} enquiries ({pct}%)</span>
                  </div>
                  <div style={{ height: '10px', backgroundColor: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      backgroundColor: stream === 'SCIENCE' ? 'var(--primary-700)' : '#d97706'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CSV Downloads Section */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileSpreadsheet size={22} style={{ color: '#16a34a' }} /> Download Institutional CSV Data Files
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Export sanitized, comma-separated spreadsheets for government reporting, board submissions, or offline audit.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {/* Card 1 */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>Admission Enquiries CSV</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Full export of visitor leads, boards, parent contacts, and status</p>
            </div>
            <button
              onClick={() => downloadCsv('enquiries/csv', 'admission_enquiries')}
              disabled={downloading === 'admission_enquiries'}
              className="btn btn-outline-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              <Download size={14} /> {downloading === 'admission_enquiries' ? 'Generating...' : 'Export Enquiries'}
            </button>
          </div>

          {/* Card 2 */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>Student Applications CSV</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Formal admissions roster, 10th marks percentages, addresses, and workflow status</p>
            </div>
            <button
              onClick={() => downloadCsv('applications/csv', 'student_applications')}
              disabled={downloading === 'student_applications'}
              className="btn btn-outline-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              <Download size={14} /> {downloading === 'student_applications' ? 'Generating...' : 'Export Applications'}
            </button>
          </div>

          {/* Card 3 */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>Faculty Directory CSV</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Teaching staff roster, qualifications, departments, and experience</p>
            </div>
            <button
              onClick={() => downloadCsv('faculty/csv', 'faculty_directory')}
              disabled={downloading === 'faculty_directory'}
              className="btn btn-outline-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              <Download size={14} /> {downloading === 'faculty_directory' ? 'Generating...' : 'Export Faculty'}
            </button>
          </div>

          {/* Card 4 */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>Audit Trail History CSV</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Administrative change log, timestamped actions, and operator logins</p>
            </div>
            <button
              onClick={() => downloadCsv('audit-logs/csv', 'audit_trail')}
              disabled={downloading === 'audit_trail'}
              className="btn btn-outline-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              <Download size={14} /> {downloading === 'audit_trail' ? 'Generating...' : 'Export Audit Logs'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
