import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Edit2, Trash2, X, Search, CheckCircle2, XCircle, Award } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export const Scholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchScholarships = () => {
    setLoading(true);
    api.get('/admin/scholarships')
      .then(res => {
        if (res.success) {
          setScholarships(res.data || []);
          setFiltered(res.data || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFiltered(scholarships);
    } else {
      const q = searchQuery.toLowerCase();
      setFiltered(
        scholarships.filter(
          s =>
            s.title?.toLowerCase().includes(q) ||
            s.category?.toLowerCase().includes(q) ||
            s.eligibilityCriteria?.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, scholarships]);

  const openAddModal = () => {
    setEditingItem(null);
    reset({
      title: '',
      category: 'MERIT',
      eligibilityCriteria: '',
      benefitAmount: '100% Tuition Fee Waiver',
      deadline: '2026-07-31',
      applicationLink: '/admissions#enquiry-form',
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
      const res = await api.post('/admin/scholarships', payload);
      if (res.success) {
        setModalOpen(false);
        fetchScholarships();
      }
    } catch (err) {
      alert(err.message || 'Failed to save scholarship');
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete scholarship "${title}"?`)) {
      try {
        await api.delete(`/admin/scholarships/${id}`);
        fetchScholarships();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await api.patch(`/admin/scholarships/${id}/active?active=${!currentStatus}`);
      fetchScholarships();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Fee & Scholarship Information</h1>
          <p className="admin-header-subtitle">
            Configure merit fee waivers, sports endowments, and need-based financial assistance
          </p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}>
          <Plus size={18} /> Add Scholarship Scheme
        </button>
      </div>

      {/* Search Bar */}
      <div className="admin-search-card">
        <div className="admin-search-bar">
          <Search size={18} style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by scholarship title, criteria, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Scholarships Table */}
      <div className="admin-table-card">
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Scholarship Scheme</th>
                <th>Category</th>
                <th>Financial Benefit</th>
                <th>Application Deadline</th>
                <th>Status</th>
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
                    No scholarship schemes found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--primary-900)' }}>{item.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '350px' }}>
                        {item.eligibilityCriteria}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', backgroundColor: '#f1f5f9', color: 'var(--primary-800)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', color: '#166534', fontSize: '0.88rem' }}>
                        {item.benefitAmount}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {item.deadline || 'Open All Year'}
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
                        {item.active ? 'Active' : 'Closed'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button onClick={() => openEditModal(item)} className="btn-icon" title="Edit" style={{ color: 'var(--primary-700)' }}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(item.id, item.title)} className="btn-icon" title="Delete" style={{ color: '#ef4444' }}>
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
              {editingItem ? `Edit Scholarship: ${editingItem.title}` : 'Add Scholarship / Fee Concession'}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label className="form-label">Scholarship / Concession Title *</label>
                <input type="text" className="form-control" placeholder="e.g. Sri Vidyodaya Merit Excellence Scholarship" {...register('title', { required: true })} />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-select" {...register('category', { required: true })}>
                    <option value="MERIT">Merit Excellence</option>
                    <option value="NEED_BASED">Economic Need / EWS</option>
                    <option value="SPORTS">Sports & Athletics</option>
                    <option value="GIRL_CHILD">Girl Child Empowerment</option>
                    <option value="ALUMNI">Alumni Sibling Grant</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Benefit / Concession Amount *</label>
                  <input type="text" className="form-control" placeholder="e.g. 100% Tuition Fee Waiver or INR 25,000" {...register('benefitAmount', { required: true })} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Eligibility Criteria *</label>
                <textarea rows="3" className="form-control" placeholder="Criteria description, minimum marks or household income threshold" {...register('eligibilityCriteria', { required: true })}></textarea>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Application Deadline</label>
                  <input type="date" className="form-control" {...register('deadline')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Application Link / Page</label>
                  <input type="text" className="form-control" placeholder="/admissions#enquiry-form" {...register('applicationLink')} />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="schActive" {...register('active')} />
                <label htmlFor="schActive" style={{ margin: 0, fontSize: '0.88rem', cursor: 'pointer' }}>
                  Open for new student applications
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline-primary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Scholarship</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
