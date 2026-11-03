import React, { useState, useEffect } from 'react';
import {
  Bot, Settings, HelpCircle, MessageSquare, Sparkles, Send, Plus,
  Trash2, Edit, Check, AlertCircle, RefreshCw, ThumbsUp, ThumbsDown,
  Database, ShieldCheck, ToggleLeft, ToggleRight, ExternalLink, Activity
} from 'lucide-react';
import { chatbotService } from '../services/chatbotService';

export const ChatbotManagement = () => {
  const [activeTab, setActiveTab] = useState('simulator');
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Settings state
  const [settings, setSettings] = useState({
    enabled: true,
    name: 'MPUC Assistant',
    welcomeMessage: '',
    suggestedQuestions: [],
    aiProvider: '',
    openaiModel: '',
    hasApiKey: false,
    maxQueryLength: 500,
    rateLimitPerMinute: 20,
  });
  const [newQuestionInput, setNewQuestionInput] = useState('');

  // Stats state
  const [stats, setStats] = useState({
    totalQueries: 0,
    positiveFeedback: 0,
    negativeFeedback: 0,
    satisfactionRate: '100%',
    activeProvider: '',
    openaiModel: '',
  });

  // Logs state
  const [logs, setLogs] = useState([]);
  const [logsPage, setLogsPage] = useState(0);

  // FAQs state
  const [faqs, setFaqs] = useState([]);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({
    category: 'GENERAL',
    question: '',
    answer: '',
    keywords: '',
    suggestedLinks: '',
    priorityScore: 0,
    isPublished: true,
  });

  // Simulator state
  const [simQuery, setSimQuery] = useState('');
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState(null);

  // Load initial data
  useEffect(() => {
    loadSettings();
    loadStats();
    loadFaqs();
    loadLogs(0);
  }, []);

  const loadSettings = async () => {
    try {
      const data = await chatbotService.getAdminSettings();
      if (data) {
        setSettings({
          ...data,
          suggestedQuestions: data.suggestedQuestions || [],
        });
      }
    } catch (err) {
      console.error('Failed to load chatbot settings', err);
    }
  };

  const loadStats = async () => {
    try {
      const data = await chatbotService.getAdminStats();
      if (data) setStats(data);
    } catch (err) {
      console.error('Failed to load chatbot stats', err);
    }
  };

  const loadFaqs = async () => {
    try {
      const data = await chatbotService.getAdminFaqs();
      if (data) setFaqs(data);
    } catch (err) {
      console.error('Failed to load FAQs', err);
    }
  };

  const loadLogs = async (page = 0) => {
    try {
      const data = await chatbotService.getAdminLogs(page, 20);
      if (data) {
        setLogs(data.content || []);
        setLogsPage(page);
      }
    } catch (err) {
      console.error('Failed to load logs', err);
    }
  };

  // Handle Save Settings
  const handleSaveSettings = async () => {
    setLoading(true);
    setSaveSuccess('');
    setErrorMessage('');
    try {
      const updated = await chatbotService.updateAdminSettings(settings);
      setSettings(updated);
      setSaveSuccess('Chatbot settings successfully updated!');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  // Manage Suggested Questions
  const handleAddSuggestedQuestion = () => {
    const trimmed = newQuestionInput.trim();
    if (!trimmed) return;
    setSettings((prev) => ({
      ...prev,
      suggestedQuestions: [...prev.suggestedQuestions, trimmed],
    }));
    setNewQuestionInput('');
  };

  const handleRemoveSuggestedQuestion = (index) => {
    setSettings((prev) => ({
      ...prev,
      suggestedQuestions: prev.suggestedQuestions.filter((_, i) => i !== index),
    }));
  };

  // Handle FAQ CRUD
  const handleOpenFaqModal = (faq = null) => {
    if (faq) {
      setEditingFaq(faq);
      setFaqForm({
        id: faq.id,
        category: faq.category || 'GENERAL',
        question: faq.question || '',
        answer: faq.answer || '',
        keywords: faq.keywords || '',
        suggestedLinks: faq.suggestedLinks || '',
        priorityScore: faq.priorityScore || 0,
        isPublished: faq.isPublished !== undefined ? faq.isPublished : true,
      });
    } else {
      setEditingFaq(null);
      setFaqForm({
        category: 'GENERAL',
        question: '',
        answer: '',
        keywords: '',
        suggestedLinks: '',
        priorityScore: 0,
        isPublished: true,
      });
    }
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = async (e) => {
    e.preventDefault();
    try {
      await chatbotService.saveAdminFaq(faqForm);
      setIsFaqModalOpen(false);
      loadFaqs();
      setSaveSuccess('FAQ successfully saved to knowledge base!');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to save FAQ');
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ from the knowledge base?')) return;
    try {
      await chatbotService.deleteAdminFaq(id);
      loadFaqs();
    } catch (err) {
      alert(err.message || 'Failed to delete FAQ');
    }
  };

  // Handle Test Query Simulation
  const handleRunSimulation = async (e) => {
    e?.preventDefault();
    if (!simQuery.trim() || simLoading) return;
    setSimLoading(true);
    setSimResult(null);
    try {
      const res = await chatbotService.testQuery(simQuery.trim());
      setSimResult(res);
      // Reload stats & logs
      loadStats();
      loadLogs(0);
    } catch (err) {
      alert(err.message || 'Simulation failed.');
    } finally {
      setSimLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px', height: '42px',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            border: '1.5px solid var(--gold-500)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--gold-500)'
          }}>
            <Bot size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              AI Chatbot Management
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '2px 0 0 0' }}>
              Configure AI assistant parameters, ground knowledge in MySQL, manage FAQ entries, and test queries.
            </p>
          </div>
        </div>

        {/* Global Chatbot Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: '600',
            backgroundColor: settings.enabled ? '#ecfdf5' : '#fef2f2',
            color: settings.enabled ? '#065f46' : '#991b1b',
            border: `1px solid ${settings.enabled ? '#a7f3d0' : '#fecaca'}`,
          }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              backgroundColor: settings.enabled ? '#10b981' : '#ef4444'
            }} />
            {settings.enabled ? 'Chatbot Active on Website' : 'Chatbot Disabled'}
          </span>
        </div>
      </div>

      {/* Alerts */}
      {saveSuccess && (
        <div style={{
          backgroundColor: '#ecfdf5', border: '1px solid #10b981', color: '#065f46',
          padding: '10px 16px', borderRadius: '8px', marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem'
        }}>
          <Check size={18} /> {saveSuccess}
        </div>
      )}
      {errorMessage && (
        <div style={{
          backgroundColor: '#fef2f2', border: '1px solid #ef4444', color: '#991b1b',
          padding: '10px 16px', borderRadius: '8px', marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem'
        }}>
          <AlertCircle size={18} /> {errorMessage}
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0',
        marginBottom: '1.5rem', overflowX: 'auto'
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('simulator')}
          className={`btn-tab ${activeTab === 'simulator' ? 'active' : ''}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '10px 16px', fontSize: '0.88rem', fontWeight: '600',
            border: 'none', background: 'none', cursor: 'pointer',
            borderBottom: activeTab === 'simulator' ? '2.5px solid var(--primary-700)' : '2.5px solid transparent',
            color: activeTab === 'simulator' ? 'var(--primary-700)' : '#64748b'
          }}
        >
          <Sparkles size={16} /> Knowledge Simulator & Live Test
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`btn-tab ${activeTab === 'settings' ? 'active' : ''}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '10px 16px', fontSize: '0.88rem', fontWeight: '600',
            border: 'none', background: 'none', cursor: 'pointer',
            borderBottom: activeTab === 'settings' ? '2.5px solid var(--primary-700)' : '2.5px solid transparent',
            color: activeTab === 'settings' ? 'var(--primary-700)' : '#64748b'
          }}
        >
          <Settings size={16} /> Configuration & Suggestions
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('faqs')}
          className={`btn-tab ${activeTab === 'faqs' ? 'active' : ''}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '10px 16px', fontSize: '0.88rem', fontWeight: '600',
            border: 'none', background: 'none', cursor: 'pointer',
            borderBottom: activeTab === 'faqs' ? '2.5px solid var(--primary-700)' : '2.5px solid transparent',
            color: activeTab === 'faqs' ? 'var(--primary-700)' : '#64748b'
          }}
        >
          <HelpCircle size={16} /> Approved Knowledge FAQs ({faqs.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`btn-tab ${activeTab === 'logs' ? 'active' : ''}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '10px 16px', fontSize: '0.88rem', fontWeight: '600',
            border: 'none', background: 'none', cursor: 'pointer',
            borderBottom: activeTab === 'logs' ? '2.5px solid var(--primary-700)' : '2.5px solid transparent',
            color: activeTab === 'logs' ? 'var(--primary-700)' : '#64748b'
          }}
        >
          <Activity size={16} /> Analytics & Inquiries ({stats.totalQueries})
        </button>
      </div>

      {/* TAB 1: KNOWLEDGE SIMULATOR */}
      {activeTab === 'simulator' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
          {/* Main Simulator Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="var(--gold-500)" /> Interactive Knowledge Tester
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Test how the college AI engine interprets questions in English or Kannada and grounds its response using MySQL published courses, combinations, fees, facilities, and announcements.
            </p>

            {/* Quick Test Questions */}
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                Quick Test Prompts:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {[
                  'What Science combinations are available?',
                  'Can I join Commerce with Mathematics?',
                  'What documents do I need for admission?',
                  'Do you offer KCET and NEET coaching?',
                  'ಕಾಲೇಜಿನಲ್ಲಿ ಯಾವ ಸೈನ್ಸ್ ಕೋರ್ಸ್‌ಗಳು ಲಭ್ಯವಿವೆ?'
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => { setSimQuery(prompt); }}
                    style={{
                      fontSize: '0.76rem', padding: '4px 10px', borderRadius: '6px',
                      border: '1px solid #cbd5e1', backgroundColor: '#f8fafc',
                      cursor: 'pointer', color: '#1e293b'
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleRunSimulation} style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
              <input
                type="text"
                value={simQuery}
                onChange={(e) => setSimQuery(e.target.value)}
                placeholder="Ask any question (e.g. Science courses, fees, scholarships, library facilities)..."
                className="form-control"
                style={{ flex: 1, padding: '10px 14px', borderRadius: '8px' }}
                disabled={simLoading}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!simQuery.trim() || simLoading}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px' }}
              >
                {simLoading ? <RefreshCw size={16} className="spin" /> : <Send size={16} />}
                {simLoading ? 'Retrieving...' : 'Simulate Response'}
              </button>
            </form>

            {/* Simulation Results Display */}
            {simResult && (
              <div style={{
                backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px',
                padding: '1.25rem', marginTop: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: '700', padding: '3px 8px', borderRadius: '4px',
                    backgroundColor: '#e0f2fe', color: '#0369a1', display: 'inline-flex', alignItems: 'center', gap: '4px'
                  }}>
                    <Database size={12} /> Source: {simResult.source}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Logged (ID: #{simResult.logId})
                  </span>
                </div>

                <div style={{
                  fontSize: '0.9rem', color: '#1e293b', lineHeight: '1.6',
                  whiteSpace: 'pre-wrap', backgroundColor: '#ffffff',
                  padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0'
                }}>
                  {simResult.reply}
                </div>

                {simResult.links && simResult.links.length > 0 && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#475569' }}>
                      Associated Navigation Links:
                    </span>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                      {simResult.links.map((link, idx) => (
                        <span key={idx} style={{
                          fontSize: '0.74rem', backgroundColor: '#eff6ff', color: '#1d4ed8',
                          padding: '3px 8px', borderRadius: '4px', border: '1px solid #bfdbfe'
                        }}>
                          {link.title} ({link.url})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {simResult.suggestions && simResult.suggestions.length > 0 && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#475569' }}>
                      Generated Follow-up Suggestions:
                    </span>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                      {simResult.suggestions.map((s, idx) => (
                        <span key={idx} style={{
                          fontSize: '0.74rem', backgroundColor: '#fffbeb', color: '#92400e',
                          padding: '3px 8px', borderRadius: '4px', border: '1px solid #fde68a'
                        }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Engine & Safety Status Side Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={18} color="var(--primary-700)" /> AI Engine Status
              </h4>
              <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <div style={{ color: '#64748b' }}>Active Provider:</div>
                  <strong style={{ color: '#0f172a' }}>{stats.activeProvider || 'Grounded MySQL Knowledge Engine'}</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b' }}>OpenAI Model Configured:</div>
                  <strong style={{ color: '#0f172a' }}>{stats.openaiModel || 'gpt-4o-mini'}</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b' }}>Environment API Key:</div>
                  <span style={{
                    display: 'inline-block', padding: '2px 8px', borderRadius: '4px',
                    fontSize: '0.75rem', fontWeight: '600',
                    backgroundColor: settings.hasApiKey ? '#ecfdf5' : '#fef3c7',
                    color: settings.hasApiKey ? '#065f46' : '#92400e'
                  }}>
                    {settings.hasApiKey ? 'Configured & Active' : 'Fallback Grounded Engine Active'}
                  </span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />
                <div>
                  <div style={{ color: '#64748b' }}>Rate Limit per Client:</div>
                  <strong>{settings.rateLimitPerMinute} requests / min</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b' }}>Max Input Characters:</div>
                  <strong>{settings.maxQueryLength} chars</strong>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#166534', marginBottom: '0.5rem' }}>
                Grounded Knowledge Guarantee
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#15803d', lineHeight: '1.45', margin: 0 }}>
                The chatbot never hallucinates arbitrary fee figures or admissions approvals. All answers are strictly bound to official Karnataka PU Board combinations and verified college database records.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONFIGURATION & SUGGESTIONS */}
      {activeTab === 'settings' && (
        <div className="card" style={{ padding: '1.5rem', maxWidth: '850px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem' }}>
            Chatbot Widget Configuration
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Master Toggle */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0'
            }}>
              <div>
                <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>Enable Floating Chatbot on Website</strong>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  When enabled, visitors will see the interactive MPUC Assistant on all public pages.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
                style={{
                  border: 'none', background: 'none', cursor: 'pointer',
                  color: settings.enabled ? '#10b981' : '#94a3b8'
                }}
              >
                {settings.enabled ? <ToggleRight size={38} /> : <ToggleLeft size={38} />}
              </button>
            </div>

            {/* Assistant Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                Chatbot Display Name
              </label>
              <input
                type="text"
                className="form-control"
                value={settings.name || ''}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                placeholder="e.g. MPUC Assistant"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px' }}
              />
            </div>

            {/* Welcome Message */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                Greeting & Welcome Message
              </label>
              <textarea
                className="form-control"
                rows={3}
                value={settings.welcomeMessage || ''}
                onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                placeholder="Enter welcome message displayed when chat is first opened..."
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px' }}
              />
            </div>

            {/* Suggested Questions Manager */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                Suggested Quick Inquiries (Clickable Chips)
              </label>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 8px 0' }}>
                These questions are shown to visitors to facilitate quick one-click answers.
              </p>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter a new suggested question..."
                  value={newQuestionInput}
                  onChange={(e) => setNewQuestionInput(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '6px' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSuggestedQuestion();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddSuggestedQuestion}
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Plus size={16} /> Add Suggestion
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {settings.suggestedQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
                      borderRadius: '6px', fontSize: '0.85rem'
                    }}
                  >
                    <span>{idx + 1}. {q}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSuggestedQuestion(idx)}
                      style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                      title="Delete suggestion"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="btn btn-primary"
                disabled={loading}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 24px' }}
              >
                {loading ? <RefreshCw size={16} className="spin" /> : <Check size={16} />}
                {loading ? 'Saving...' : 'Save All Settings'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: APPROVED FAQ KNOWLEDGE BASE */}
      {activeTab === 'faqs' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                Approved FAQ Knowledge Base
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0 0' }}>
                These high-confidence responses take precedence in chatbot inquiries and ensure immediate, zero-latency answers.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleOpenFaqModal()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} /> Add Knowledge FAQ
            </button>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px' }}>Category</th>
                  <th style={{ padding: '12px 16px' }}>Question</th>
                  <th style={{ padding: '12px 16px' }}>Answer Preview</th>
                  <th style={{ padding: '12px 16px' }}>Keywords</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {faqs.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                      No FAQs found in knowledge base. Click "Add Knowledge FAQ" to create one.
                    </td>
                  </tr>
                ) : (
                  faqs.map((faq) => (
                    <tr key={faq.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px', borderRadius: '4px',
                          backgroundColor: '#f1f5f9', color: '#334155'
                        }}>
                          {faq.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: '600', color: '#0f172a', maxWidth: '240px' }}>
                        {faq.question}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#475569', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {faq.answer}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.78rem' }}>
                        {faq.keywords || '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: '0.72rem', fontWeight: '600', padding: '2px 8px', borderRadius: '4px',
                          backgroundColor: faq.isPublished ? '#ecfdf5' : '#fef2f2',
                          color: faq.isPublished ? '#065f46' : '#991b1b'
                        }}>
                          {faq.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenFaqModal(faq)}
                            style={{ border: 'none', background: 'none', color: '#2563eb', cursor: 'pointer' }}
                            title="Edit FAQ"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFaq(faq.id)}
                            style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                            title="Delete FAQ"
                          >
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
      )}

      {/* FAQ MODAL */}
      {isFaqModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999
        }}>
          <div className="card" style={{ width: '560px', maxWidth: '90vw', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>
              {editingFaq ? 'Edit Knowledge FAQ' : 'Add New Knowledge FAQ'}
            </h3>

            <form onSubmit={handleSaveFaq} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                  Category
                </label>
                <select
                  className="form-control"
                  value={faqForm.category}
                  onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px' }}
                >
                  <option value="GENERAL">General Information</option>
                  <option value="ADMISSIONS">Admissions</option>
                  <option value="COURSES">Courses & Combinations</option>
                  <option value="FEES">Fees & Scholarships</option>
                  <option value="FACILITIES">Campus Facilities</option>
                  <option value="EXAMINATIONS">Examinations & Calendar</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                  Question
                </label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="e.g. Which Science combinations are available?"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                  Grounded Answer
                </label>
                <textarea
                  required
                  rows={4}
                  className="form-control"
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  placeholder="Enter the official college answer..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                  Search Keywords (comma separated)
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={faqForm.keywords}
                  onChange={(e) => setFaqForm({ ...faqForm, keywords: e.target.value })}
                  placeholder="e.g. science, pcmb, pcmc, combinations, biology"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                  Associated Website Links (Format: Title|/url, Title2|/url2)
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={faqForm.suggestedLinks}
                  onChange={(e) => setFaqForm({ ...faqForm, suggestedLinks: e.target.value })}
                  placeholder="Academic Combinations|/academics, Campus Facilities|/facilities"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="faqPublishedCheck"
                  checked={faqForm.isPublished}
                  onChange={(e) => setFaqForm({ ...faqForm, isPublished: e.target.checked })}
                />
                <label htmlFor="faqPublishedCheck" style={{ fontSize: '0.85rem', color: '#334155', cursor: 'pointer' }}>
                  Publish immediately (Chatbot will use this response)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save Knowledge Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: CONVERSATION LOGS & ANALYTICS */}
      {activeTab === 'logs' && (
        <div>
          {/* Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
                Total Inquiries
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
                {stats.totalQueries}
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#16a34a', textTransform: 'uppercase' }}>
                Helpful Ratings (Thumbs Up)
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#16a34a', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <ThumbsUp size={20} /> {stats.positiveFeedback}
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#dc2626', textTransform: 'uppercase' }}>
                Unhelpful Ratings (Thumbs Down)
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#dc2626', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <ThumbsDown size={20} /> {stats.negativeFeedback}
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--gold-500)', textTransform: 'uppercase' }}>
                Satisfaction Rate
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--gold-500)', marginTop: '4px' }}>
                {stats.satisfactionRate}
              </div>
            </div>
          </div>

          {/* Logs Table */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              Recent Inquiries & Operational Logs
            </h3>
            <button
              type="button"
              onClick={() => { loadStats(); loadLogs(logsPage); }}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <RefreshCw size={14} /> Refresh Logs
            </button>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px' }}>Timestamp</th>
                  <th style={{ padding: '10px 14px' }}>Visitor Inquiry</th>
                  <th style={{ padding: '10px 14px' }}>AI Reply Preview</th>
                  <th style={{ padding: '10px 14px' }}>Knowledge Source</th>
                  <th style={{ padding: '10px 14px' }}>Latency</th>
                  <th style={{ padding: '10px 14px' }}>Visitor Feedback</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                      No inquiry logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 14px', whiteSpace: 'nowrap', color: '#64748b' }}>
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: '600', color: '#0f172a', maxWidth: '200px' }}>
                        {log.userMessage}
                      </td>
                      <td style={{ padding: '10px 14px', color: '#475569', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {log.botResponse}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{
                          fontSize: '0.7rem', fontWeight: '600', padding: '2px 6px', borderRadius: '4px',
                          backgroundColor: '#e0f2fe', color: '#0369a1'
                        }}>
                          {log.source}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', color: '#64748b' }}>
                        {log.responseTimeMs ? `${log.responseTimeMs}ms` : '—'}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        {log.userFeedback === 1 ? (
                          <span style={{ color: '#16a34a', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: '600' }}>
                            <ThumbsUp size={13} /> Helpful
                          </span>
                        ) : log.userFeedback === -1 ? (
                          <span style={{ color: '#dc2626', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: '600' }}>
                            <ThumbsDown size={13} /> Unhelpful
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>None</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotManagement;
