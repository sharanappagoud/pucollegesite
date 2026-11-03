import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, X, Search, CheckCircle2, XCircle, Mail, Phone, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchDepartments = () => {
    setLoading(true);
    api.get('/admin/departments')
      .then(res => {
        if (res.success) {
          setDepartments(res.data || []);
          setFiltered(res.data || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFiltered(departments);
    } else {
      const q = searchQuery.toLowerCase();
      setFiltered(
        departments.filter(
          d =>
            d.name?.toLowerCase().includes(q) ||
            d.code?.toLowerCase().includes(q) ||
            d.hodName?.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, departments]);

  const openAddModal = () => {
    setEditingDept(null);
    reset({
      name: '',
      code: '',
      description: '',
      hodName: '',
      hodEmail: '',
      hodPhone: '',
      active: true
    });
    setModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    reset(dept);
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        id: editingDept ? editingDept.id : null,
        code: data.code.toUpperCase().trim()
      };
      const res = await api.post('/admin/departments', payload);
      if (res.success) {
        setModalOpen(false);
        fetchDepartments();
      }
    } catch (err) {
      alert(err.message || 'Failed to save department');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete department "${name}"?`)) {
      try {
        await api.delete(`/admin/departments/${id}`);
        fetchDepartments();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await api.patch(`/admin/departments/${id}/active?active=${!currentStatus}`);
      fetchDepartments();
    } catch (err) {
      alert(err.message || 'Failed to update department status');
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Staff & Department Management</h1>
          <p className="admin-header-subtitle">
            Organize academic departments, assign HOD leadership, and configure faculty divisions
          </p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}>
          <Plus size={18} /> Add Academic Department
        </button>
      </div>

      {/* Search Bar */}
      <div className="admin-search-card">
        <div className="admin-search-bar">
          <Search size={18} style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by department name, code, or HOD name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Departments Table */}
      <div className="admin-table-card">
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Code</th>
                <th>Head of Department (HOD)</th>
                <th>Contact</th>
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
                    No departments found.
                  </td>
                </tr>
              ) : (
                filtered.map((dept) => (
                  <tr key={dept.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--primary-900)' }}>{dept.name}</div>
                      {dept.description && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '320px' }}>
                          {dept.description.length > 70 ? dept.description.slice(0, 70) + '...' : dept.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', fontWeight: '700', backgroundColor: '#f1f5f9', color: 'var(--primary-700)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {dept.code}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '500', color: 'var(--primary-900)' }}>
                        <User size={14} style={{ color: 'var(--primary-700)' }} />
                        {dept.hodName || 'Not Assigned'}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>
                      {dept.hodEmail && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                          <Mail size={12} /> {dept.hodEmail}
                        </div>
                      )}
                      {dept.hodPhone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                          <Phone size={12} /> {dept.hodPhone}
                        </div>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => toggleActive(dept.id, dept.active)}
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
                          backgroundColor: dept.active ? '#dcfce7' : '#fee2e2',
                          color: dept.active ? '#166534' : '#991b1b'
                        }}
                      >
                        {dept.active ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        {dept.active ? 'Active' : 'Archived'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button onClick={() => openEditModal(dept)} className="btn-icon" title="Edit" style={{ color: 'var(--primary-700)' }}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(dept.id, dept.name)} className="btn-icon" title="Delete" style={{ color: '#ef4444' }}>
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
              {editingDept ? `Edit Department: ${editingDept.name}` : 'Create Academic Department'}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Department Name *</label>
                  <input type="text" className="form-control" placeholder="e.g. Department of Physics" {...register('name', { required: true })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Department Code *</label>
                  <input type="text" className="form-control" placeholder="e.g. DEPT_PHY" {...register('code', { required: true })} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Department Overview & Objectives</label>
                <textarea rows="3" className="form-control" {...register('description')}></textarea>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Head of Department (HOD) Name</label>
                  <input type="text" className="form-control" placeholder="e.g. Prof. H. S. Narayana" {...register('hodName')} />
                </div>
                <div className="form-group">
                  <label className="form-label">HOD Official Email</label>
                  <input type="email" className="form-control" placeholder="hod.phy@mpuc.edu.in" {...register('hodEmail')} />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">HOD Contact Phone</label>
                  <input type="text" className="form-control" placeholder="+91 98450 11201" {...register('hodPhone')} />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.75rem' }}>
                  <input type="checkbox" id="deptActive" {...register('active')} />
                  <label htmlFor="deptActive" style={{ margin: 0, fontSize: '0.88rem', cursor: 'pointer' }}>
                    Active academic department
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline-primary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Department</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
