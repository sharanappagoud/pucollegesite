import React, { useState, useEffect } from 'react';
import { Bell, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchNotices = () => {
    setLoading(true);
    api.get('/admin/notices')
      .then(res => res.success && setNotices(res.data))
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
      documentUrl: '#',
      isImportant: false,
      publishedAt: new Date().toISOString().slice(0, 10)
    });
    setModalOpen(true);
  };

  const openEditModal = (n) => {
    setEditingNotice(n);
    reset(n);
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        id: editingNotice ? editingNotice.id : null
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
    if (window.confirm('Delete this circular notice?')) {
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
          <h1 className="admin-header-title">Notices & Board Circulars</h1>
          <p className="admin-header-subtitle">
            Publish official announcements, exam circulars, and student advisories
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}>
          <Plus size={16} /> Post Notice
        </button>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Notice Title</th>
              <th>Priority</th>
              <th>Publish Date</th>
              <th>Link / Document</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Loading notices...
                </td>
              </tr>
            ) : notices.map(n => (
              <tr key={n.id}>
                <td>
                  <strong>{n.title}</strong>
                </td>
                <td>
                  {n.isImportant ? (
                    <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
                      IMPORTANT
                    </span>
                  ) : (
                    <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                      STANDARD
                    </span>
                  )}
                </td>
                <td style={{ fontSize: '0.85rem' }}>{n.publishedAt}</td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {n.documentUrl || 'None'}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openEditModal(n)} className="btn btn-outline-primary btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(n.id)} className="btn btn-sm" style={{ padding: '0.3rem 0.6rem', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', maxWidth: '560px', width: '100%', padding: '2rem', position: 'relative'
          }}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
              {editingNotice ? 'Edit Circular Notice' : 'Post New Circular Notice'}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label className="form-label">Notice Headline *</label>
                <input type="text" className="form-control" {...register('title', { required: true })} />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Publish Date</label>
                  <input type="date" className="form-control" {...register('publishedAt')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Document URL</label>
                  <input type="text" className="form-control" placeholder="Link or PDF path" {...register('documentUrl')} />
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="checkbox" {...register('isImportant')} />
                  <span>Mark as Important Announcement (highlights on public banner ticker)</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline-primary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Notice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
