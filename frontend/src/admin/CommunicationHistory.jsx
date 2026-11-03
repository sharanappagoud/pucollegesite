import React, { useState, useEffect } from 'react';
import { 
  Mail, MessageSquare, Send, Search, Filter, Clock, CheckCircle2, 
  XCircle, User, Users, ShieldAlert, ArrowUpDown, RefreshCw, X, 
  ExternalLink, Smartphone, AlertCircle
} from 'lucide-react';
import api from '../services/api';

export const CommunicationHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters
  const [recipientType, setRecipientType] = useState('ALL');
  const [channel, setChannel] = useState('ALL');
  const [search, setSearch] = useState('');

  // Selected Log Modal
  const [selectedLog, setSelectedLog] = useState(null);

  // New Direct Message Modal
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sendSuccess, setSendSuccess] = useState('');
  const [newMessage, setNewMessage] = useState({
    referenceNo: '',
    recipientType: 'STUDENT',
    recipientName: '',
    recipientTarget: '',
    channel: 'EMAIL',
    subject: '',
    message: ''
  });

  const fetchLogs = async (currentPage = 0) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        size: 15
      });
      if (recipientType !== 'ALL') params.append('recipientType', recipientType);
      if (channel !== 'ALL') params.append('channel', channel);
      if (search.trim()) params.append('search', search.trim());

      const res = await api.get(`/admin/communications/logs?${params.toString()}`);
      if (res.success && res.data) {
        setLogs(res.data.content || []);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
        setTotalElements(res.data.totalElements);
      }
    } catch (err) {
      console.error('Failed to load communication history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(0);
  }, [recipientType, channel]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogs(0);
  };

  const handleSendDirect = async (e) => {
    e.preventDefault();
    setSending(true);
    setSendError('');
    setSendSuccess('');
    try {
      const res = await api.post('/admin/communications/send-direct', newMessage);
      if (res.success) {
        setSendSuccess('Message dispatched successfully and recorded in history!');
        setNewMessage({
          referenceNo: '',
          recipientType: 'STUDENT',
          recipientName: '',
          recipientTarget: '',
          channel: 'EMAIL',
          subject: '',
          message: ''
        });
        setTimeout(() => {
          setSendModalOpen(false);
          setSendSuccess('');
          fetchLogs(0);
        }, 1200);
      } else {
        setSendError(res.message || 'Failed to dispatch message');
      }
    } catch (err) {
      setSendError(err.message || 'Could not send message. Please verify recipient target.');
    } finally {
      setSending(false);
    }
  };

  const getRecipientBadge = (type) => {
    switch (type) {
      case 'STAFF':
        return { label: 'STAFF EMAIL', bg: '#f3e8ff', color: '#6b21a8', border: '#d8b4fe' };
      case 'STUDENT':
        return { label: 'STUDENT EMAIL', bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' };
      case 'PARENT':
        return { label: 'PARENT CONTACT', bg: '#d1fae5', color: '#065f46', border: '#a7f3d0' };
      default:
        return { label: type || 'RECIPIENT', bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Email & SMS Send Record History</h1>
          <p className="admin-header-subtitle">
            Live audit records of all automated and manual messages dispatched to Staff, Students, and Parents with exact time and date
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={() => fetchLogs(page)} 
            className="btn btn-outline-primary"
            title="Refresh logs"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={15} /> Refresh
          </button>
          <button 
            onClick={() => { setSendError(''); setSendSuccess(''); setSendModalOpen(true); }} 
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}
          >
            <Send size={16} /> Send Custom Message
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid-4" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #1e40af' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>
            Total Logged Dispatches
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary-900)', marginTop: '0.25rem' }}>
            {totalElements}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Emails & SMS across all modules</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #6b21a8' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>
            Staff Admin Alerts
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#6b21a8', marginTop: '0.25rem' }}>
            {logs.filter(l => l.recipientType === 'STAFF').length} (in page)
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Admin notification inboxes</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #2563eb' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>
            Student Messages
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#2563eb', marginTop: '0.25rem' }}>
            {logs.filter(l => l.recipientType === 'STUDENT').length} (in page)
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Confirmations & status updates</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #059669' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>
            Parent Contacts
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#059669', marginTop: '0.25rem' }}>
            {logs.filter(l => l.recipientType === 'PARENT').length} (in page)
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>SMS alerts & parent emails</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Recipient Type Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All Recipients' },
              { id: 'STAFF', label: 'Staff Email' },
              { id: 'STUDENT', label: 'Student Email' },
              { id: 'PARENT', label: 'Parent Email / SMS' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setRecipientType(tab.id)}
                className={`btn btn-sm ${recipientType === tab.id ? 'btn-primary' : 'btn-outline-primary'}`}
                style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1', maxWidth: '450px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Search reference, student name, or target email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.25rem', fontSize: '0.85rem', height: '36px' }}
              />
            </div>
            <select
              className="form-select"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              style={{ width: '120px', fontSize: '0.85rem', height: '36px' }}
            >
              <option value="ALL">All Channels</option>
              <option value="EMAIL">Email</option>
              <option value="SMS">SMS</option>
            </select>
            <button type="submit" className="btn btn-primary btn-sm" style={{ height: '36px', padding: '0 0.85rem' }}>
              Filter
            </button>
          </form>
        </div>
      </div>

      {/* Main Logs Table */}
      <div className="admin-table-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '190px' }}>Time & Date</th>
                <th>Recipient Category</th>
                <th>Recipient Target</th>
                <th>Channel</th>
                <th>Subject & Content Preview</th>
                <th>Reference</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3.5rem' }}>
                    <div className="loading-spinner" style={{ margin: '0 auto 0.75rem auto' }}></div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading communication records...</span>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
                    No communication history records found matching your filters.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const badge = getRecipientBadge(log.recipientType);
                  return (
                    <tr key={log.id}>
                      {/* Time and Date */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '600', color: 'var(--primary-900)', fontSize: '0.82rem' }}>
                          <Clock size={14} color="#64748b" />
                          <span>{formatDate(log.createdAt)}</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '1.25rem' }}>
                          By: {log.sentBy || 'SYSTEM'}
                        </div>
                      </td>

                      {/* Recipient Category */}
                      <td>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          backgroundColor: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px'
                        }}>
                          {badge.label}
                        </span>
                      </td>

                      {/* Recipient Target */}
                      <td>
                        <div style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          {log.recipientName || 'Recipient'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
                          {log.channel === 'SMS' ? <Smartphone size={12} color="#0891b2" /> : <Mail size={12} color="#4338ca" />}
                          <span style={{ fontFamily: 'monospace' }}>{log.recipientTarget}</span>
                        </div>
                      </td>

                      {/* Channel */}
                      <td>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.78rem',
                          fontWeight: '600',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          backgroundColor: log.channel === 'SMS' ? '#ecfeff' : '#eef2ff',
                          color: log.channel === 'SMS' ? '#0891b2' : '#4338ca'
                        }}>
                          {log.channel === 'SMS' ? <Smartphone size={13} /> : <Mail size={13} />}
                          {log.channel}
                        </span>
                      </td>

                      {/* Subject & Preview */}
                      <td style={{ maxWidth: '280px' }}>
                        <div style={{ fontWeight: '600', fontSize: '0.82rem', color: 'var(--primary-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {log.subject || 'Message Notification'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                          {log.message}
                        </div>
                      </td>

                      {/* Reference */}
                      <td>
                        {log.referenceNo ? (
                          <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: '700', color: '#1e40af', backgroundColor: '#eff6ff', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                            {log.referenceNo}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '9999px',
                          backgroundColor: log.status === 'SENT' ? '#dcfce7' : log.status === 'QUEUED' ? '#fef3c7' : '#fee2e2',
                          color: log.status === 'SENT' ? '#15803d' : log.status === 'QUEUED' ? '#b45309' : '#b91c1c'
                        }}>
                          {log.status === 'SENT' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {log.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="btn btn-outline-primary btn-sm"
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Page {page + 1} of {totalPages} ({totalElements} total entries)
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                disabled={page === 0}
                onClick={() => fetchLogs(page - 1)}
                className="btn btn-outline-primary btn-sm"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => fetchLogs(page + 1)}
                className="btn btn-outline-primary btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Message Detail Modal */}
      {selectedLog && (
        <div className="modal-backdrop" onClick={() => setSelectedLog(null)}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedLog(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Mail size={22} color="var(--primary-700)" />
              <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-900)' }}>
                Message Dispatch Details
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
              <div>
                <strong>Recipient Category:</strong>
                <div>
                  <span style={{ ...getRecipientBadge(selectedLog.recipientType), display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', marginTop: '2px' }}>
                    {getRecipientBadge(selectedLog.recipientType).label}
                  </span>
                </div>
              </div>
              <div>
                <strong>Channel:</strong>
                <div style={{ fontWeight: '600', color: 'var(--primary-800)' }}>
                  {selectedLog.channel}
                </div>
              </div>
              <div>
                <strong>Recipient Name:</strong>
                <div>{selectedLog.recipientName || 'N/A'}</div>
              </div>
              <div>
                <strong>Target (Email / Mobile):</strong>
                <div style={{ fontFamily: 'monospace', fontWeight: '600' }}>{selectedLog.recipientTarget}</div>
              </div>
              <div>
                <strong>Time & Date:</strong>
                <div style={{ color: 'var(--primary-900)', fontWeight: '600' }}>{formatDate(selectedLog.createdAt)}</div>
              </div>
              <div>
                <strong>Reference Number:</strong>
                <div style={{ fontFamily: 'monospace', color: '#1e40af', fontWeight: 'bold' }}>{selectedLog.referenceNo || 'None'}</div>
              </div>
              <div>
                <strong>Trigger Event:</strong>
                <div>{selectedLog.triggerEvent}</div>
              </div>
              <div>
                <strong>Delivery Status:</strong>
                <div style={{ color: selectedLog.status === 'SENT' ? '#15803d' : '#b91c1c', fontWeight: 'bold' }}>
                  {selectedLog.status}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <strong style={{ fontSize: '0.88rem' }}>Subject Line:</strong>
              <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', marginTop: '4px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                {selectedLog.subject || 'No subject'}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <strong style={{ fontSize: '0.88rem' }}>Dispatched Message Body:</strong>
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '1rem',
                fontSize: '0.85rem',
                maxHeight: '220px',
                overflowY: 'auto',
                whiteSpace: 'pre-line',
                color: '#334155',
                marginTop: '4px'
              }}>
                {selectedLog.message}
              </div>
            </div>

            <button onClick={() => setSelectedLog(null)} className="btn btn-outline-primary btn-sm" style={{ width: '100%' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Send Custom Message Modal */}
      {sendModalOpen && (
        <div className="modal-backdrop" onClick={() => setSendModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSendModalOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Send size={22} color="var(--primary-700)" />
              <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-900)' }}>
                Dispatch Direct Email / SMS
              </h2>
            </div>

            {sendSuccess && (
              <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                ✓ {sendSuccess}
              </div>
            )}

            {sendError && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                ✕ {sendError}
              </div>
            )}

            <form onSubmit={handleSendDirect}>
              <div className="grid-2" style={{ gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Recipient Category *</label>
                  <select 
                    className="form-select"
                    value={newMessage.recipientType}
                    onChange={(e) => setNewMessage({ ...newMessage, recipientType: e.target.value })}
                  >
                    <option value="STUDENT">Student Email</option>
                    <option value="PARENT">Parent Contact</option>
                    <option value="STAFF">Staff / Admin Email</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Channel *</label>
                  <select 
                    className="form-select"
                    value={newMessage.channel}
                    onChange={(e) => setNewMessage({ ...newMessage, channel: e.target.value })}
                  >
                    <option value="EMAIL">Email</option>
                    <option value="SMS">SMS Message</option>
                  </select>
                </div>
              </div>

              <div className="grid-2" style={{ gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Recipient Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Candidate or Parent name"
                    value={newMessage.recipientName}
                    onChange={(e) => setNewMessage({ ...newMessage, recipientName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {newMessage.channel === 'EMAIL' ? 'Target Email Address *' : 'Target Mobile Number *'}
                  </label>
                  <input
                    type={newMessage.channel === 'EMAIL' ? 'email' : 'tel'}
                    className="form-control"
                    placeholder={newMessage.channel === 'EMAIL' ? 'recipient@gmail.com' : '10-digit mobile number'}
                    required
                    value={newMessage.recipientTarget}
                    onChange={(e) => setNewMessage({ ...newMessage, recipientTarget: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label className="form-label">Reference Number (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. ADM-2026-1001"
                  value={newMessage.referenceNo}
                  onChange={(e) => setNewMessage({ ...newMessage, referenceNo: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label className="form-label">Subject Line</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Document Verification Reminder"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Message Content *</label>
                <textarea
                  rows="4"
                  className="form-control"
                  placeholder="Type message text here..."
                  required
                  value={newMessage.message}
                  onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setSendModalOpen(false)} className="btn btn-outline-primary">
                  Cancel
                </button>
                <button type="submit" disabled={sending} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Send size={15} />
                  {sending ? 'Dispatching...' : 'Dispatch Message & Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

