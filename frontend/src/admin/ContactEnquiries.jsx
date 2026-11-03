import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, Clock, Trash2, X } from 'lucide-react';
import api from '../services/api';

export const ContactEnquiries = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('RESOLVED');

  const fetchMessages = () => {
    setLoading(true);
    api.get('/admin/contact-enquiries')
      .then(res => res.success && setMessages(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const openModal = (msg) => {
    setSelectedMsg(msg);
    setStatus(msg.status || 'RESOLVED');
    setNotes(msg.responseNotes || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedMsg) return;
    try {
      const res = await api.patch(`/admin/contact-enquiries/${selectedMsg.id}/status`, {
        status,
        notes
      });
      if (res.success) {
        setSelectedMsg(null);
        fetchMessages();
      }
    } catch (err) {
      alert(err.message || 'Update failed');
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Contact Messages & Enquiries</h1>
          <p className="admin-header-subtitle">
            Review feedback, bus transport inquiries, and general correspondence from visitors and parents
          </p>
        </div>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Sender</th>
              <th>Contact</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Loading contact messages...
                </td>
              </tr>
            ) : messages.map(msg => (
              <tr key={msg.id}>
                <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {msg.createdAt ? msg.createdAt.slice(0, 10) : ''}
                </td>
                <td>
                  <strong>{msg.fullName}</strong>
                </td>
                <td style={{ fontSize: '0.85rem' }}>
                  <div>📞 {msg.phone || '—'}</div>
                  <div style={{ color: 'var(--text-muted)' }}>✉️ {msg.email}</div>
                </td>
                <td>
                  <strong>{msg.subject}</strong>
                </td>
                <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '280px' }}>
                  {msg.message?.substring(0, 80)}...
                </td>
                <td>
                  <span className="badge" style={{
                    backgroundColor: msg.status === 'NEW' ? '#dbeafe' : '#dcfce7',
                    color: msg.status === 'NEW' ? '#1e40af' : '#15803d'
                  }}>
                    {msg.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => openModal(msg)} className="btn btn-outline-primary btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
                    View & Respond
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedMsg && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', maxWidth: '580px', width: '100%', padding: '2rem', position: 'relative'
          }}>
            <button onClick={() => setSelectedMsg(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', marginBottom: '1rem' }}>
              Message from {selectedMsg.fullName}
            </h3>

            <div style={{ marginBottom: '1.25rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
              <p><strong>Email:</strong> {selectedMsg.email} | <strong>Phone:</strong> {selectedMsg.phone || 'N/A'}</p>
              <p style={{ marginTop: '0.5rem' }}><strong>Subject:</strong> {selectedMsg.subject}</p>
              <div style={{ backgroundColor: 'var(--bg-page)', padding: '1rem', borderRadius: '6px', marginTop: '0.5rem', color: 'var(--text-main)' }}>
                {selectedMsg.message}
              </div>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Update Status</label>
                  <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="NEW">New</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Response Note</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Called student, confirmed route"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setSelectedMsg(null)} className="btn btn-outline-primary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Note</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
