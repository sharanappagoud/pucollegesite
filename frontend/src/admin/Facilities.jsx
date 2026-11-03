import React, { useState, useEffect } from 'react';
import { Building2, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchFacilities = () => {
    setLoading(true);
    api.get('/admin/facilities')
      .then(res => res.success && setFacilities(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const openAddModal = () => {
    setEditingFacility(null);
    reset({
      title: '',
      category: 'LABORATORY',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      features: '',
      active: true
    });
    setModalOpen(true);
  };

  const openEditModal = (f) => {
    setEditingFacility(f);
    reset(f);
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        id: editingFacility ? editingFacility.id : null
      };
      const res = await api.post('/admin/facilities', payload);
      if (res.success) {
        setModalOpen(false);
        fetchFacilities();
      }
    } catch (err) {
      alert(err.message || 'Failed to save facility');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this facility?')) {
      try {
        await api.delete(`/admin/facilities/${id}`);
        fetchFacilities();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Facilities & Infrastructure</h1>
          <p className="admin-header-subtitle">
            Manage science labs, digital libraries, sports arenas, and amenities
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}>
          <Plus size={16} /> Add Facility
        </button>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Facility Title</th>
              <th>Category</th>
              <th>Features</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Loading facilities...
                </td>
              </tr>
            ) : facilities.map(f => (
              <tr key={f.id}>
                <td>
                  <img
                    src={f.imageUrl}
                    alt={f.title}
                    style={{ width: '56px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                  />
                </td>
                <td>
                  <strong>{f.title}</strong>
                </td>
                <td>
                  <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                    {f.category}
                  </span>
                </td>
                <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '300px' }}>
                  {f.features || f.description?.substring(0, 75)}
                </td>
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
            backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', position: 'relative'
          }}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
              {editingFacility ? `Edit Facility: ${editingFacility.title}` : 'Add New Campus Facility'}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Facility Title *</label>
                  <input type="text" className="form-control" {...register('title', { required: true })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-select" {...register('category', { required: true })}>
                    <option value="LABORATORY">Laboratory</option>
                    <option value="ACADEMIC">Academic / Library</option>
                    <option value="INFRASTRUCTURE">Infrastructure / Auditorium</option>
                    <option value="SPORTS">Sports & Fitness</option>
                    <option value="AMENITIES">Student Amenities</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input type="text" className="form-control" {...register('imageUrl')} />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea rows="3" className="form-control" {...register('description')}></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Features (comma separated)</label>
                <input type="text" className="form-control" placeholder="e.g. Workstations, Fume hoods, Digital balances" {...register('features')} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline-primary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Facility</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
