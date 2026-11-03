import React, { useState, useEffect } from 'react';
import { Mail, Plus, Edit2, Trash2, X, Send, CheckCircle2, XCircle, BellRing, Smartphone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export const Notifications = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  // Test send simulation modal
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testRecipient, setTestRecipient] = useState('admissions@mpuc.edu.in');
  const [testKey, setTestKey] = useState('ENQUIRY_RECEIVED');
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchTemplates = () => {
    setLoading(true);
    api.get('/admin/notifications')
      .then(res => {
        if (res.success) setTemplates(res.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const openAddModal = () => {
    setEditingTemplate(null);
    reset({
      templateKey: '',
      name: '',
      subject: '',
      bodyTemplate: 'Dear {{student_name}},\n\nThank you for choosing Masters Pre-University College.\n\nWarm Regards,\nAdmissions Office',
      type: 'EMAIL',
      active: true
    });
    setModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditingTemplate(t);
    reset(t);
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        id: editingTemplate ? editingTemplate.id : null,
        templateKey: data.templateKey.toUpperCase().trim()
      };
      const res = await api.post('/admin/notifications', payload);
      if (res.success) {
        setModalOpen(false);
        fetchTemplates();
      }
    } catch (err) {
      alert(err.message || 'Failed to save notification template');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete template "${name}"?`)) {
      try {
        await api.delete(`/admin/notifications/${id}`);
        fetchTemplates();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  const handleTestSend = async () => {
    setTestSending(true);
    setTestResult(null);
    try {
      const res = await api.post('/admin/notifications/test-send', {
        recipient: testRecipient,
        templateKey: testKey
      });
      if (res.success) {
        setTestResult({ success: true, message: res.message });
      }
    } catch (err) {
      setTestResult({ success: false, message: err.message || 'Failed to dispatch test notification' });
    } finally {
      setTestSending(false);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Email & Notification Settings</h1>
          <p className="admin-header-subtitle">
            Configure admission acknowledgements, counselling invites, and automated SMS/Email templates
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => { setTestResult(null); setTestModalOpen(true); }} className="btn btn-outline-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Send size={16} /> Test Dispatch
          </button>
          <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}>
            <Plus size={18} /> New Template
          </button>
        </div>
      </div>

      {/* Templates Table */}
      <div className="admin-table-card">
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Template Key</th>
                <th>Template Name</th>
                <th>Subject Line</th>
                <th>Channel</th>
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
              ) : templates.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No notification templates registered.
                  </td>
                </tr>
              ) : (
                templates.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '0.82rem', backgroundColor: '#f1f5f9', color: 'var(--primary-800)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {t.templateKey}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--primary-900)' }}>{t.name}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '300px' }}>
                      {t.subject}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: t.type === 'SMS' ? '#0891b2' : '#4338ca', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        {t.type === 'SMS' ? <Smartphone size={13} /> : <Mail size={13} />} {t.type}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: t.active ? '#dcfce7' : '#fee2e2',
                        color: t.active ? '#166534' : '#991b1b',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '12px'
                      }}>
                        {t.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button onClick={() => openEditModal(t)} className="btn-icon" title="Edit" style={{ color: 'var(--primary-700)' }}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(t.id, t.name)} className="btn-icon" title="Delete" style={{ color: '#ef4444' }}>
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

      {/* Edit / Add Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
              {editingTemplate ? `Edit Template: ${editingTemplate.name}` : 'Create Notification Template'}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Template Unique Key *</label>
                  <input type="text" className="form-control" placeholder="e.g. APPLICATION_APPROVED" {...register('templateKey', { required: true })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Template Friendly Name *</label>
                  <input type="text" className="form-control" placeholder="e.g. Application Approval Notice" {...register('name', { required: true })} />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Channel Type</label>
                  <select className="form-select" {...register('type')}>
                    <option value="EMAIL">Email</option>
                    <option value="SMS">SMS Gateway</option>
                    <option value="WHATSAPP">WhatsApp Message</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Email Subject Line *</label>
                  <input type="text" className="form-control" placeholder="e.g. MPUC Admission Approved - {{application_no}}" {...register('subject', { required: true })} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Message Body Template (supports {'{{placeholder}}'} tokens) *</label>
                <textarea rows="7" className="form-control" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} {...register('bodyTemplate', { required: true })}></textarea>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Available tokens: {'{{student_name}}'}, {'{{reference_no}}'}, {'{{application_no}}'}, {'{{preferred_stream}}'}, {'{{preferred_combination}}'}, {'{{appointment_time}}'}
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="tmplActive" {...register('active')} />
                <label htmlFor="tmplActive" style={{ margin: 0, fontSize: '0.88rem', cursor: 'pointer' }}>
                  Enable automatic trigger for this template
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline-primary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Template</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Test Dispatch Modal */}
      {testModalOpen && (
        <div className="modal-backdrop" onClick={() => setTestModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setTestModalOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BellRing size={20} style={{ color: 'var(--primary-700)' }} /> Test Notification Dispatch
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Simulate dispatching a rendered notification message through the backend email server.
            </p>

            {testResult && (
              <div style={{
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                backgroundColor: testResult.success ? '#dcfce7' : '#fee2e2',
                color: testResult.success ? '#15803d' : '#991b1b'
              }}>
                {testResult.message}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Recipient Email or Phone</label>
              <input
                type="text"
                className="form-control"
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Select Notification Template</label>
              <select
                className="form-select"
                value={testKey}
                onChange={(e) => setTestKey(e.target.value)}
              >
                {templates.map(t => (
                  <option key={t.templateKey} value={t.templateKey}>{t.name} ({t.templateKey})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setTestModalOpen(false)} className="btn btn-outline-primary btn-sm">Close</button>
              <button type="button" onClick={handleTestSend} disabled={testSending} className="btn btn-primary btn-sm">
                {testSending ? 'Dispatching...' : 'Send Test Notification'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
