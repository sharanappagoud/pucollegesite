import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, CheckCircle2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchCourses = () => {
    setLoading(true);
    api.get('/admin/courses')
      .then(res => res.success && setCourses(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openAddModal = () => {
    setEditingCourse(null);
    reset({
      code: '',
      name: '',
      stream: 'SCIENCE',
      duration: '2 Years',
      description: '',
      eligibility: '',
      careerProspects: '',
      feePerYear: 50000,
      active: true
    });
    setModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    reset({
      code: course.code,
      name: course.name,
      stream: course.stream,
      duration: course.duration,
      description: course.description,
      eligibility: course.eligibility,
      careerProspects: course.careerProspects,
      feePerYear: course.feePerYear,
      active: course.active
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        id: editingCourse ? editingCourse.id : null
      };
      const res = await api.post('/admin/courses', payload);
      if (res.success) {
        setModalOpen(false);
        fetchCourses();
      }
    } catch (err) {
      alert(err.message || 'Failed to save course');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course combination?')) {
      try {
        await api.delete(`/admin/courses/${id}`);
        fetchCourses();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Courses & Subject Combinations</h1>
          <p className="admin-header-subtitle">
            Manage Science and Commerce courses, fees, and subject combinations
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}>
          <Plus size={16} /> Add New Course
        </button>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Combination Code</th>
              <th>Program Name</th>
              <th>Stream</th>
              <th>Duration</th>
              <th>Annual Fee</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Loading courses...
                </td>
              </tr>
            ) : courses.map(course => (
              <tr key={course.id}>
                <td>
                  <strong style={{ color: 'var(--primary-800)', fontSize: '1rem' }}>{course.code}</strong>
                </td>
                <td style={{ fontWeight: '500' }}>{course.name}</td>
                <td>
                  <span className={`badge ${course.stream === 'SCIENCE' ? 'badge-science' : 'badge-commerce'}`}>
                    {course.stream}
                  </span>
                </td>
                <td>{course.duration}</td>
                <td>₹{Number(course.feePerYear || 0).toLocaleString('en-IN')}</td>
                <td>
                  <span className="badge" style={{
                    backgroundColor: course.active ? '#dcfce7' : '#fee2e2',
                    color: course.active ? '#15803d' : '#991b1b'
                  }}>
                    {course.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openEditModal(course)} className="btn btn-outline-primary btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
                      <Edit2 size={13} /> Edit
                    </button>
                    <button onClick={() => handleDelete(course.id)} className="btn btn-sm" style={{ padding: '0.3rem 0.6rem', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Course Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', position: 'relative'
          }}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
              {editingCourse ? `Edit Course: ${editingCourse.code}` : 'Add New Course Combination'}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Combination Code * (e.g. PCMB)</label>
                  <input type="text" className="form-control" {...register('code', { required: true })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Stream *</label>
                  <select className="form-select" {...register('stream', { required: true })}>
                    <option value="SCIENCE">Science</option>
                    <option value="COMMERCE">Commerce</option>
                    <option value="ARTS">Arts</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Course Full Name *</label>
                <input type="text" className="form-control" {...register('name', { required: true })} />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input type="text" className="form-control" defaultValue="2 Years" {...register('duration')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Annual Fee (INR)</label>
                  <input type="number" className="form-control" {...register('feePerYear')} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea rows="3" className="form-control" {...register('description')}></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Eligibility Criteria</label>
                <textarea rows="2" className="form-control" {...register('eligibility')}></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Career Prospects</label>
                <textarea rows="2" className="form-control" {...register('careerProspects')}></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline-primary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
