import React, { useState, useEffect } from 'react';
import { MessageSquareQuote, Plus, Edit2, Trash2, X, Search, CheckCircle2, XCircle, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchTestimonials = () => {
    setLoading(true);
    api.get('/admin/testimonials')
      .then(res => {
        if (res.success) {
          setTestimonials(res.data || []);
          setFiltered(res.data || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFiltered(testimonials);
    } else {
      const q = searchQuery.toLowerCase();
      setFiltered(
        testimonials.filter(
          t =>
            t.studentName?.toLowerCase().includes(q) ||
            t.quote?.toLowerCase().includes(q) ||
            t.achievement?.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, testimonials]);

  const openAddModal = () => {
    setEditingItem(null);
    reset({
      studentName: '',
      batchYear: 'Batch of 2025',
      stream: 'Science (PCMC)',
      achievement: 'Admitted to RV College of Engineering (CSE)',
      quote: '',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      active: true
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    reset(item);
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        id: editingItem ? editingItem.id : null
      };
      const res = await api.post('/admin/testimonials', payload);
      if (res.success) {
        setModalOpen(false);
        fetchTestimonials();
      }
    } catch (err) {
      alert(err.message || 'Failed to save testimonial');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete testimonial from ${name}?`)) {
      try {
        await api.delete(`/admin/testimonials/${id}`);
        fetchTestimonials();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await api.patch(`/admin/testimonials/${id}/active?active=${!currentStatus}`);
      fetchTestimonials();
    } catch (err) {
      alert(err.message || 'Failed to update approval status');
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Testimonials & Reviews</h1>
          <p className="admin-header-subtitle">
            Approve student reviews, alumni success stories, and parent recommendations
          </p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}>
          <Plus size={18} /> Add Testimonial
        </button>
      </div>

      {/* Search Bar */}
      <div className="admin-search-card">
        <div className="admin-search-bar">
          <Search size={18} style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search reviews by student name, achievement, or excerpt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Testimonials Table */}
      <div className="admin-table-card">
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Student / Alum</th>
                <th>Batch & Stream</th>
                <th>Achievement / Career</th>
                <th>Quote Excerpt</th>
                <th>Approval Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No testimonials found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={item.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={item.studentName}
                          style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div style={{ fontWeight: '600', color: 'var(--primary-900)' }}>{item.studentName}</div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: '500' }}>{item.batchYear}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.stream}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: '#1e40af', backgroundColor: '#dbeafe', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {item.achievement || 'MPUC Alumnus'}
                      </span>
                    </td>
                    <td style={{ maxWidth: '320px', fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      "{item.quote?.length > 80 ? item.quote.slice(0, 80) + '...' : item.quote}"
                    </td>
                    <td>
                      <button
                        onClick={() => toggleActive(item.id, item.active)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.8rem',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '12px',
                          fontWeight: '600',
                          backgroundColor: item.active ? '#dcfce7' : '#fee2e2',
                          color: item.active ? '#166534' : '#991b1b'
                        }}
                      >
                        {item.active ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        {item.active ? 'Approved' : 'Pending'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button onClick={() => openEditModal(item)} className="btn-icon" title="Edit" style={{ color: 'var(--primary-700)' }}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(item.id, item.studentName)} className="btn-icon" title="Delete" style={{ color: '#ef4444' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
              {editingItem ? `Edit Testimonial: ${editingItem.studentName}` : 'Add Student Testimonial'}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Student Name *</label>
                  <input type="text" className="form-control" {...register('studentName', { required: true })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Batch Year *</label>
                  <input type="text" className="form-control" placeholder="e.g. Batch of 2025" {...register('batchYear', { required: true })} />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Stream / Combination *</label>
                  <input type="text" className="form-control" placeholder="e.g. Science (PCMC)" {...register('stream', { required: true })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Current College / Placement</label>
                  <input type="text" className="form-control" placeholder="e.g. Bangalore Medical College (MBBS)" {...register('achievement')} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Testimonial Quote *</label>
                <textarea rows="4" className="form-control" placeholder="Student's genuine feedback and collegiate experience..." {...register('quote', { required: true })}></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Student Photo URL</label>
                <input type="text" className="form-control" {...register('photoUrl')} />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="testiActive" {...register('active')} />
                <label htmlFor="testiActive" style={{ margin: 0, fontSize: '0.88rem', cursor: 'pointer' }}>
                  Approve and publish immediately on public home page
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline-primary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Testimonial</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
