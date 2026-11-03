import React, { useState, useEffect } from 'react';
import { 
  UserCheck, Save, CheckCircle2, RefreshCw, Upload, Image as ImageIcon, 
  Sparkles, ExternalLink, ChevronRight, Eye, AlertCircle, Quote
} from 'lucide-react';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';

const DEFAULT_LEADERSHIP = {
  principal_badge_text: "PRINCIPAL'S DESK",
  principal_name: 'Dr. K. S. Venkatesh',
  principal_title_line: 'M.Sc., M.Phil., Ph.D. | Principal & Professor',
  principal_photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  principal_quote: 'The two years of Pre-University education are the most transformative phase in a student\'s academic journey. At {collegeShortName}, we mentor each student to realize their fullest latent capability, fostering scientific inquiry and disciplined character.',
  principal_cta_text: "Read Principal's Complete Message",
  principal_cta_link: '/about#principal-message',
  principal_accolade: 'Recipient of the State Best Teacher Accolade (2019)',
  principal_full_message: `Dear Students, Parents, and Well-Wishers,

Pre-University education is the critical watershed of higher secondary learning in India. The decisions made during these crucial two years define future trajectories in medicine, engineering, pure research, chartered accountancy, corporate finance, and administration.

At our institution, we have engineered an academic framework that balances state board requirements with rigorous competitive problem solving. Our faculty members are empathetic mentors who monitor every student's learning pace, identify individual strengths, and provide remedial handholding whenever required.

I warmly invite you to visit our campus, interact with our teaching staff, and experience the vibrant learning atmosphere.`,
  principal_desk_enabled: 'true'
};

const SAMPLE_AVATARS = [
  { label: 'Academic Leader 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { label: 'Academic Leader 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { label: 'Academic Leader 3', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
  { label: 'Academic Leader 4', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80' }
];

export const PrincipalDesk = () => {
  const { settings, refreshSettings, updateMultipleSettings, collegeShortName, collegeName } = useSettings();
  const [formData, setFormData] = useState(DEFAULT_LEADERSHIP);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Sync state from global settings or DB
  useEffect(() => {
    if (settings) {
      setFormData({
        principal_badge_text: settings.principal_badge_text || DEFAULT_LEADERSHIP.principal_badge_text,
        principal_name: settings.principal_name || DEFAULT_LEADERSHIP.principal_name,
        principal_title_line: settings.principal_title_line || DEFAULT_LEADERSHIP.principal_title_line,
        principal_photo_url: settings.principal_photo_url || DEFAULT_LEADERSHIP.principal_photo_url,
        principal_quote: settings.principal_quote || DEFAULT_LEADERSHIP.principal_quote,
        principal_cta_text: settings.principal_cta_text || DEFAULT_LEADERSHIP.principal_cta_text,
        principal_cta_link: settings.principal_cta_link || DEFAULT_LEADERSHIP.principal_cta_link,
        principal_accolade: settings.principal_accolade || DEFAULT_LEADERSHIP.principal_accolade,
        principal_full_message: settings.principal_full_message || DEFAULT_LEADERSHIP.principal_full_message,
        principal_desk_enabled: settings.principal_desk_enabled !== undefined ? String(settings.principal_desk_enabled) : 'true'
      });
    }
  }, [settings]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    setUploading(true);

    try {
      const res = await api.post('/admin/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.success && res.data?.url) {
        handleChange('principal_photo_url', res.data.url);
        setSaveMsg('Photo uploaded successfully! Remember to save changes.');
        setTimeout(() => setSaveMsg(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Image upload failed. Please verify image format and size.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await updateMultipleSettings(formData);
      await refreshSettings();
      setSaveMsg("Principal's Desk details updated successfully! Public website updated.");
      setTimeout(() => setSaveMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to update leadership settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset Principal's Desk panel to original demo content?")) {
      setFormData(DEFAULT_LEADERSHIP);
    }
  };

  // Compute live rendered preview quote text
  const previewQuote = (formData.principal_quote || '')
    .replace(/\{collegeShortName\}/g, collegeShortName || 'SVCPUC')
    .replace(/\{collegeName\}/g, collegeName || 'our institution');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <UserCheck size={26} color="var(--primary-700)" /> Principal's Desk & Leadership Panel
          </h1>
          <p className="admin-header-subtitle">
            Manage the Principal's badge, photo, name, credentials, quote snippet, and full public letter
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <a
            href="/#principal-desk"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ExternalLink size={14} /> View on Public Homepage
          </a>
        </div>
      </div>

      {/* Success Notification */}
      {saveMsg && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1.5px solid #10b981',
          color: '#065f46',
          padding: '0.9rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.92rem',
          fontWeight: '600',
          boxShadow: '0 2px 6px rgba(16, 185, 129, 0.15)'
        }}>
          <CheckCircle2 size={18} color="#059669" /> {saveMsg}
        </div>
      )}

      {/* Layout Grid: Left Form Controls, Right Live Card Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: EDIT FORM */}
        <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Quote size={20} color="var(--gold-500)" /> Edit Panel Content
          </h3>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Widget Visibility */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1rem',
              backgroundColor: formData.principal_desk_enabled === 'true' ? '#f0fdf4' : '#f8fafc',
              border: `1.5px solid ${formData.principal_desk_enabled === 'true' ? '#86efac' : '#cbd5e1'}`,
              borderRadius: '8px'
            }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--primary-950)' }}>Display Widget on Public Homepage</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>Show or hide the Principal's Desk card</p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.principal_desk_enabled === 'true'}
                  onChange={e => handleChange('principal_desk_enabled', e.target.checked ? 'true' : 'false')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary-700)', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: formData.principal_desk_enabled === 'true' ? '#15803d' : '#64748b' }}>
                  {formData.principal_desk_enabled === 'true' ? 'VISIBLE' : 'HIDDEN'}
                </span>
              </label>
            </div>

            {/* Principal Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.4rem' }}>
                Principal Full Name *
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.principal_name}
                onChange={e => handleChange('principal_name', e.target.value)}
                placeholder="e.g. Dr. K. S. Venkatesh"
                required
              />
            </div>

            {/* Badge Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.4rem' }}>
                Card Header Badge
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.principal_badge_text}
                onChange={e => handleChange('principal_badge_text', e.target.value)}
                placeholder="e.g. PRINCIPAL'S DESK"
              />
            </div>

            {/* Qualifications & Designation Line */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.4rem' }}>
                Degrees & Designation Line *
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.principal_title_line}
                onChange={e => handleChange('principal_title_line', e.target.value)}
                placeholder="e.g. M.Sc., M.Phil., Ph.D. | Principal & Professor"
                required
              />
            </div>

            {/* Principal Photo URL & Direct Upload */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.4rem' }}>
                Principal Photo URL
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="url"
                  className="input-field"
                  value={formData.principal_photo_url}
                  onChange={e => handleChange('principal_photo_url', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  style={{ flex: 1 }}
                />
                <label className="btn btn-outline-primary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload File'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    disabled={uploading}
                  />
                </label>
              </div>

              {/* Sample Avatar Presets */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Presets:</span>
                {SAMPLE_AVATARS.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChange('principal_photo_url', av.url)}
                    style={{
                      background: formData.principal_photo_url === av.url ? 'var(--primary-50)' : '#f8fafc',
                      border: formData.principal_photo_url === av.url ? '1.5px solid var(--primary-700)' : '1px solid var(--border-subtle)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <img src={av.url} alt="" style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover' }} />
                    {av.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Homepage Quote Snippet */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-900)' }}>
                  Homepage Quote Snippet *
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Use <code style={{ color: 'var(--primary-700)' }}>{`{collegeShortName}`}</code> for dynamic college name
                </span>
              </div>
              <textarea
                className="input-field"
                rows={4}
                value={formData.principal_quote}
                onChange={e => handleChange('principal_quote', e.target.value)}
                placeholder="The two years of Pre-University education are the most transformative phase..."
                required
                style={{ resize: 'vertical', lineHeight: '1.5' }}
              />
            </div>

            {/* CTA Link Text & Destination */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.4rem' }}>
                  Link Text
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.principal_cta_text}
                  onChange={e => handleChange('principal_cta_text', e.target.value)}
                  placeholder="Read Principal's Complete Message"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.4rem' }}>
                  Link Target URL
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.principal_cta_link}
                  onChange={e => handleChange('principal_cta_link', e.target.value)}
                  placeholder="/about#principal-message"
                />
              </div>
            </div>

            {/* Honorary Accolade / Recognition */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.4rem' }}>
                Honorary Accolade / Recognition (About Page)
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.principal_accolade}
                onChange={e => handleChange('principal_accolade', e.target.value)}
                placeholder="e.g. Recipient of the State Best Teacher Accolade (2019)"
              />
            </div>

            {/* Full Message on About Page */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.4rem' }}>
                Complete Leadership Letter (Shown on About Page)
              </label>
              <textarea
                className="input-field"
                rows={6}
                value={formData.principal_full_message}
                onChange={e => handleChange('principal_full_message', e.target.value)}
                placeholder="Dear Students, Parents, and Well-Wishers..."
                style={{ resize: 'vertical', lineHeight: '1.5' }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}
              >
                <Save size={18} />
                {saving ? 'Publishing Changes...' : 'Save & Publish Changes'}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={saving}
                className="btn btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <RefreshCw size={16} /> Reset
              </button>
            </div>

          </form>
        </div>

        {/* RIGHT COLUMN: LIVE REAL-TIME CARD PREVIEW */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '100px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="var(--gold-500)" /> Live Public Website Preview
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Renders exactly as seen by visitors
            </span>
          </div>

          {/* PREVIEW CONTAINER */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '2px dashed var(--gold-400)',
            borderRadius: '16px',
            padding: '2.5rem 1.75rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>

            {/* Principal Quote Card (Exact Replica) */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-subtle)',
              position: 'relative'
            }}>
              {/* Gold Top Badge */}
              <div style={{
                position: 'absolute',
                top: '-15px',
                right: '25px',
                backgroundColor: 'var(--gold-500)',
                color: 'var(--primary-950)',
                padding: '0.35rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: '800',
                letterSpacing: '0.05em',
                boxShadow: '0 2px 8px rgba(212, 175, 55, 0.4)'
              }}>
                {formData.principal_badge_text || "PRINCIPAL'S DESK"}
              </div>

              {/* Avatar & Name Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <img
                  src={formData.principal_photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={formData.principal_name || 'Principal'}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
                  }}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--gold-500)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
                  }}
                />
                <div>
                  <h4 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', margin: '0 0 0.2rem 0', fontWeight: '700' }}>
                    {formData.principal_name || 'Dr. K. S. Venkatesh'}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                    {formData.principal_title_line || 'M.Sc., M.Phil., Ph.D. | Principal & Professor'}
                  </p>
                </div>
              </div>

              {/* Quote */}
              <blockquote style={{
                fontStyle: 'italic',
                color: 'var(--text-muted)',
                lineHeight: '1.7',
                borderLeft: '3px solid var(--gold-500)',
                paddingLeft: '1rem',
                marginBottom: '1.5rem',
                fontSize: '0.94rem'
              }}>
                "{previewQuote}"
              </blockquote>

              {/* Read More Link */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-700)' }}>
                {formData.principal_cta_text || "Read Principal's Complete Message"} <ChevronRight size={14} />
              </div>
            </div>

            {formData.principal_desk_enabled === 'false' && (
              <div style={{
                marginTop: '1.25rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#991b1b',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={16} />
                Notice: This card is currently set to <strong>HIDDEN</strong> and will not appear on the public homepage until enabled.
              </div>
            )}

          </div>

          {/* Quick Helper Notes */}
          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--primary-900)', display: 'block', marginBottom: '0.4rem' }}>
              💡 System Highlights:
            </strong>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>Changes update both the homepage quote card and the About Us leadership section.</li>
              <li>Supports instant local image uploads or external high-resolution CDN images.</li>
              <li>All modifications are tracked in the immutable security audit logs.</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
