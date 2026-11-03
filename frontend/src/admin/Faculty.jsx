import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchFaculty = () => {
    setLoading(true);
    api.get('/admin/faculty')
      .then(res => res.success && setFaculty(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const openAddModal = () => {
    setEditingFaculty(null);
    reset({
      fullName: '',
      designation: '',
      department: 'Physics',
      qualification: '',
      experienceYears: 5,
      subjectsTaught: '',
      email: '',
      phone: '',
      bio: '',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      active: true
    });
    setModalOpen(true);
  };

  const openEditModal = (f) => {
    setEditingFaculty(f);
    reset(f);
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        id: editingFaculty ? editingFaculty.id : null
      };
      const res = await api.post('/admin/faculty', payload);
      if (res.success) {
        setModalOpen(false);
        fetchFaculty();
      }
    } catch (err) {
      alert(err.message || 'Failed to save faculty profile');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this faculty profile?')) {
      try {
        await api.delete(`/admin/faculty/${id}`);
        fetchFaculty();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Faculty Directory Management</h1>
          <p className="admin-header-subtitle">
            Manage professors, lecturers, qualifications, and department allocations
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}>
          <Plus size={16} /> Add Faculty Member
        </button>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Name & Designation</th>
              <th>Department</th>
              <th>Qualification</th>
              <th>Experience</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Loading faculty...
                </td>
              </tr>
            ) : faculty.map(f => (
              <tr key={f.id}>
                <td>
                  <img
                    src={f.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                    alt={f.fullName}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                </td>
                <td>
                  <strong>{f.fullName}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{f.designation}</div>
                </td>
                <td>
                  <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                    {f.department}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem' }}>{f.qualification}</td>
                <td>{f.experienceYears}+ Yrs</td>
                <td style={{ fontSize: '0.85rem' }}>{f.email || '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openEditModal(f)} className="btn btn-outline-primary btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(f.id)} className="btn btn-sm" style={{ padding: '0.3rem 0.6rem', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none' }}>
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
            backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', maxWidth: '620px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', position: 'relative'
          }}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
              {editingFaculty ? `Edit Faculty: ${editingFaculty.fullName}` : 'Add New Faculty Member'}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input type="text" className="form-control" {...register('fullName', { required: true })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Designation *</label>
                  <input type="text" className="form-control" placeholder="e.g. HOD / Senior Lecturer" {...register('designation', { required: true })} />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select className="form-select" {...register('department', { required: true })}>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Commerce & Accountancy">Commerce & Accountancy</option>
                    <option value="Economics">Economics</option>
                    <option value="Languages">Languages</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Qualifications *</label>
                  <input type="text" className="form-control" placeholder="e.g. B.Ed , M.Sc., Ph.D." {...register('qualification', { required: true })} />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Experience (Years)</label>
                  <input type="number" className="form-control" {...register('experienceYears')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Subjects Taught</label>
                  <input type="text" className="form-control" {...register('subjectsTaught')} />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" {...register('email')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Photo URL</label>
                  <input type="text" className="form-control" {...register('photoUrl')} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Short Biography</label>
                <textarea rows="3" className="form-control" {...register('bio')}></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline-primary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Faculty</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
