import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchEvents = () => {
    setLoading(true);
    api.get('/admin/events')
      .then(res => res.success && setEvents(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openAddModal = () => {
    setEditingEvent(null);
    reset({
      title: '',
      eventDate: new Date().toISOString().slice(0, 10),
      eventTime: '10:00 AM - 01:00 PM',
      location: 'Main Auditorium',
      description: '',
      status: 'UPCOMING'
    });
    setModalOpen(true);
  };

  const openEditModal = (ev) => {
    setEditingEvent(ev);
    reset(ev);
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        id: editingEvent ? editingEvent.id : null
      };
      const res = await api.post('/admin/events', payload);
      if (res.success) {
        setModalOpen(false);
        fetchEvents();
      }
    } catch (err) {
      alert(err.message || 'Failed to save event');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this event?')) {
      try {
        await api.delete(`/admin/events/${id}`);
        fetchEvents();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">College Events Management</h1>
          <p className="admin-header-subtitle">
            Schedule orientations, cultural fests, science exhibitions, and athletic meets
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}>
          <Plus size={16} /> Schedule New Event
        </button>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Date & Time</th>
              <th>Venue / Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Loading events...
                </td>
              </tr>
            ) : events.map(ev => (
              <tr key={ev.id}>
                <td>
                  <strong>{ev.title}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ev.description}</div>
                </td>
                <td style={{ fontSize: '0.85rem' }}>
                  <strong>{ev.eventDate}</strong>
                  <div style={{ color: 'var(--text-muted)' }}>{ev.eventTime}</div>
                </td>
                <td style={{ fontSize: '0.85rem' }}>{ev.location}</td>
                <td>
                  <span className="badge" style={{
                    backgroundColor: ev.status === 'UPCOMING' ? '#dcfce7' : '#f1f5f9',
                    color: ev.status === 'UPCOMING' ? '#15803d' : '#475569'
                  }}>
                    {ev.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openEditModal(ev)} className="btn btn-outline-primary btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(ev.id)} className="btn btn-sm" style={{ padding: '0.3rem 0.6rem', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none' }}>
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
              {editingEvent ? `Edit Event: ${editingEvent.title}` : 'Schedule New College Event'}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label className="form-label">Event Title *</label>
                <input type="text" className="form-control" {...register('title', { required: true })} />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Event Date *</label>
                  <input type="date" className="form-control" {...register('eventDate', { required: true })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input type="text" className="form-control" placeholder="e.g. 10:00 AM - 01:00 PM" {...register('eventTime')} />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Location / Venue</label>
                  <input type="text" className="form-control" placeholder="e.g. Soudha Auditorium" {...register('location')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" {...register('status')}>
                    <option value="UPCOMING">Upcoming</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea rows="3" className="form-control" {...register('description')}></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline-primary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
