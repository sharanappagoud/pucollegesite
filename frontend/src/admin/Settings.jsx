import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, Save, CheckCircle2, GraduationCap, 
  ExternalLink, RefreshCw, Globe, Phone, Shield, Sparkles, Building2, MapPin, UserCheck
} from 'lucide-react';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { PrincipalDesk } from './PrincipalDesk';

export const Settings = () => {
  const { settings: globalSettings, refreshSettings, updateMultipleSettings } = useSettings();
  const [allSettings, setAllSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingBranding, setSavingBranding] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [activeTab, setActiveTab] = useState('branding');

  // Dedicated Navbar & Branding form state
  const [brandingForm, setBrandingForm] = useState({
    navbar_brand_name: '',
    navbar_brand_sub: '',
    navbar_brand_tagline: '',
    college_name: '',
    college_short_name: '',
    college_code: '',
  });

  // Load all settings from admin endpoint
  const fetchAdminSettings = () => {
    setLoading(true);
    api.get('/admin/settings')
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          setAllSettings(res.data);
          
          // Populate branding form from DB settings
          const map = {};
          res.data.forEach(s => { map[s.settingKey] = s.settingValue; });
          setBrandingForm({
            navbar_brand_name: map.navbar_brand_name || map.college_name || 'SRI VIDYODAYA',
            navbar_brand_sub: map.navbar_brand_sub || 'COMPOSITE PRE-UNIVERSITY COLLEGE',
            navbar_brand_tagline: map.navbar_brand_tagline || map.affiliation || 'Recognized by Dept. of PU Education, Govt. of Karnataka',
            college_name: map.college_name || 'Sri Vidyodaya Composite Pre-University College',
            college_short_name: map.college_short_name || 'SVCPUC',
            college_code: map.college_code || 'KA-PUC-0842',
          });
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdminSettings();
  }, []);

  const handleBrandingChange = (field, value) => {
    setBrandingForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveBranding = async (e) => {
    e.preventDefault();
    setSavingBranding(true);
    try {
      await updateMultipleSettings(brandingForm);
      setSaveMsg('Navbar College Name and Branding updated successfully! Visible on public site.');
      fetchAdminSettings();
      setTimeout(() => setSaveMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to update branding');
    } finally {
      setSavingBranding(false);
    }
  };

  const handleRawChange = (key, value) => {
    setAllSettings(prev => prev.map(s => s.settingKey === key ? { ...s, settingValue: value } : s));
  };

  const handleSaveOne = async (key, value) => {
    try {
      await api.post('/admin/settings', { key, value });
      await refreshSettings();
      setSaveMsg(`Updated '${key}' successfully!`);
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Update failed');
    }
  };

  const handleResetDemoBranding = () => {
    if (window.confirm('Reset Navbar College Name to default demo values?')) {
      setBrandingForm({
        navbar_brand_name: 'SRI VIDYODAYA',
        navbar_brand_sub: 'COMPOSITE PRE-UNIVERSITY COLLEGE',
        navbar_brand_tagline: 'Recognized by Dept. of PU Education, Govt. of Karnataka',
        college_name: 'Sri Vidyodaya Composite Pre-University College',
        college_short_name: 'SVCPUC',
        college_code: 'KA-PUC-0842',
      });
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <SettingsIcon size={26} color="var(--primary-700)" /> College Website Settings
          </h1>
          <p className="admin-header-subtitle">
            Configure navbar branding, institutional name, campus contacts, and system properties
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ExternalLink size={14} /> View Public Website
          </a>
        </div>
      </div>

      {/* Global Success Notification */}
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

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--border-subtle)', marginBottom: '1.75rem' }}>
        <button
          onClick={() => setActiveTab('branding')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'branding' ? '3px solid var(--primary-700)' : '3px solid transparent',
            color: activeTab === 'branding' ? 'var(--primary-900)' : 'var(--text-muted)',
            fontWeight: activeTab === 'branding' ? '700' : '600',
            cursor: 'pointer',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <GraduationCap size={18} color={activeTab === 'branding' ? 'var(--primary-700)' : 'inherit'} />
          Navbar & College Branding
        </button>

        <button
          onClick={() => setActiveTab('principal')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'principal' ? '3px solid var(--primary-700)' : '3px solid transparent',
            color: activeTab === 'principal' ? 'var(--primary-900)' : 'var(--text-muted)',
            fontWeight: activeTab === 'principal' ? '700' : '600',
            cursor: 'pointer',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <UserCheck size={18} color={activeTab === 'principal' ? 'var(--primary-700)' : 'inherit'} />
          Principal's Desk
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'contact' ? '3px solid var(--primary-700)' : '3px solid transparent',
            color: activeTab === 'contact' ? 'var(--primary-900)' : 'var(--text-muted)',
            fontWeight: activeTab === 'contact' ? '700' : '600',
            cursor: 'pointer',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Phone size={17} color={activeTab === 'contact' ? 'var(--primary-700)' : 'inherit'} />
          Contact & Address
        </button>

        <button
          onClick={() => setActiveTab('social')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'social' ? '3px solid var(--primary-700)' : '3px solid transparent',
            color: activeTab === 'social' ? 'var(--primary-900)' : 'var(--text-muted)',
            fontWeight: activeTab === 'social' ? '700' : '600',
            cursor: 'pointer',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Globe size={17} color={activeTab === 'social' ? 'var(--primary-700)' : 'inherit'} />
          Social Links
        </button>

        <button
          onClick={() => setActiveTab('all')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'all' ? '3px solid var(--primary-700)' : '3px solid transparent',
            color: activeTab === 'all' ? 'var(--primary-900)' : 'var(--text-muted)',
            fontWeight: activeTab === 'all' ? '700' : '600',
            cursor: 'pointer',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Shield size={17} color={activeTab === 'all' ? 'var(--primary-700)' : 'inherit'} />
          All Settings (Raw)
        </button>
      </div>

      {/* TAB 1: NAVBAR & BRANDING */}
      {activeTab === 'branding' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Live Preview Card */}
          <div className="card" style={{
            background: '#ffffff',
            border: '2px solid var(--gold-400)',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.12)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--gold-500)" />
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary-900)', margin: 0 }}>
                  Real-Time Public Navbar Preview
                </h3>
              </div>
              <span style={{ fontSize: '0.75rem', backgroundColor: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                LIVE PREVIEW
              </span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              This preview reflects exactly how visitors see your college name in the header navbar and branding blocks.
            </p>

            {/* Navbar Mockup Bar */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '0.85rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  background: 'linear-gradient(135deg, var(--primary-800) 0%, var(--primary-600) 100%)',
                  color: 'var(--gold-400)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(11, 37, 69, 0.2)',
                  border: '2px solid var(--gold-500)'
                }}>
                  <GraduationCap size={28} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1.18rem', fontWeight: '800', color: 'var(--primary-900)', letterSpacing: '-0.01em', lineHeight: '1.15' }}>
                    {brandingForm.navbar_brand_name || 'COLLEGE NAME'}
                  </span>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#133E87', letterSpacing: '0.04em' }}>
                    {brandingForm.navbar_brand_sub || 'COMPOSITE PRE-UNIVERSITY COLLEGE'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '500', letterSpacing: '0.02em' }}>
                    {brandingForm.navbar_brand_tagline || 'Recognized by Dept. of PU Education, Govt. of Karnataka'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', opacity: 0.6 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>Home</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Academics</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Admissions</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Contact</span>
              </div>
            </div>
          </div>

          {/* Edit Form Card */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
              Edit College Identity & Navbar Name
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
              Update the fields below to modify what is displayed in the navigation bar, footer, and page headings.
            </p>

            <form onSubmit={handleSaveBranding}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                
                {/* 1. Navbar Primary Brand Name */}
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.35rem' }}>
                    Navbar Primary College Name *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={brandingForm.navbar_brand_name}
                    onChange={(e) => handleBrandingChange('navbar_brand_name', e.target.value)}
                    placeholder="e.g., SRI VIDYODAYA"
                    required
                    style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--primary-900)' }}
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>
                    Rendered in large prominent letters on the first line of the navbar logo block.
                  </small>
                </div>

                {/* 2. Navbar Secondary Subtitle */}
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.35rem' }}>
                    Navbar Secondary Sub-Title *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={brandingForm.navbar_brand_sub}
                    onChange={(e) => handleBrandingChange('navbar_brand_sub', e.target.value)}
                    placeholder="e.g., COMPOSITE PRE-UNIVERSITY COLLEGE"
                    required
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>
                    Rendered in bold colored typography beneath the primary college name.
                  </small>
                </div>

                {/* 3. Navbar Board Tagline */}
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.35rem' }}>
                    Navbar Recognition / Board Tagline
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={brandingForm.navbar_brand_tagline}
                    onChange={(e) => handleBrandingChange('navbar_brand_tagline', e.target.value)}
                    placeholder="e.g., Recognized by Dept. of PU Education, Govt. of Karnataka"
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>
                    Fine text displayed at the bottom of the navbar logo block.
                  </small>
                </div>

                {/* 4. Full Official College Name */}
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.35rem' }}>
                    Official Full Institution Name *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={brandingForm.college_name}
                    onChange={(e) => handleBrandingChange('college_name', e.target.value)}
                    placeholder="e.g., Sri Vidyodaya Composite Pre-University College"
                    required
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>
                    Used on official footers, page titles, legal policy notices, and email headers.
                  </small>
                </div>

                {/* 5. Short Code / Acronym */}
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.35rem' }}>
                    College Short Name / Acronym
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={brandingForm.college_short_name}
                    onChange={(e) => handleBrandingChange('college_short_name', e.target.value)}
                    placeholder="e.g., SVCPUC"
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>
                    Used in admin portal sidebar, quick badges, and enquiry references.
                  </small>
                </div>

                {/* 6. Affiliation Code */}
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.35rem' }}>
                    PU Board Registration / Affiliation Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={brandingForm.college_code}
                    onChange={(e) => handleBrandingChange('college_code', e.target.value)}
                    placeholder="e.g., KA-PUC-0842"
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>
                    Displayed in the top contact bar and official verification badges.
                  </small>
                </div>

              </div>

              {/* Action Toolbar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={handleResetDemoBranding}
                  className="btn btn-outline-primary btn-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <RefreshCw size={14} /> Reset Form to Defaults
                </button>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="submit"
                    disabled={savingBranding}
                    className="btn btn-gold"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.75rem', fontWeight: '700' }}
                  >
                    <Save size={16} /> {savingBranding ? 'Saving Changes...' : 'Save & Publish Navbar College Name'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: CONTACT & ADDRESS */}
      {activeTab === 'contact' && (
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
            Campus Contact & Operating Details
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
            These details appear in the topbar, contact page, and footer across the public site.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {allSettings
              .filter(s => s.category === 'CONTACT' || ['phone_primary', 'phone_secondary', 'email_primary', 'email_admissions', 'campus_address', 'office_hours'].includes(s.settingKey))
              .map(s => (
                <div key={s.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ width: '220px', flexShrink: 0 }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-900)', display: 'block' }}>
                      {s.settingKey}
                    </label>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {s.description || s.category}
                    </span>
                  </div>

                  <div style={{ flexGrow: 1, minWidth: '280px' }}>
                    <input
                      type="text"
                      className="form-control"
                      value={s.settingValue || ''}
                      onChange={(e) => handleRawChange(s.settingKey, e.target.value)}
                    />
                  </div>

                  <button
                    onClick={() => handleSaveOne(s.settingKey, s.settingValue)}
                    className="btn btn-primary btn-sm"
                    style={{ flexShrink: 0 }}
                  >
                    <Save size={14} /> Update
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: SOCIAL MEDIA LINKS */}
      {activeTab === 'social' && (
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
            Official Social Media Handles
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
            Links displayed in the website footer and contact channels.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {allSettings
              .filter(s => s.category === 'SOCIAL' || s.settingKey.includes('url'))
              .map(s => (
                <div key={s.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ width: '220px', flexShrink: 0 }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-900)', display: 'block' }}>
                      {s.settingKey}
                    </label>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {s.description || s.category}
                    </span>
                  </div>

                  <div style={{ flexGrow: 1, minWidth: '280px' }}>
                    <input
                      type="text"
                      className="form-control"
                      value={s.settingValue || ''}
                      onChange={(e) => handleRawChange(s.settingKey, e.target.value)}
                    />
                  </div>

                  <button
                    onClick={() => handleSaveOne(s.settingKey, s.settingValue)}
                    className="btn btn-primary btn-sm"
                    style={{ flexShrink: 0 }}
                  >
                    <Save size={14} /> Update
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: ALL RAW SETTINGS */}
      {activeTab === 'all' && (
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
            All System Configuration Keys
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
            Direct low-level key-value management stored in the database.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {allSettings.map(s => (
              <div key={s.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', flexWrap: 'wrap' }}>
                <div style={{ width: '220px', flexShrink: 0 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-900)', display: 'block' }}>
                    {s.settingKey}
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    [{s.category}] {s.description}
                  </span>
                </div>

                <div style={{ flexGrow: 1, minWidth: '280px' }}>
                  <input
                    type="text"
                    className="form-control"
                    value={s.settingValue || ''}
                    onChange={(e) => handleRawChange(s.settingKey, e.target.value)}
                  />
                </div>

                <button
                  onClick={() => handleSaveOne(s.settingKey, s.settingValue)}
                  className="btn btn-primary btn-sm"
                  style={{ flexShrink: 0 }}
                >
                  <Save size={14} /> Update
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: PRINCIPAL'S DESK */}
      {activeTab === 'principal' && (
        <PrincipalDesk />
      )}

    </div>
  );
};
