import React, { useState, useEffect } from 'react';
import { 
  Bell, Plus, Edit2, Trash2, X, ExternalLink, CheckCircle2, 
  AlertCircle, Link as LinkIcon, Sparkles, Eye 
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

const QUICK_LINKS = [
  { label: '📅 Examinations', url: '/examinations' },
  { label: '🎓 Online Admissions', url: '/admissions#enquiry-form' },
  { label: '💰 Scholarships & Fees', url: '/admissions#scholarships' },
  { label: '📰 News & Circulars', url: '/news' },
  { label: '🏫 Facilities & Labs', url: '/facilities' },
  { label: '📞 Contact Us', url: '/contact' }
];

export const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const currentDocUrl = watch('documentUrl');

  const fetchNotices = () => {
    setLoading(true);
    api.get('/admin/notices')
      .then(res => res.success && setNotices(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const openAddModal = () => {
    setEditingNotice(null);
    reset({
      title: '',
      documentUrl: '/examinations',
      isImportant: true, // Default to true so it immediately shows on the public ticker!
      publishedAt: new Date().toISOString().slice(0, 10),
      expiresAt: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (n) => {
    setEditingNotice(n);
    reset({
      ...n,
      documentUrl: n.documentUrl === '#' ? '' : n.documentUrl
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        id: editingNotice ? editingNotice.id : null,
        documentUrl: data.documentUrl ? data.documentUrl.trim() : '/news'
      };
      const res = await api.post('/admin/notices', payload);
      if (res.success) {
        setModalOpen(false);
        fetchNotices();
      }
    } catch (err) {
      alert(err.message || 'Failed to save notice');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement? It will be removed from the public website.')) {
      try {
        await api.delete(`/admin/notices/${id}`);
        fetchNotices();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Announcements & Ticker Notices</h1>
          <p className="admin-header-subtitle">
            Publish golden banner ticker announcements, circulars, and clickable document links for students and parents
          </p>
        </div>

        <button 
          onClick={openAddModal} 
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}
        >
          <Plus size={16} /> Add Announcement
        </button>
      </div>

      {/* Information Banner for Admin */}
      <div style={{
        backgroundColor: '#fefce8',
        border: '1.5px solid #fde047',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Bell size={20} color="#ca8a04" style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ color: '#854d0e', fontSize: '0.92rem' }}>
              How Public Announcements Work
            </strong>
            <p style={{ color: '#a16207', fontSize: '0.84rem', margin: '2px 0 0 0' }}>
              Items marked with <span style={{ fontWeight: 700 }}>"Active on Ticker"</span> scroll across the golden announcement banner right below the navbar. When users click an item, it opens the attached link, PDF, or page immediately.
            </p>
          </div>
        </div>

        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-sm" 
          style={{ backgroundColor: '#ffffff', border: '1px solid #ca8a04', color: '#854d0e', whiteSpace: 'nowrap' }}
        >
          <Eye size={13} style={{ marginRight: '4px' }} /> View Live Ticker ↗
        </a>
      </div>

      {/* Announcements Table */}
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Announcement Headline</th>
              <th>Public Ticker Status</th>
              <th>Publish Date</th>
              <th>Click Target / Document Link</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Loading announcements...
                </td>
              </tr>
            ) : notices.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No announcements posted yet. Click <strong>"Add Announcement"</strong> above to publish one!
                </td>
              </tr>
            ) : notices.map(n => (
              <tr key={n.id}>
                <td>
                  <strong style={{ color: 'var(--primary-900)', fontSize: '0.92rem' }}>
                    {n.title}
                  </strong>
                </td>
                <td>
                  {n.isImportant ? (
                    <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#15803d', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                      <CheckCircle2 size={12} /> ACTIVE ON TICKER
                    </span>
                  ) : (
                    <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                      STANDARD NOTICE
                    </span>
                  )}
                </td>
                <td style={{ fontSize: '0.85rem' }}>{n.publishedAt}</td>
                <td>
                  {n.documentUrl && n.documentUrl !== '#' ? (
                    <a
                      href={n.documentUrl}
                      target={n.documentUrl.startsWith('http') || n.documentUrl.endsWith('.pdf') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        color: 'var(--primary-700)',
                        textDecoration: 'underline'
                      }}
                    >
                      <LinkIcon size={12} />
                      <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {n.documentUrl}
                      </span>
                      <ExternalLink size={11} />
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Auto (Contextual Page)
                    </span>
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => openEditModal(n)} 
                      className="btn btn-outline-primary btn-sm" 
                      style={{ padding: '0.35rem 0.65rem' }}
                      title="Edit Announcement"
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(n.id)} 
                      className="btn btn-sm" 
                      style={{ padding: '0.35rem 0.65rem', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none' }}
                      title="Delete Announcement"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Announcement Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', maxWidth: '620px', width: '100%', padding: '2rem', position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <button 
              onClick={() => setModalOpen(false)} 
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-900)', margin: 0 }}>
                  {editingNotice ? 'Edit Announcement' : 'Post New Announcement'}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
                  Enter the announcement text and where users should land when clicking it
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Title Field */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Announcement Headline *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. First Unit Test Examinations 2026 Timetable Announced"
                  {...register('title', { required: true })} 
                />
              </div>

              {/* Document URL with Quick Presets */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label className="form-label" style={{ fontWeight: 700, margin: 0 }}>
                    Target Link or Document URL (When User Clicks)
                  </label>
                  {currentDocUrl && currentDocUrl !== '#' && (
                    <a
                      href={currentDocUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.78rem', color: 'var(--primary-700)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                    >
                      Test Link <ExternalLink size={11} />
                    </a>
                  )}
                </div>

                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. /examinations, /admissions#scholarships, or https://... PDF"
                  {...register('documentUrl')} 
                />

                {/* Quick Link Chips */}
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Quick Link Suggestions (Click to fill):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {QUICK_LINKS.map(link => (
                      <button
                        key={link.url}
                        type="button"
                        onClick={() => setValue('documentUrl', link.url)}
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#f8fafc',
                          color: '#334155',
                          cursor: 'pointer'
                        }}
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700 }}>Publish Date</label>
                  <input type="date" className="form-control" {...register('publishedAt')} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700 }}>Expiry Date (Optional)</label>
                  <input type="date" className="form-control" {...register('expiresAt')} />
                </div>
              </div>

              {/* Priority Checkbox (Defaulted to true) */}
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1.5px solid #86efac',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                marginBottom: '1.5rem'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', margin: 0 }}>
                  <input 
                    type="checkbox" 
                    style={{ width: '18px', height: '18px', accentColor: '#15803d' }}
                    {...register('isImportant')} 
                  />
                  <div>
                    <strong style={{ color: '#166534', fontSize: '0.88rem' }}>
                      Show on Public Announcements Ticker (Recommended)
                    </strong>
                    <div style={{ fontSize: '0.78rem', color: '#15803d' }}>
                      Displays this announcement on the golden rolling banner ticker right below the navbar.
                    </div>
                  </div>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)} 
                  className="btn btn-outline-primary btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
                  {editingNotice ? 'Update Announcement' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;
