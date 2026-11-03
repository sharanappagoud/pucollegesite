import React, { useState, useEffect } from 'react';
import { Award, Plus, Edit2, Trash2, X, Search, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [examFilter, setExamFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchAchievements = () => {
    setLoading(true);
    api.get('/admin/achievements')
      .then(res => {
        if (res.success) {
          setAchievements(res.data || []);
          setFiltered(res.data || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  useEffect(() => {
    let result = achievements;
    if (examFilter !== 'ALL') {
      result = result.filter(a => a.examType === examFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.studentName?.toLowerCase().includes(q) ||
        a.rankOrScore?.toLowerCase().includes(q) ||
        a.achievementTitle?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [searchQuery, examFilter, achievements]);

  const openAddModal = () => {
    setEditingItem(null);
    reset({
      studentName: '',
      academicYear: '2025-26',
      examType: 'KCET',
      rankOrScore: '',
      stream: 'SCIENCE',
      combination: 'PCMB',
      achievementTitle: '',
      description: '',
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
      published: true
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
      const res = await api.post('/admin/achievements', payload);
      if (res.success) {
        setModalOpen(false);
        fetchAchievements();
      }
    } catch (err) {
      alert(err.message || 'Failed to save achievement');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete achievement for ${name}?`)) {
      try {
        await api.delete(`/admin/achievements/${id}`);
        fetchAchievements();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      await api.patch(`/admin/achievements/${id}/publish?published=${!currentStatus}`);
      fetchAchievements();
    } catch (err) {
      alert(err.message || 'Failed to update publication status');
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Student Achievements & Results</h1>
          <p className="admin-header-subtitle">
            Highlight State Ranks, KCET/NEET qualifiers, and collegiate sports champions
          </p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}>
          <Plus size={18} /> Add Student Achievement
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-search-card">
        <div className="admin-search-bar">
          <Search size={18} style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by student name, rank, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Exam Category:</span>
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem', borderRadius: '8px' }}
          >
            <option value="ALL">All Categories</option>
            <option value="KCET">KCET (Engineering)</option>
            <option value="NEET">NEET (Medical)</option>
            <option value="PU_BOARD">PU State Board</option>
            <option value="SPORTS">Sports & Athletics</option>
            <option value="CULTURAL">Cultural & Debate</option>
          </select>
        </div>
      </div>

      {/* Achievements Table */}
      <div className="admin-table-card">
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Category & Year</th>
                <th>Rank / Score</th>
                <th>Stream & Combination</th>
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
                    No achievements matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={item.photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80'}
                          alt={item.studentName}
                          style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--primary-900)' }}>{item.studentName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.achievementTitle}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', fontWeight: '600', backgroundColor: '#f1f5f9', color: 'var(--primary-800)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {item.examType}
                      </span>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{item.academicYear}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', color: '#b45309', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.88rem' }}>
                        <Trophy size={14} /> {item.rankOrScore}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem', fontWeight: '500' }}>{item.stream}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.combination || 'N/A'}</div>
                    </td>
                    <td>
                      <button
                        onClick={() => togglePublish(item.id, item.published)}
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
                          backgroundColor: item.published ? '#dcfce7' : '#fee2e2',
                          color: item.published ? '#166534' : '#991b1b'
                        }}
                      >
                        {item.published ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        {item.published ? 'Published' : 'Draft'}
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
              {editingItem ? `Edit Achievement: ${editingItem.studentName}` : 'Add New Student Achievement'}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Student Name *</label>
                  <input type="text" className="form-control" {...register('studentName', { required: true })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Academic Year *</label>
                  <input type="text" className="form-control" placeholder="2025-26" {...register('academicYear', { required: true })} />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Exam / Category *</label>
                  <select className="form-select" {...register('examType', { required: true })}>
                    <option value="KCET">KCET (Karnataka CET)</option>
                    <option value="NEET">NEET Medical</option>
                    <option value="JEE">JEE Main / Advanced</option>
                    <option value="PU_BOARD">Karnataka PU Board Exam</option>
                    <option value="SPORTS">Sports & Athletics</option>
                    <option value="CULTURAL">Cultural & Fine Arts</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Rank or Score *</label>
                  <input type="text" className="form-control" placeholder="e.g. State Rank 9 or 682/720 Marks" {...register('rankOrScore', { required: true })} />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Stream *</label>
                  <select className="form-select" {...register('stream', { required: true })}>
                    <option value="SCIENCE">Science</option>
                    <option value="COMMERCE">Commerce</option>
                    <option value="ARTS">Arts</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Combination</label>
                  <input type="text" className="form-control" placeholder="e.g. PCMB, PCMC, CEBA" {...register('combination')} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Achievement Title / Headline *</label>
                <input type="text" className="form-control" placeholder="e.g. Top 10 State Rank in KCET Engineering" {...register('achievementTitle', { required: true })} />
              </div>

              <div className="form-group">
                <label className="form-label">Description / Citation</label>
                <textarea rows="3" className="form-control" {...register('description')}></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Student Photo URL</label>
                <input type="text" className="form-control" {...register('photoUrl')} />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="achPublished" {...register('published')} />
                <label htmlFor="achPublished" style={{ margin: 0, fontSize: '0.88rem', cursor: 'pointer' }}>
                  Publish on public Hall of Fame page
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline-primary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Achievement</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
