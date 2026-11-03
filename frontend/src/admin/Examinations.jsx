import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2, X, Search, CheckCircle2, XCircle, FileText, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export const Examinations = () => {
  const [examinations, setExaminations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm();

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploadingPdf(true);
    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.success && res.data?.url) {
        setValue('timeTableUrl', res.data.url);
      }
    } catch (err) {
      alert(err.message || 'File upload failed');
    } finally {
      setUploadingPdf(false);
      e.target.value = '';
    }
  };

  const fetchExaminations = () => {
    setLoading(true);
    api.get('/admin/examinations')
      .then(res => {
        if (res.success) {
          setExaminations(res.data || []);
          setFiltered(res.data || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchExaminations();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFiltered(examinations);
    } else {
      const q = searchQuery.toLowerCase();
      setFiltered(
        examinations.filter(
          e =>
            e.examName?.toLowerCase().includes(q) ||
            e.examType?.toLowerCase().includes(q) ||
            e.stream?.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, examinations]);

  const openAddModal = () => {
    setEditingExam(null);
    reset({
      examName: '',
      examType: 'MID_TERM',
      academicYear: '2026-27',
      stream: 'ALL',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      timeTableUrl: '/uploads/timetable-midterm-2026.pdf',
      instructions: '',
      published: true
    });
    setModalOpen(true);
  };

  const openEditModal = (exam) => {
    setEditingExam(exam);
    reset(exam);
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        id: editingExam ? editingExam.id : null
      };
      const res = await api.post('/admin/examinations', payload);
      if (res.success) {
        setModalOpen(false);
        fetchExaminations();
      }
    } catch (err) {
      alert(err.message || 'Failed to save examination schedule');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete examination "${name}"?`)) {
      try {
        await api.delete(`/admin/examinations/${id}`);
        fetchExaminations();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      await api.patch(`/admin/examinations/${id}/publish?published=${!currentStatus}`);
      fetchExaminations();
    } catch (err) {
      alert(err.message || 'Failed to update publication status');
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Examination Management</h1>
          <p className="admin-header-subtitle">
            Schedule term tests, preparatory board exams, and publish student timetables
          </p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}>
          <Plus size={18} /> Schedule Examination
        </button>
      </div>

      {/* Search Bar */}
      <div className="admin-search-card">
        <div className="admin-search-bar">
          <Search size={18} style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search examinations by name, type, or stream..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Examination Table */}
      <div className="admin-table-card">
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Examination Name</th>
                <th>Type & Year</th>
                <th>Stream</th>
                <th>Duration</th>
                <th>Timetable File</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No examinations found.
                  </td>
                </tr>
              ) : (
                filtered.map((exam) => (
                  <tr key={exam.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--primary-900)' }}>{exam.examName}</div>
                      {exam.instructions && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '300px' }}>
                          {exam.instructions.length > 70 ? exam.instructions.slice(0, 70) + '...' : exam.instructions}
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', backgroundColor: '#f1f5f9', color: 'var(--primary-800)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {exam.examType}
                      </span>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{exam.academicYear}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '600', color: 'var(--primary-700)', fontSize: '0.85rem' }}>{exam.stream}</span>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>
                      <div>{exam.startDate}</div>
                      <div style={{ color: 'var(--text-muted)' }}>to {exam.endDate}</div>
                    </td>
                    <td>
                      {exam.timeTableUrl ? (
                        <a
                          href={exam.timeTableUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--primary-700)', textDecoration: 'none' }}
                        >
                          <FileText size={14} /> PDF File
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>No file</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => togglePublish(exam.id, exam.published)}
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
                          backgroundColor: exam.published ? '#dcfce7' : '#fee2e2',
                          color: exam.published ? '#166534' : '#991b1b'
                        }}
                      >
                        {exam.published ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        {exam.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button onClick={() => openEditModal(exam)} className="btn-icon" title="Edit" style={{ color: 'var(--primary-700)' }}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(exam.id, exam.examName)} className="btn-icon" title="Delete" style={{ color: '#ef4444' }}>
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
              {editingExam ? `Edit Exam: ${editingExam.examName}` : 'Schedule New Examination'}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label className="form-label">Examination Name *</label>
                <input type="text" className="form-control" placeholder="e.g. Mid-Term Assessment 2026" {...register('examName', { required: true })} />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Exam Type *</label>
                  <select className="form-select" {...register('examType', { required: true })}>
                    <option value="UNIT_TEST">Unit Test</option>
                    <option value="MID_TERM">Mid-Term Examination</option>
                    <option value="PREPARATORY">Preparatory Mock Exam</option>
                    <option value="ANNUAL_BOARD">Annual State Board Exam</option>
                    <option value="PRACTICAL">Laboratory Practical Exam</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Academic Year *</label>
                  <input type="text" className="form-control" placeholder="2026-27" {...register('academicYear', { required: true })} />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Applicable Stream *</label>
                  <select className="form-select" {...register('stream', { required: true })}>
                    <option value="ALL">All Streams (Science & Commerce)</option>
                    <option value="SCIENCE">Science Only</option>
                    <option value="COMMERCE">Commerce Only</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Timetable PDF Document</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,image/*"
                      id="examTimetableFileInput"
                      style={{ display: 'none' }}
                      onChange={handlePdfUpload}
                    />
                    <label
                      htmlFor="examTimetableFileInput"
                      className="btn btn-outline-primary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', margin: 0, fontSize: '0.8rem' }}
                    >
                      <Upload size={14} /> {uploadingPdf ? 'Uploading...' : 'Upload PDF Document'}
                    </label>
                  </div>
                  <input type="text" className="form-control" placeholder="/uploads/timetable.pdf" {...register('timeTableUrl')} />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Commencement Date *</label>
                  <input type="date" className="form-control" {...register('startDate', { required: true })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Concluding Date *</label>
                  <input type="date" className="form-control" {...register('endDate', { required: true })} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Instructions & Regulations for Students</label>
                <textarea rows="3" className="form-control" placeholder="e.g. Hall tickets required; reporting time 9:30 AM" {...register('instructions')}></textarea>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="examPublished" {...register('published')} />
                <label htmlFor="examPublished" style={{ margin: 0, fontSize: '0.88rem', cursor: 'pointer' }}>
                  Publish schedule on Academic Portal immediately
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline-primary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
