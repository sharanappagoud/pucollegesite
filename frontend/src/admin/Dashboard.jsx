import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserCheck, BookOpen, Users, Newspaper, 
  Calendar, MessageSquare, ArrowUpRight, Clock, 
  AlertCircle, CheckCircle2, ShieldAlert, GraduationCap, Settings 
} from 'lucide-react';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { navbarBrandName, navbarBrandSub, navbarBrandTagline } = useSettings();

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => {
        if (res.success) {
          setStats(res.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading dashboard statistics...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--primary-900)' }}>Administrative Dashboard</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Overview of admissions, courses, faculty, and website activities
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/examinations" className="btn btn-outline-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
            <GraduationCap size={15} /> Examinations & PDFs
          </Link>
          <Link to="/admin/settings" className="btn btn-outline-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Settings size={15} /> Navbar Branding
          </Link>
          <Link to="/admin/enquiries" className="btn btn-gold btn-sm">
            <UserCheck size={16} /> Manage Admission Enquiries
          </Link>
        </div>
      </div>

      {/* Navbar Branding Quick Access Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #07172C 0%, #133E87 100%)',
        color: '#ffffff',
        borderRadius: '12px',
        padding: '1.25rem 1.75rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 4px 15px rgba(7, 23, 44, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            backgroundColor: 'rgba(212, 175, 55, 0.2)',
            border: '1.5px solid var(--gold-400)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gold-400)',
            flexShrink: 0
          }}>
            <GraduationCap size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--gold-400)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Current Public Navbar Branding
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff' }}>
              {navbarBrandName}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
              {navbarBrandSub} • {navbarBrandTagline}
            </div>
          </div>
        </div>

        <Link
          to="/admin/settings"
          className="btn btn-gold btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 1.25rem', fontWeight: '700' }}
        >
          <Settings size={15} /> Edit Navbar College Name →
        </Link>
      </div>

      {/* Examination & Timetable Quick Access Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #0369a1 100%)',
        color: '#ffffff',
        borderRadius: '12px',
        padding: '1.25rem 1.75rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 4px 15px rgba(3, 105, 161, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '1.5px solid rgba(255, 255, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            flexShrink: 0
          }}>
            <GraduationCap size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#fde047', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Academic Assessments & Circulars
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff' }}>
              Examination Timetables & Model Question Papers
            </div>
            <div style={{ fontSize: '0.82rem', color: '#e0f2fe' }}>
              Add and update timetables, upload model question paper PDFs, and manage exam schedules
            </div>
          </div>
        </div>

        <Link
          to="/admin/examinations"
          className="btn btn-gold btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.6rem 1.4rem', fontWeight: '700' }}
        >
          <GraduationCap size={16} /> Manage Examination PDFs →
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #2563eb' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Total Enquiries
            </span>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-900)', margin: '0.2rem 0' }}>
              {stats?.totalAdmissionEnquiries || 0}
            </div>
            <span style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: '600' }}>
              {stats?.newAdmissionEnquiries || 0} New action items
            </span>
          </div>
          <div style={{ width: '44px', height: '44px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCheck size={22} />
          </div>
        </div>

        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #b8860b' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Active Courses
            </span>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-900)', margin: '0.2rem 0' }}>
              {stats?.totalCourses || 0}
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Science & Commerce
            </span>
          </div>
          <div style={{ width: '44px', height: '44px', backgroundColor: '#fef9e7', color: '#b8860b', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={22} />
          </div>
        </div>

        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #059669' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Faculty Members
            </span>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-900)', margin: '0.2rem 0' }}>
              {stats?.totalFaculty || 0}
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Across 8 Departments
            </span>
          </div>
          <div style={{ width: '44px', height: '44px', backgroundColor: '#ecfdf5', color: '#059669', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} />
          </div>
        </div>

        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #7c3aed' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Upcoming Events
            </span>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-900)', margin: '0.2rem 0' }}>
              {stats?.upcomingEvents || 0}
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Campus calendar
            </span>
          </div>
          <div style={{ width: '44px', height: '44px', backgroundColor: '#f5f3ff', color: '#7c3aed', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={22} />
          </div>
        </div>
      </div>

      {/* Enquiries Breakdown */}
      <div className="grid-2" style={{ gap: '1.75rem', marginBottom: '2rem' }}>
        {/* Status Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
            Enquiries by Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats?.enquiriesByStatus && Object.entries(stats.enquiriesByStatus).map(([status, count]) => (
              <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="badge" style={{
                  backgroundColor: status === 'NEW' ? '#dbeafe' : status === 'ADMITTED' ? '#d1fae5' : '#fef3c7',
                  color: status === 'NEW' ? '#1e40af' : status === 'ADMITTED' ? '#065f46' : '#b45309'
                }}>
                  {status}
                </span>
                <span style={{ fontWeight: '700', color: 'var(--primary-900)' }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stream Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
            Enquiries by Academic Stream
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats?.enquiriesByStream && Object.entries(stats.enquiriesByStream).map(([stream, count]) => (
              <div key={stream} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="badge" style={{
                  backgroundColor: stream === 'SCIENCE' ? '#e0f2fe' : '#fef3c7',
                  color: stream === 'SCIENCE' ? '#0369a1' : '#b45309'
                }}>
                  {stream} STREAM
                </span>
                <span style={{ fontWeight: '700', color: 'var(--primary-900)' }}>
                  {count} enquiries
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Administrative Activity Logs */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)' }}>
            Recent Administrative Activity Log
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            System Audit Trail
          </span>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Module</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                stats.recentActivities.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {log.createdAt}
                    </td>
                    <td>
                      <strong>{log.username}</strong>
                    </td>
                    <td>
                      <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{log.module}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{log.details}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No recent activity logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
