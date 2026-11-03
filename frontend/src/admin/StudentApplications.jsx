import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Edit2, Trash2, X, Search, Eye, Filter, CheckCircle2, AlertCircle, FileSpreadsheet, ExternalLink } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState('https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing');

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [editingApp, setEditingApp] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchApplications = () => {
    setLoading(true);
    api.get('/admin/students')
      .then(res => {
        if (res.success) {
          setApplications(res.data || []);
          setFiltered(res.data || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplications();
    api.get('/admin/admission-enquiries/google-sheets-config')
      .then(res => {
        if (res.success && res.data?.spreadsheetUrl) {
          setSpreadsheetUrl(res.data.spreadsheetUrl);
        }
      })
      .catch(err => console.debug(err));
  }, []);

  useEffect(() => {
    let result = applications;
    if (statusFilter !== 'ALL') {
      result = result.filter(a => a.status === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.applicationNo?.toLowerCase().includes(q) ||
        a.studentName?.toLowerCase().includes(q) ||
        a.address?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [searchQuery, statusFilter, applications]);

  const openAddModal = () => {
    setEditingApp(null);
    reset({
      applicationNo: '',
      studentName: '',
      dob: '2010-05-15',
      gender: 'MALE',
      bloodGroup: 'O+',
      nationality: 'Indian',
      address: '',
      marksPercentage: 85.00,
      status: 'SUBMITTED'
    });
    setModalOpen(true);
  };

  const openEditModal = (app) => {
    setEditingApp(app);
    reset(app);
    setModalOpen(true);
  };

  const openDetailModal = (app) => {
    setSelectedApp(app);
    setDetailModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        id: editingApp ? editingApp.id : null,
        marksPercentage: parseFloat(data.marksPercentage) || 0
      };
      const res = await api.post('/admin/students', payload);
      if (res.success) {
        setModalOpen(false);
        fetchApplications();
      }
    } catch (err) {
      alert(err.message || 'Failed to save application');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/admin/students/${id}/status?status=${newStatus}`);
      fetchApplications();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id, appNo) => {
    if (window.confirm(`Delete record for application ${appNo}?`)) {
      try {
        await api.delete(`/admin/students/${id}`);
        fetchApplications();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      SUBMITTED: { bg: '#e0f2fe', text: '#0284c7', border: '#bae6fd' },
      VERIFIED: { bg: '#fef3c7', text: '#d97706', border: '#fde68a' },
      APPROVED: { bg: '#dcfce7', text: '#16a34a', border: '#bbf7d0' },
      ADMITTED: { bg: '#f3e8ff', text: '#9333ea', border: '#e9d5ff' },
      REJECTED: { bg: '#fee2e2', text: '#dc2626', border: '#fecaca' }
    };
    const c = colors[status] || { bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0' };
    return (
      <span style={{
        fontSize: '0.74rem',
        fontWeight: '700',
        backgroundColor: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        padding: '0.22rem 0.65rem',
        borderRadius: '9999px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        letterSpacing: '0.02em'
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: c.text }} />
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Student & Application Records</h1>
          <p className="admin-header-subtitle">
            Process formal admission forms, verify documents, and manage matriculation records
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <a
            href={spreadsheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm"
            style={{
              backgroundColor: '#0F9D58',
              color: '#ffffff',
              border: '1px solid #0b8043',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: '600',
              padding: '0.5rem 0.95rem',
              borderRadius: '6px',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(15, 157, 88, 0.25)'
            }}
            title="Open Google Spreadsheet (Sharanappagouda148@gmail.com)"
          >
            <FileSpreadsheet size={16} /> Google Spreadsheet <ExternalLink size={13} />
          </a>
          <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}>
            <Plus size={18} /> New Student Record
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-search-card">
        <div className="admin-search-bar">
          <Search size={18} style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by application no, student name, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Filter by Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem', borderRadius: '8px' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="VERIFIED">Documents Verified</option>
            <option value="APPROVED">Approved</option>
            <option value="ADMITTED">Admitted / Enrolled</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Records Table */}
      <div className="admin-table-card">
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>App No</th>
                <th>Candidate Name</th>
                <th>10th Marks</th>
                <th>Gender / Blood</th>
                <th>Status</th>
                <th>Workflow Action</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3.5rem' }}>
                    <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
                    <div style={{ marginTop: '0.75rem', color: '#64748b', fontSize: '0.88rem' }}>Loading application records...</div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
                    No student application records found.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <span style={{
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        fontWeight: '700',
                        fontSize: '0.84rem',
                        color: 'var(--primary-800)',
                        backgroundColor: '#f1f5f9',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        letterSpacing: '0.02em'
                      }}>
                        {app.applicationNo}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.92rem' }}>{app.studentName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                        DOB: {app.dob || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.92rem' }}>
                        {app.marksPercentage ? `${app.marksPercentage}%` : 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{app.gender || 'N/A'}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '1px' }}>Group: {app.bloodGroup || 'N/A'}</div>
                    </td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="form-select"
                        style={{ fontSize: '0.82rem', padding: '0.35rem 0.65rem', width: 'auto', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        <option value="SUBMITTED">Submitted</option>
                        <option value="VERIFIED">Verified</option>
                        <option value="APPROVED">Approved</option>
                        <option value="ADMITTED">Admitted</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.45rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => openDetailModal(app)} className="btn-icon" title="View Details" style={{ color: '#0284c7' }}>
                          <Eye size={16} />
                        </button>
                        <button onClick={() => openEditModal(app)} className="btn-icon" title="Edit" style={{ color: '#d97706' }}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(app.id, app.applicationNo)} className="btn-icon" title="Delete" style={{ color: '#ef4444' }}>
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

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
              {editingApp ? `Edit Application: ${editingApp.applicationNo}` : 'New Student Application Record'}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Application Number</label>
                  <input type="text" className="form-control" placeholder="Auto-generated if blank" {...register('applicationNo')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Student Full Name *</label>
                  <input type="text" className="form-control" {...register('studentName', { required: true })} />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input type="date" className="form-control" {...register('dob')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-select" {...register('gender')}>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Blood Group</label>
                  <input type="text" className="form-control" placeholder="O+, B+, A-, etc." {...register('bloodGroup')} />
                </div>
                <div className="form-group">
                  <label className="form-label">10th Standard Marks %</label>
                  <input type="number" step="0.01" className="form-control" placeholder="e.g. 91.50" {...register('marksPercentage')} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Residential Address</label>
                <textarea rows="3" className="form-control" {...register('address')}></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Admission Status</label>
                <select className="form-select" {...register('status')}>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="APPROVED">Approved</option>
                  <option value="ADMITTED">Admitted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline-primary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Student Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModalOpen && selectedApp && (
        <div className="modal-backdrop" onClick={() => setDetailModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setDetailModalOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)' }}>{selectedApp.studentName}</h3>
                <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--text-muted)' }}>{selectedApp.applicationNo}</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.88rem' }}>
                <div><strong>Status:</strong> {getStatusBadge(selectedApp.status)}</div>
                <div><strong>10th Score:</strong> {selectedApp.marksPercentage}%</div>
                <div><strong>Date of Birth:</strong> {selectedApp.dob || 'N/A'}</div>
                <div><strong>Gender:</strong> {selectedApp.gender}</div>
                <div><strong>Blood Group:</strong> {selectedApp.bloodGroup || 'N/A'}</div>
                <div><strong>Nationality:</strong> {selectedApp.nationality}</div>
              </div>
              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0', fontSize: '0.88rem' }}>
                <strong>Permanent Address:</strong>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: '1.5' }}>
                  {selectedApp.address || 'No address documented'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setDetailModalOpen(false)} className="btn btn-primary btn-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
