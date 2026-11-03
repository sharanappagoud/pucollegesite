import React, { useState, useEffect } from 'react';
import { CalendarDays, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export const Calendar = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchCalendar = () => {
    setLoading(true);
    api.get('/admin/calendar?year=2026-27')
      .then(res => res.success && setItems(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    reset({
      eventTitle: '',
      category: 'ACADEMIC',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '',
      description: '',
      academicYear: '2026-27'
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
      const res = await api.post('/admin/calendar', payload);
      if (res.success) {
        setModalOpen(false);
        fetchCalendar();
      }
    } catch (err) {
      alert(err.message || 'Failed to save calendar milestone');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this calendar event?')) {
      try {
        await api.delete(`/admin/calendar/${id}`);
        fetchCalendar();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Academic Calendar Management</h1>
          <p className="admin-header-subtitle">
            Schedule term openings, mid-terms, unit tests, vacations, and annual board examinations
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}>
          <Plus size={16} /> Add Calendar Event
        </button>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Category</th>
              <th>Dates</th>
              <th>Academic Year</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Loading calendar...
                </td>
              </tr>
            ) : items.map(item => (
              <tr key={item.id}>
                <td>
                  <strong>{item.eventTitle}</strong>
                </td>
                <td>
                  <span className="badge" style={{
                    backgroundColor: item.category === 'EXAMINATION' ? '#fee2e2' : item.category === 'HOLIDAY' ? '#fef3c7' : '#e0f2fe',
                    color: item.category === 'EXAMINATION' ? '#991b1b' : item.category === 'HOLIDAY' ? '#92400e' : '#075985'
                  }}>
                    {item.category}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem' }}>
                  {item.startDate} {item.endDate ? `to ${item.endDate}` : ''}
                </td>
                <td style={{ fontSize: '0.85rem' }}>{item.academicYear}</td>
                <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.description}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openEditModal(item)} className="btn btn-outline-primary btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="btn btn-sm" style={{ padding: '0.3rem 0.6rem', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none' }}>
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
              {editingItem ? 'Edit Calendar Milestone' : 'Add Calendar Milestone'}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label className="form-label">Event Milestone Title *</label>
                <input type="text" className="form-control" {...register('eventTitle', { required: true })} />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" {...register('category')}>
                    <option value="ACADEMIC">Academic</option>
                    <option value="EXAMINATION">Examination</option>
                    <option value="HOLIDAY">Holiday / Vacation</option>
                    <option value="SPORTS">Sports & Athletics</option>
                    <option value="CULTURAL">Cultural Celebration</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Academic Year</label>
                  <input type="text" className="form-control" defaultValue="2026-27" {...register('academicYear')} />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input type="date" className="form-control" {...register('startDate', { required: true })} />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date (Optional)</label>
                  <input type="date" className="form-control" {...register('endDate')} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Brief Description</label>
                <input type="text" className="form-control" placeholder="e.g. Applicable for 1st and 2nd PUC batches" {...register('description')} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline-primary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Milestone</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
