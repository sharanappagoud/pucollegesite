import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Settings, CheckCircle2, AlertCircle, RefreshCw,
  Send, Plus, Trash2, Edit, Shield, ExternalLink, Activity, Phone,
  ToggleLeft, ToggleRight, Database, Users, Eye, EyeOff
} from 'lucide-react';
import {
  getAdminWhatsAppSettings,
  updateAdminWhatsAppSettings,
  getAdminWhatsAppTemplates,
  createAdminWhatsAppTemplate,
  updateAdminWhatsAppTemplate,
  deleteAdminWhatsAppTemplate,
  getAdminWhatsAppLogs,
  getAdminWhatsAppOptIns,
  sendAdminWhatsAppMessage,
  buildWhatsAppUrl
} from '../services/whatsappService';
import { WhatsAppIcon } from '../components/FloatingWhatsApp';

export const WhatsAppManagement = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Settings State
  const [settings, setSettings] = useState({
    id: 1,
    phoneNumber: '918023456789',
    displayPhoneNumber: '+91 80234 56789',
    floatingEnabled: true,
    welcomeMessage: 'Chat with MPUC College',
    welcomeSubtitle: 'Typically replies within a few minutes',
    prefilledDefaultMessage: 'Hello MPUC College, I would like to enquire about PU admissions and courses for the academic year 2026-27.',
    businessAccountId: '',
    phoneNumberId: '',
    apiVersion: 'v19.0',
    webhookVerifyToken: 'mpuc_whatsapp_verify_token_2026',
    autoNotificationsEnabled: false,
    notifyOnEnquiry: true,
    notifyOnStatusChange: true,
    notifyOnCounselling: true,
    notifyOnExam: true,
    isCloudApiConfigured: false,
    hasAccessToken: false,
    hasAppSecret: false
  });

  // Templates State
  const [templates, setTemplates] = useState([]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    templateName: '',
    category: 'UTILITY',
    language: 'en',
    status: 'APPROVED',
    headerText: '',
    bodyText: '',
    footerText: '',
    isActive: true
  });

  // Logs State
  const [logs, setLogs] = useState([]);
  const [logsPage, setLogsPage] = useState(0);
  const [totalLogPages, setTotalLogPages] = useState(1);

  // Opt-ins State
  const [optIns, setOptIns] = useState([]);
  const [optInsPage, setOptInsPage] = useState(0);
  const [totalOptInPages, setTotalOptInPages] = useState(1);

  // Test Messenger State
  const [testForm, setTestForm] = useState({
    recipientPhone: '',
    recipientName: '',
    templateName: '',
    customMessage: '',
    p1: '',
    p2: '',
    p3: ''
  });
  const [testResult, setTestResult] = useState(null);
  const [testSending, setTestSending] = useState(false);

  // Initial load
  useEffect(() => {
    loadSettings();
    loadTemplates();
  }, []);

  useEffect(() => {
    if (activeTab === 'logs') {
      loadLogs(logsPage);
    } else if (activeTab === 'optins') {
      loadOptIns(optInsPage);
    }
  }, [activeTab, logsPage, optInsPage]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getAdminWhatsAppSettings();
      if (data) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.warn('Could not load WhatsApp admin settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const data = await getAdminWhatsAppTemplates();
      if (Array.isArray(data)) {
        setTemplates(data);
      }
    } catch (err) {
      console.warn('Could not load templates:', err);
    }
  };

  const loadLogs = async (page) => {
    try {
      setLoading(true);
      const data = await getAdminWhatsAppLogs(page, 15);
      if (data && data.content) {
        setLogs(data.content);
        setTotalLogPages(data.totalPages || 1);
      } else if (Array.isArray(data)) {
        setLogs(data);
      }
    } catch (err) {
      console.warn('Could not load notification logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadOptIns = async (page) => {
    try {
      setLoading(true);
      const data = await getAdminWhatsAppOptIns(page, 15);
      if (data && data.content) {
        setOptIns(data.content);
        setTotalOptInPages(data.totalPages || 1);
      } else if (Array.isArray(data)) {
        setOptIns(data);
      }
    } catch (err) {
      console.warn('Could not load opt-ins:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaveSuccess('');
    setErrorMessage('');
    try {
      setLoading(true);
      const updated = await updateAdminWhatsAppSettings(settings);
      setSettings(prev => ({ ...prev, ...updated }));
      setSaveSuccess('WhatsApp settings saved successfully!');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  // Template Modal handlers
  const handleOpenTemplateModal = (tpl = null) => {
    if (tpl) {
      setEditingTemplate(tpl);
      setTemplateForm({
        templateName: tpl.templateName,
        category: tpl.category || 'UTILITY',
        language: tpl.language || 'en',
        status: tpl.status || 'APPROVED',
        headerText: tpl.headerText || '',
        bodyText: tpl.bodyText || '',
        footerText: tpl.footerText || '',
        isActive: tpl.isActive !== false
      });
    } else {
      setEditingTemplate(null);
      setTemplateForm({
        templateName: '',
        category: 'UTILITY',
        language: 'en',
        status: 'APPROVED',
        headerText: '',
        bodyText: '',
        footerText: '',
        isActive: true
      });
    }
    setIsTemplateModalOpen(true);
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        await updateAdminWhatsAppTemplate(editingTemplate.id, templateForm);
      } else {
        await createAdminWhatsAppTemplate(templateForm);
      }
      setIsTemplateModalOpen(false);
      loadTemplates();
      setSaveSuccess('Template saved successfully!');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      alert('Error saving template: ' + err.message);
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message template?')) return;
    try {
      await deleteAdminWhatsAppTemplate(id);
      loadTemplates();
    } catch (err) {
      alert('Failed to delete template: ' + err.message);
    }
  };

  // Test send handler
  const handleSendTestMessage = async (e) => {
    e.preventDefault();
    setTestSending(true);
    setTestResult(null);
    try {
      const params = [testForm.p1, testForm.p2, testForm.p3].filter(Boolean);
      const payload = {
        recipientPhone: testForm.recipientPhone,
        recipientName: testForm.recipientName || 'Test Recipient',
        templateName: testForm.templateName || null,
        parameters: params.length > 0 ? params : null,
        customMessage: testForm.customMessage || 'Hello from Master PU College WhatsApp verification service!',
        referenceType: 'TEST',
        referenceId: 'TEST-' + Date.now().toString().slice(-4)
      };

      const res = await sendAdminWhatsAppMessage(payload);
      setTestResult({
        success: res.success !== false,
        message: res.message || 'Processed',
        data: res.data || res
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || 'Failed to dispatch message',
        data: null
      });
    } finally {
      setTestSending(false);
    }
  };

  return (
    <div className="admin-content-inner" style={{ padding: '1.75rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px', height: '42px',
              backgroundColor: '#25D366',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)'
            }}>
              <WhatsAppIcon size={24} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-900)', margin: 0 }}>
                WhatsApp Business Integration
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Manage floating click-to-chat widgets, Meta Cloud API credentials, templates, and delivery status
              </p>
            </div>
          </div>
        </div>

        {/* Cloud API Connection Status Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          borderRadius: '20px',
          backgroundColor: settings.isCloudApiConfigured ? '#ecfdf5' : '#fffbeb',
          border: `1px solid ${settings.isCloudApiConfigured ? '#a7f3d0' : '#fde68a'}`,
          fontSize: '0.82rem',
          fontWeight: '600',
          color: settings.isCloudApiConfigured ? '#065f46' : '#92400e'
        }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            backgroundColor: settings.isCloudApiConfigured ? '#10b981' : '#f59e0b'
          }} />
          <span>{settings.isCloudApiConfigured ? 'Meta Cloud API Connected' : 'Click-to-Chat Mode Active (Cloud API Unconfigured)'}</span>
        </div>
      </div>

      {/* Alert Messages */}
      {saveSuccess && (
        <div style={{ padding: '0.85rem 1.25rem', backgroundColor: '#dcfce7', border: '1px solid #86efac', color: '#166534', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} />
          <span>{saveSuccess}</span>
        </div>
      )}
      {errorMessage && (
        <div style={{ padding: '0.85rem 1.25rem', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: '1.5rem',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setActiveTab('settings')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'settings' ? '2.5px solid #25D366' : '2.5px solid transparent',
            color: activeTab === 'settings' ? '#075E54' : '#64748b',
            fontWeight: activeTab === 'settings' ? '700' : '500',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '0.9rem'
          }}
        >
          <Settings size={17} />
          <span>General & Cloud API</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'templates' ? '2.5px solid #25D366' : '2.5px solid transparent',
            color: activeTab === 'templates' ? '#075E54' : '#64748b',
            fontWeight: activeTab === 'templates' ? '700' : '500',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '0.9rem'
          }}
        >
          <MessageSquare size={17} />
          <span>Message Templates ({templates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'logs' ? '2.5px solid #25D366' : '2.5px solid transparent',
            color: activeTab === 'logs' ? '#075E54' : '#64748b',
            fontWeight: activeTab === 'logs' ? '700' : '500',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '0.9rem'
          }}
        >
          <Activity size={17} />
          <span>Delivery Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('optins')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'optins' ? '2.5px solid #25D366' : '2.5px solid transparent',
            color: activeTab === 'optins' ? '#075E54' : '#64748b',
            fontWeight: activeTab === 'optins' ? '700' : '500',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '0.9rem'
          }}
        >
          <Users size={17} />
          <span>User Consent & Opt-Ins</span>
        </button>

        <button
          onClick={() => setActiveTab('testMessenger')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'testMessenger' ? '2.5px solid #25D366' : '2.5px solid transparent',
            color: activeTab === 'testMessenger' ? '#075E54' : '#64748b',
            fontWeight: activeTab === 'testMessenger' ? '700' : '500',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '0.9rem'
          }}
        >
          <Send size={17} />
          <span>Test WhatsApp Messenger</span>
        </button>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* TAB 1: General & Cloud API Settings */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings}>
          <div className="grid-2" style={{ gap: '1.75rem', alignItems: 'flex-start' }}>
            {/* Left Card: Public Floating Widget & Contact Info */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', color: '#075E54' }}>
                <Phone size={20} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', margin: 0 }}>Public Floating Widget & Click-to-Chat</h3>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <span style={{ fontWeight: '600', color: 'var(--primary-900)' }}>Enable Floating WhatsApp Button</span>
                  <input
                    type="checkbox"
                    checked={settings.floatingEnabled}
                    onChange={(e) => setSettings({ ...settings, floatingEnabled: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </label>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Displays the official green WhatsApp button at the bottom-right corner of all public pages.
                </p>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                  College Verified WhatsApp Number (E.164 without '+')
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.phoneNumber}
                  onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                  placeholder="e.g. 918023456789"
                  required
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  All click-to-chat links (https://wa.me/...) will open a conversation with this verified number.
                </p>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                  Display Phone Number (Public Labels)
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.displayPhoneNumber}
                  onChange={(e) => setSettings({ ...settings, displayPhoneNumber: e.target.value })}
                  placeholder="e.g. +91 80234 56789"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                  Floating Tooltip & Card Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.welcomeMessage}
                  onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                  placeholder="Chat with MPUC College"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                  Card Subtitle
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.welcomeSubtitle}
                  onChange={(e) => setSettings({ ...settings, welcomeSubtitle: e.target.value })}
                  placeholder="Typically replies within a few minutes"
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                  Default Prefilled Message
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={settings.prefilledDefaultMessage}
                  onChange={(e) => setSettings({ ...settings, prefilledDefaultMessage: e.target.value })}
                  placeholder="Hello MPUC College, I would like to enquire about..."
                />
              </div>
            </div>

            {/* Right Card: Meta WhatsApp Business Platform Cloud API */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', color: '#075E54' }}>
                <Shield size={20} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', margin: 0 }}>Meta Cloud API & Webhooks</h3>
              </div>

              <div style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                fontSize: '0.8rem',
                color: '#1e40af',
                marginBottom: '1.25rem',
                lineHeight: '1.5'
              }}>
                <strong>Security Notice:</strong> As required by security policies, raw Meta Access Tokens (<code>WHATSAPP_ACCESS_TOKEN</code>) and App Secrets (<code>WHATSAPP_APP_SECRET</code>) are managed exclusively via backend environment variables and cannot be exposed to the browser.
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                  Meta Cloud API Access Token Status
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    backgroundColor: settings.hasAccessToken ? '#dcfce7' : '#fee2e2',
                    color: settings.hasAccessToken ? '#15803d' : '#b91c1c'
                  }}>
                    {settings.hasAccessToken ? '● SET IN BACKEND (MASKED)' : '○ NOT CONFIGURED'}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Env: WHATSAPP_ACCESS_TOKEN
                  </span>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                  Phone Number ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.phoneNumberId || ''}
                  onChange={(e) => setSettings({ ...settings, phoneNumberId: e.target.value })}
                  placeholder="e.g. 104829182749102"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                  WhatsApp Business Account ID (WABA)
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.businessAccountId || ''}
                  onChange={(e) => setSettings({ ...settings, businessAccountId: e.target.value })}
                  placeholder="e.g. 294819283749182"
                />
              </div>

              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                    Graph API Version
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.apiVersion || 'v19.0'}
                    onChange={(e) => setSettings({ ...settings, apiVersion: e.target.value })}
                    placeholder="v19.0"
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                    Webhook Verify Token
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.webhookVerifyToken || 'mpuc_whatsapp_verify_token_2026'}
                    onChange={(e) => setSettings({ ...settings, webhookVerifyToken: e.target.value })}
                    placeholder="mpuc_whatsapp_verify_token_2026"
                  />
                </div>
              </div>

              {/* Automated Notifications Toggles */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.75rem' }}>
                  Automated Event Notifications
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.autoNotificationsEnabled}
                      onChange={(e) => setSettings({ ...settings, autoNotificationsEnabled: e.target.checked })}
                    />
                    <strong>Enable Automated Meta Cloud API Alerts</strong>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#475569', cursor: 'pointer', paddingLeft: '1.5rem' }}>
                    <input
                      type="checkbox"
                      checked={settings.notifyOnEnquiry}
                      disabled={!settings.autoNotificationsEnabled}
                      onChange={(e) => setSettings({ ...settings, notifyOnEnquiry: e.target.checked })}
                    />
                    <span>Enquiry Acknowledgement (Ref Number & Stream)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#475569', cursor: 'pointer', paddingLeft: '1.5rem' }}>
                    <input
                      type="checkbox"
                      checked={settings.notifyOnStatusChange}
                      disabled={!settings.autoNotificationsEnabled}
                      onChange={(e) => setSettings({ ...settings, notifyOnStatusChange: e.target.checked })}
                    />
                    <span>Application Status Updates (Shortlisted, Approved)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#475569', cursor: 'pointer', paddingLeft: '1.5rem' }}>
                    <input
                      type="checkbox"
                      checked={settings.notifyOnCounselling}
                      disabled={!settings.autoNotificationsEnabled}
                      onChange={(e) => setSettings({ ...settings, notifyOnCounselling: e.target.checked })}
                    />
                    <span>Counselling Appointment Confirmations</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#475569', cursor: 'pointer', paddingLeft: '1.5rem' }}>
                    <input
                      type="checkbox"
                      checked={settings.notifyOnExam}
                      disabled={!settings.autoNotificationsEnabled}
                      onChange={(e) => setSettings({ ...settings, notifyOnExam: e.target.checked })}
                    />
                    <span>Examination Timetable & Hall Ticket Announcements</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-gold btn-md"
              style={{ minWidth: '180px' }}
            >
              {loading ? 'Saving Settings...' : 'Save WhatsApp Settings'}
            </button>
          </div>
        </form>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* TAB 2: Message Templates */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'templates' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--primary-900)', margin: 0 }}>
                Approved WhatsApp Message Templates
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Templates used for automated student acknowledgement, exam announcements, and click-to-chat prefilling.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenTemplateModal()}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} />
              <span>New Template</span>
            </button>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table" style={{ margin: 0, fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--primary-900)' }}>Template Name</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--primary-900)' }}>Category</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--primary-900)' }}>Language</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--primary-900)' }}>Status</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--primary-900)' }}>Body Preview</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--primary-900)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No templates configured yet.
                      </td>
                    </tr>
                  ) : (
                    templates.map((tpl) => (
                      <tr key={tpl.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--primary-900)' }}>
                          <code>{tpl.templateName}</code>
                          {tpl.headerText && (
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              Header: {tpl.headerText}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600',
                            backgroundColor: tpl.category === 'UTILITY' ? '#e0f2fe' : '#fef3c7',
                            color: tpl.category === 'UTILITY' ? '#0369a1' : '#b45309'
                          }}>
                            {tpl.category}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textTransform: 'uppercase', fontSize: '0.8rem', color: '#64748b' }}>
                          {tpl.language || 'en'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600',
                            backgroundColor: tpl.status === 'APPROVED' ? '#dcfce7' : '#f1f5f9',
                            color: tpl.status === 'APPROVED' ? '#15803d' : '#475569'
                          }}>
                            {tpl.status || 'APPROVED'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', maxWidth: '380px', color: '#334155', lineHeight: '1.4' }}>
                          {tpl.bodyText}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenTemplateModal(tpl)}
                              className="btn btn-outline-primary btn-sm"
                              style={{ padding: '4px 8px' }}
                              title="Edit Template"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTemplate(tpl.id)}
                              className="btn btn-outline-danger btn-sm"
                              style={{ padding: '4px 8px' }}
                              title="Delete Template"
                            >
                              <Trash2 size={14} />
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
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* TAB 3: Delivery Logs */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'logs' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--primary-900)', margin: 0 }}>
                WhatsApp Notification & Delivery Logs
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Real-time tracking of automated alerts, click-to-chat dispatches, delivery receipts, and errors.
              </p>
            </div>
            <button
              type="button"
              onClick={() => loadLogs(logsPage)}
              className="btn btn-outline-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={14} />
              <span>Refresh Logs</span>
            </button>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table" style={{ margin: 0, fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--primary-900)' }}>Date & Time</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--primary-900)' }}>Recipient</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--primary-900)' }}>Channel</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--primary-900)' }}>Status</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--primary-900)' }}>Template / Reference</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--primary-900)' }}>Meta Message ID</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No delivery logs recorded yet.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => {
                      const isSuccess = log.deliveryStatus === 'SENT' || log.deliveryStatus === 'DELIVERED' || log.deliveryStatus === 'READ';
                      const isFailed = log.deliveryStatus === 'FAILED';
                      return (
                        <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', color: '#64748b' }}>
                            {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Just now'}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: '600', color: 'var(--primary-900)' }}>
                              {log.recipientPhone}
                            </div>
                            {log.recipientName && (
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{log.recipientName}</div>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700',
                              backgroundColor: log.channel === 'CLOUD_API' ? '#e0f2fe' : '#fef3c7',
                              color: log.channel === 'CLOUD_API' ? '#0369a1' : '#b45309'
                            }}>
                              {log.channel}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: '4px',
                              padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700',
                              backgroundColor: isSuccess ? '#dcfce7' : isFailed ? '#fee2e2' : '#f1f5f9',
                              color: isSuccess ? '#15803d' : isFailed ? '#b91c1c' : '#475569'
                            }}>
                              {log.deliveryStatus}
                            </span>
                            {log.errorDetails && (
                              <div style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: '2px', maxWidth: '240px' }}>
                                {log.errorDetails}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {log.templateName && (
                              <div style={{ fontWeight: '600', color: '#1e293b' }}>{log.templateName}</div>
                            )}
                            {log.referenceId && (
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Ref: {log.referenceId} ({log.referenceType})</div>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>
                            {log.metaMessageId || '—'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalLogPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 16px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  disabled={logsPage <= 0}
                  onClick={() => setLogsPage(p => Math.max(0, p - 1))}
                  className="btn btn-outline-primary btn-sm"
                >
                  Previous
                </button>
                <span style={{ alignSelf: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Page {logsPage + 1} of {totalLogPages}
                </span>
                <button
                  type="button"
                  disabled={logsPage >= totalLogPages - 1}
                  onClick={() => setLogsPage(p => p + 1)}
                  className="btn btn-outline-primary btn-sm"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* TAB 4: User Consent & Opt-Ins */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'optins' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--primary-900)', margin: 0 }}>
                WhatsApp User Consent & Opt-In Register
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Compliance records ensuring messages are only dispatched to students who provided explicit consent.
              </p>
            </div>
            <button
              type="button"
              onClick={() => loadOptIns(optInsPage)}
              className="btn btn-outline-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={14} />
              <span>Refresh Opt-Ins</span>
            </button>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table" style={{ margin: 0, fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--primary-900)' }}>Phone Number</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--primary-900)' }}>Candidate Name</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--primary-900)' }}>Source</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--primary-900)' }}>Consent Status</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--primary-900)' }}>Opt-In Date</th>
                  </tr>
                </thead>
                <tbody>
                  {optIns.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No user consent records yet. Records are automatically registered when candidates submit admission forms.
                      </td>
                    </tr>
                  ) : (
                    optIns.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--primary-900)' }}>
                          {item.phoneNumber}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#1e293b' }}>
                          {item.studentName || '—'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', backgroundColor: '#f1f5f9', color: '#475569' }}>
                            {item.optInSource}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700',
                            backgroundColor: item.isOptedIn ? '#dcfce7' : '#fee2e2',
                            color: item.isOptedIn ? '#15803d' : '#b91c1c'
                          }}>
                            {item.isOptedIn ? 'OPTED IN' : 'OPTED OUT'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#64748b' }}>
                          {item.optInDate ? new Date(item.optInDate).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalOptInPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 16px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  disabled={optInsPage <= 0}
                  onClick={() => setOptInsPage(p => Math.max(0, p - 1))}
                  className="btn btn-outline-primary btn-sm"
                >
                  Previous
                </button>
                <span style={{ alignSelf: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Page {optInsPage + 1} of {totalOptInPages}
                </span>
                <button
                  type="button"
                  disabled={optInsPage >= totalOptInPages - 1}
                  onClick={() => setOptInsPage(p => p + 1)}
                  className="btn btn-outline-primary btn-sm"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* TAB 5: Test Messenger */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'testMessenger' && (
        <div style={{ maxWidth: '720px' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <div style={{ backgroundColor: '#25D366', color: '#fff', padding: '8px', borderRadius: '10px' }}>
                <Send size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0, color: 'var(--primary-900)' }}>
                  Test WhatsApp Messenger
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Send a live test message or template notification to verify Cloud API or preview click-to-chat.
                </p>
              </div>
            </div>

            <form onSubmit={handleSendTestMessage}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                  Recipient Mobile Number (e.g. 919876543210) *
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={testForm.recipientPhone}
                  onChange={(e) => setTestForm({ ...testForm, recipientPhone: e.target.value })}
                  placeholder="Include country code without '+'"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                  Recipient Name (Optional)
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={testForm.recipientName}
                  onChange={(e) => setTestForm({ ...testForm, recipientName: e.target.value })}
                  placeholder="e.g. Student / Parent Name"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                  Message Template (Optional)
                </label>
                <select
                  className="form-control"
                  value={testForm.templateName}
                  onChange={(e) => setTestForm({ ...testForm, templateName: e.target.value })}
                >
                  <option value="">-- None (Send Raw Text or Click-to-Chat) --</option>
                  {templates.map(t => (
                    <option key={t.id} value={t.templateName}>
                      {t.templateName} ({t.category})
                    </option>
                  ))}
                </select>
              </div>

              {testForm.templateName && (
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.5rem' }}>
                    Template Parameters
                  </label>
                  <div className="grid-3" style={{ gap: '0.75rem' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Param {{1}} (e.g. Student Name)"
                      value={testForm.p1}
                      onChange={(e) => setTestForm({ ...testForm, p1: e.target.value })}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Param {{2}} (e.g. Ref No)"
                      value={testForm.p2}
                      onChange={(e) => setTestForm({ ...testForm, p2: e.target.value })}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Param {{3}} (e.g. Stream / Date)"
                      value={testForm.p3}
                      onChange={(e) => setTestForm({ ...testForm, p3: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {!testForm.templateName && (
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                    Custom Message Text
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={testForm.customMessage}
                    onChange={(e) => setTestForm({ ...testForm, customMessage: e.target.value })}
                    placeholder="Hello! This is an official test notification from Master PU College WhatsApp verification desk."
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={testSending}
                className="btn btn-gold btn-md"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <WhatsAppIcon size={18} color="#ffffff" />
                <span>{testSending ? 'Dispatching Message...' : 'Send WhatsApp Message'}</span>
              </button>
            </form>

            {/* Test Result Display */}
            {testResult && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                borderRadius: '8px',
                border: `1px solid ${testResult.success ? '#86efac' : '#fca5a5'}`,
                backgroundColor: testResult.success ? '#f0fdf4' : '#fef2f2'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: testResult.success ? '#15803d' : '#991b1b', marginBottom: '0.5rem' }}>
                  {testResult.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{testResult.message}</span>
                </div>

                {testResult.data?.channel && (
                  <div style={{ fontSize: '0.82rem', color: '#334155', marginBottom: '0.5rem' }}>
                    <strong>Channel Used:</strong> <code>{testResult.data.channel}</code>
                    {testResult.data.messageId && (
                      <span> • <strong>Message ID:</strong> {testResult.data.messageId}</span>
                    )}
                  </div>
                )}

                {testResult.data?.clickToChatUrl && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <a
                      href={testResult.data.clickToChatUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <ExternalLink size={14} />
                      <span>Open Click-to-Chat Link ({testResult.data.clickToChatUrl})</span>
                    </a>
                  </div>
                )}

                {testResult.data?.error && (
                  <div style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: '0.5rem' }}>
                    Error Detail: {testResult.data.error}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* TEMPLATE CREATE / EDIT MODAL */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {isTemplateModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsTemplateModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, color: 'var(--primary-900)' }}>
                {editingTemplate ? 'Edit Message Template' : 'Create New Message Template'}
              </h3>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => setIsTemplateModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTemplate}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                  Template Identifier (Name) *
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={templateForm.templateName}
                  onChange={(e) => setTemplateForm({ ...templateForm, templateName: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })}
                  placeholder="e.g. admission_enquiry_ack"
                  required
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Use lowercase alphanumeric with underscores (must match Meta approved name if using Cloud API).
                </span>
              </div>

              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                    Category
                  </label>
                  <select
                    className="form-control"
                    value={templateForm.category}
                    onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                  >
                    <option value="UTILITY">UTILITY</option>
                    <option value="MARKETING">MARKETING</option>
                    <option value="GENERAL_ENQUIRY">GENERAL_ENQUIRY</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                    Language Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={templateForm.language}
                    onChange={(e) => setTemplateForm({ ...templateForm, language: e.target.value })}
                    placeholder="en"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                  Header Text (Optional)
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={templateForm.headerText}
                  onChange={(e) => setTemplateForm({ ...templateForm, headerText: e.target.value })}
                  placeholder="e.g. Master PU College Admissions"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                  Body Text (Use &#123;&#123;1&#125;&#125;, &#123;&#123;2&#125;&#125; for placeholders) *
                </label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={templateForm.bodyText}
                  onChange={(e) => setTemplateForm({ ...templateForm, bodyText: e.target.value })}
                  placeholder="Hello {{1}}, your enquiry reference is {{2}}..."
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                  Footer Text (Optional)
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={templateForm.footerText}
                  onChange={(e) => setTemplateForm({ ...templateForm, footerText: e.target.value })}
                  placeholder="e.g. Master PU College • Bengaluru"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="btn btn-outline-primary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold btn-sm"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppManagement;
