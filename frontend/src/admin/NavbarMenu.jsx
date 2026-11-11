import React, { useState, useEffect } from 'react';
import { 
  Menu, CheckSquare, Square, Eye, EyeOff, Save, RotateCcw, 
  CheckCircle2, AlertCircle, ExternalLink, ChevronDown, 
  ChevronRight, Sparkles, SlidersHorizontal, ArrowRight,
  Search, BookmarkCheck
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import api from '../services/api';

const NAV_ITEMS_CONFIG = [
  {
    id: 'home',
    order: 1,
    defaultLabel: 'Home',
    path: '/',
    showKey: 'nav_show_home',
    labelKey: 'nav_label_home',
    description: 'Landing page with hero slider, announcements ticker, quick stats and intro.',
  },
  {
    id: 'about',
    order: 2,
    defaultLabel: 'About Us',
    path: '/about',
    showKey: 'nav_show_about',
    labelKey: 'nav_label_about',
    description: 'Institution history, vision & mission, leadership & principal desk message.',
    subItems: [
      { key: 'nav_show_about_history', label: 'College History & Overview', path: '/about#history' },
      { key: 'nav_show_about_vision', label: 'Vision & Mission', path: '/about#vision-mission' },
      { key: 'nav_show_about_principal', label: "Principal's Message", path: '/about#principal-message' },
      { key: 'nav_show_about_management', label: 'Board of Management', path: '/about#management' },
      { key: 'nav_show_about_student_life', label: 'Student Life', path: '/student-life' },
    ]
  },
  {
    id: 'academics',
    order: 3,
    defaultLabel: 'Academics',
    path: '/academics',
    showKey: 'nav_show_academics',
    labelKey: 'nav_label_academics',
    description: 'Science & Commerce streams, integrated entrance coaching (CET/NEET/JEE), calendar.',
    subItems: [
      { key: 'nav_show_academics_science', label: 'Science Stream (PCMB, PCMC)', path: '/academics?stream=SCIENCE' },
      { key: 'nav_show_academics_commerce', label: 'Commerce Stream (CEBA, MEBA)', path: '/academics?stream=COMMERCE' },
      { key: 'nav_show_academics_coaching', label: 'CET, NEET & JEE Coaching', path: '/academics#coaching' },
      { key: 'nav_show_academics_calendar', label: 'Academic Calendar', path: '/academics#calendar' },
    ]
  },
  {
    id: 'admissions',
    order: 4,
    defaultLabel: 'Admissions',
    path: '/admissions',
    showKey: 'nav_show_admissions',
    labelKey: 'nav_label_admissions',
    description: 'Eligibility criteria, fast-track enquiry form, status tracker & scholarships.',
    subItems: [
      { key: 'nav_show_admissions_guidelines', label: 'Admission Guidelines & Eligibility', path: '/admissions#guidelines' },
      { key: 'nav_show_admissions_enquiry', label: 'Online Admission Enquiry', path: '/admissions#enquiry-form' },
      { key: 'nav_show_admissions_track', label: 'Track Application Status', path: '/admissions#track' },
      { key: 'nav_show_admissions_scholarships', label: 'Scholarships & Fee Structure', path: '/admissions#scholarships' },
    ]
  },
  {
    id: 'examinations',
    order: 5,
    defaultLabel: 'Examinations',
    path: '/examinations',
    showKey: 'nav_show_examinations',
    labelKey: 'nav_label_examinations',
    description: 'PU Board & preparatory exam timetables, question banks and blueprints.',
  },
  {
    id: 'faculty',
    order: 6,
    defaultLabel: 'Faculty',
    path: '/faculty',
    showKey: 'nav_show_faculty',
    labelKey: 'nav_label_faculty',
    description: 'Profiles of lecturers, qualifications, experience, and department heads.',
  },
  {
    id: 'facilities',
    order: 7,
    defaultLabel: 'Facilities',
    path: '/facilities',
    showKey: 'nav_show_facilities',
    labelKey: 'nav_label_facilities',
    description: 'Science labs, library, computer center, sports facilities, auditorium.',
  },
  {
    id: 'gallery',
    order: 8,
    defaultLabel: 'Gallery',
    path: '/gallery',
    showKey: 'nav_show_gallery',
    labelKey: 'nav_label_gallery',
    description: 'Campus photo albums, cultural fest, sports day & student life pictures.',
  },
  {
    id: 'news',
    order: 9,
    defaultLabel: 'News & Events',
    path: '/news',
    showKey: 'nav_show_news',
    labelKey: 'nav_label_news',
    description: 'College announcements, press releases, seminars, and calendar activities.',
  },
  {
    id: 'contact',
    order: 10,
    defaultLabel: 'Contact',
    path: '/contact',
    showKey: 'nav_show_contact',
    labelKey: 'nav_label_contact',
    description: 'Campus address, phone lines, email desks, office timings, Google maps.',
  },
];

export const NavbarMenu = () => {
  const { settings: globalSettings, refreshSettings, updateMultipleSettings } = useSettings();
  const [formData, setFormData] = useState({});
  const [expandedSubmenu, setExpandedSubmenu] = useState({ about: false, academics: false, admissions: false });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveErr, setSaveErr] = useState('');

  // Initialize form state from globalSettings
  useEffect(() => {
    const initial = {};
    NAV_ITEMS_CONFIG.forEach(item => {
      // Visibility: default 'true' unless explicitly 'false'
      const showVal = globalSettings[item.showKey];
      initial[item.showKey] = showVal === 'false' ? 'false' : 'true';
      // Custom Label
      initial[item.labelKey] = globalSettings[item.labelKey] || item.defaultLabel;

      // Sub-items
      if (item.subItems) {
        item.subItems.forEach(sub => {
          const subShow = globalSettings[sub.key];
          initial[sub.key] = subShow === 'false' ? 'false' : 'true';
        });
      }
    });

    // Action buttons
    initial['nav_show_apply_btn'] = globalSettings['nav_show_apply_btn'] === 'false' ? 'false' : 'true';
    initial['nav_label_apply_btn'] = globalSettings['nav_label_apply_btn'] || 'Apply Now';
    initial['nav_show_search_btn'] = globalSettings['nav_show_search_btn'] === 'false' ? 'false' : 'true';

    setFormData(initial);
  }, [globalSettings]);

  // Toggle visibility checkbox
  const handleToggle = (key) => {
    setFormData(prev => ({
      ...prev,
      [key]: prev[key] === 'false' ? 'true' : 'false',
    }));
  };

  // Change label text
  const handleLabelChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Enable all menu items
  const handleEnableAll = () => {
    const updated = { ...formData };
    NAV_ITEMS_CONFIG.forEach(item => {
      updated[item.showKey] = 'true';
      if (item.subItems) {
        item.subItems.forEach(sub => {
          updated[sub.key] = 'true';
        });
      }
    });
    updated['nav_show_apply_btn'] = 'true';
    updated['nav_show_search_btn'] = 'true';
    setFormData(updated);
  };

  // Reset to default values
  const handleResetDefaults = () => {
    if (window.confirm('Reset all navbar links and labels to system defaults?')) {
      const def = {};
      NAV_ITEMS_CONFIG.forEach(item => {
        def[item.showKey] = 'true';
        def[item.labelKey] = item.defaultLabel;
        if (item.subItems) {
          item.subItems.forEach(sub => {
            def[sub.key] = 'true';
          });
        }
      });
      def['nav_show_apply_btn'] = 'true';
      def['nav_label_apply_btn'] = 'Apply Now';
      def['nav_show_search_btn'] = 'true';
      setFormData(def);
    }
  };

  // Save changes to backend
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    setSaveErr('');
    try {
      await updateMultipleSettings(formData);
      setSaveMsg('Navbar Navigation Menu settings saved successfully! Public navbar is now updated.');
      await refreshSettings();
      setTimeout(() => setSaveMsg(''), 5000);
    } catch (err) {
      console.error('Failed to save navbar settings:', err);
      setSaveErr(err.message || 'Failed to save navbar menu settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleSubmenuExpand = (id) => {
    setExpandedSubmenu(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Compute active count
  const activeCount = NAV_ITEMS_CONFIG.filter(item => formData[item.showKey] !== 'false').length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0B2545 0%, #133E68 100%)',
        color: '#ffffff',
        padding: '2rem 2.25rem',
        borderRadius: '16px',
        marginBottom: '2rem',
        boxShadow: '0 10px 30px rgba(11, 37, 69, 0.15)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212, 175, 55, 0.2)', padding: '0.35rem 0.85rem', borderRadius: '50px', border: '1px solid rgba(212, 175, 55, 0.4)', color: '#FFD700', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Sparkles size={14} /> Dynamic Navbar CMS
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 0.5rem 0', color: '#ffffff' }}>
            Navbar Navigation Menu & Links
          </h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: '0.95rem', maxWidth: '650px', lineHeight: 1.5 }}>
            Manage which navigation items appear on the public website header and mobile drawer. Check or uncheck to instantly show or hide any menu item, or edit its display label.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleEnableAll}
            className="btn btn-outline"
            style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)' }}
          >
            <CheckSquare size={16} /> Enable All
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="btn btn-outline"
            style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)' }}
          >
            <RotateCcw size={16} /> Defaults
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn btn-gold"
            style={{ fontWeight: '700', minWidth: '150px' }}
          >
            {saving ? (
              <>Saving Changes...</>
            ) : (
              <><Save size={16} /> Save Navbar Menu</>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveMsg && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1.5px solid #10b981',
          color: '#065f46',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
        }}>
          <CheckCircle2 size={22} color="#10b981" />
          <span>{saveMsg}</span>
        </div>
      )}

      {saveErr && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1.5px solid #ef4444',
          color: '#991b1b',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          fontWeight: '600'
        }}>
          <AlertCircle size={22} color="#ef4444" />
          <span>{saveErr}</span>
        </div>
      )}

      {/* Live Navbar Preview Card */}
      <div className="card" style={{
        background: '#ffffff',
        border: '2px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Eye size={18} color="var(--primary-700)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                Live Navbar Visual Preview
              </h3>
            </div>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Real-time representation of how the public navigation bar will appear to visitors.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              fontSize: '0.82rem',
              fontWeight: '700',
              padding: '0.35rem 0.85rem',
              borderRadius: '50px',
              backgroundColor: activeCount === NAV_ITEMS_CONFIG.length ? '#ecfdf5' : '#eff6ff',
              color: activeCount === NAV_ITEMS_CONFIG.length ? '#059669' : '#2563eb',
              border: `1px solid ${activeCount === NAV_ITEMS_CONFIG.length ? '#a7f3d0' : '#bfdbfe'}`
            }}>
              {activeCount} of {NAV_ITEMS_CONFIG.length} Menu Items Active
            </span>
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem' }}
            >
              Open Site <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Mock Desktop Navbar Bar */}
        <div style={{
          backgroundColor: '#0B2545',
          borderRadius: '12px',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflowX: 'auto',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
        }}>
          {/* Logo preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: '160px', paddingRight: '1rem', borderRight: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(212,175,55,0.2)', border: '1px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', fontSize: '0.75rem', fontWeight: '800' }}>
              SV
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: '800', fontSize: '0.75rem', letterSpacing: '0.04em' }}>SRI VIDYODAYA</div>
              <div style={{ color: '#D4AF37', fontSize: '0.58rem', fontWeight: '600' }}>PU COLLEGE</div>
            </div>
          </div>

          {/* Nav Links Preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0 1rem', flex: 1, overflowX: 'auto' }}>
            {NAV_ITEMS_CONFIG.map((item) => {
              const isVisible = formData[item.showKey] !== 'false';
              const label = formData[item.labelKey] || item.defaultLabel;

              return (
                <div
                  key={item.id}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    backgroundColor: isVisible ? 'rgba(255,255,255,0.12)' : 'rgba(239, 68, 68, 0.1)',
                    color: isVisible ? '#ffffff' : '#f87171',
                    border: `1px solid ${isVisible ? 'rgba(255,255,255,0.2)' : 'rgba(239, 68, 68, 0.3)'}`,
                    textDecoration: isVisible ? 'none' : 'line-through',
                    opacity: isVisible ? 1 : 0.6,
                    transition: 'all 0.15s ease'
                  }}
                  title={isVisible ? `Active: ${label}` : `Hidden: ${label} (Unchecked)`}
                >
                  {label}
                  {item.subItems && isVisible && (
                    <ChevronDown size={12} style={{ opacity: 0.7 }} />
                  )}
                  {!isVisible && (
                    <EyeOff size={12} color="#f87171" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Action buttons preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '180px', justifyContent: 'flex-end', paddingLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.15)' }}>
            {formData['nav_show_search_btn'] !== 'false' && (
              <div style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Search size={12} /> Search
              </div>
            )}
            {formData['nav_show_apply_btn'] !== 'false' && (
              <div style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', backgroundColor: '#D4AF37', color: '#0B2545', fontSize: '0.75rem', fontWeight: '700' }}>
                {formData['nav_label_apply_btn'] || 'Apply Now'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Form: List of 10 Navbar Menu Items */}
      <div className="card" style={{
        background: '#ffffff',
        border: '1.5px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
      }}>
        <div style={{ borderBottom: '1.5px solid #e2e8f0', paddingBottom: '1.25rem', marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: '0 0 0.35rem 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <SlidersHorizontal size={20} color="var(--primary-700)" />
              Navigation Items Checklist & Visibility Controls
            </h2>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Check the ON/OFF box to show or hide any menu link. You can also customize the text label displayed on the site.
            </p>
          </div>
        </div>

        {/* List of 10 Navbar Menu Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {NAV_ITEMS_CONFIG.map((item) => {
            const isVisible = formData[item.showKey] !== 'false';
            const labelValue = formData[item.labelKey] !== undefined ? formData[item.labelKey] : item.defaultLabel;
            const hasSub = Array.isArray(item.subItems) && item.subItems.length > 0;
            const isExpanded = expandedSubmenu[item.id] || false;

            return (
              <div 
                key={item.id}
                style={{
                  border: isVisible ? '1.5px solid #cbd5e1' : '1.5px dashed #fca5a5',
                  borderRadius: '12px',
                  backgroundColor: isVisible ? '#ffffff' : '#fef2f2',
                  transition: 'all 0.2s ease',
                  overflow: 'hidden',
                  boxShadow: isVisible ? '0 2px 6px rgba(0,0,0,0.02)' : 'none'
                }}
              >
                {/* Main Row */}
                <div style={{
                  padding: '1.15rem 1.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  flexWrap: 'wrap',
                  backgroundColor: isVisible ? '#ffffff' : '#fff5f5'
                }}>
                  {/* Left: Checkbox & Order & Identification */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '260px', flex: '1 1 300px' }}>
                    {/* On/Off Checkbox Switch */}
                    <label 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.6rem', 
                        cursor: 'pointer',
                        userSelect: 'none',
                        margin: 0
                      }}
                      title={isVisible ? 'Click to HIDE from Navbar' : 'Click to SHOW on Navbar'}
                    >
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={() => handleToggle(item.showKey)}
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          accentColor: 'var(--primary-700)'
                        }}
                      />
                      <span style={{
                        fontWeight: '700',
                        fontSize: '0.88rem',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        backgroundColor: isVisible ? '#ecfdf5' : '#fee2e2',
                        color: isVisible ? '#047857' : '#b91c1c',
                        border: `1px solid ${isVisible ? '#a7f3d0' : '#fecaca'}`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}>
                        {isVisible ? <CheckCircle2 size={13} /> : <EyeOff size={13} />}
                        {isVisible ? 'ON (Visible)' : 'OFF (Hidden)'}
                      </span>
                    </label>

                    {/* Order Badge */}
                    <span style={{
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #e2e8f0'
                    }}>
                      #{item.order}
                    </span>

                    {/* Path & Description */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ fontWeight: '700', fontSize: '1rem', color: isVisible ? 'var(--text-main)' : '#991b1b' }}>
                          {item.defaultLabel}
                        </span>
                        <code style={{ fontSize: '0.75rem', backgroundColor: '#f8fafc', padding: '0.15rem 0.4rem', borderRadius: '4px', color: '#64748b' }}>
                          {item.path}
                        </code>
                      </div>
                      <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Custom Label Input & Submenu trigger */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 340px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 200px', maxWidth: '320px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        Menu Label:
                      </span>
                      <input
                        type="text"
                        value={labelValue}
                        onChange={(e) => handleLabelChange(item.labelKey, e.target.value)}
                        placeholder={item.defaultLabel}
                        className="form-control"
                        disabled={!isVisible}
                        style={{
                          padding: '0.45rem 0.75rem',
                          fontSize: '0.9rem',
                          borderRadius: '8px',
                          border: '1.5px solid #cbd5e1',
                          backgroundColor: isVisible ? '#ffffff' : '#f1f5f9'
                        }}
                      />
                    </div>

                    {/* Submenu toggle button if available */}
                    {hasSub && (
                      <button
                        type="button"
                        onClick={() => toggleSubmenuExpand(item.id)}
                        className="btn btn-outline btn-sm"
                        style={{
                          fontSize: '0.8rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.4rem 0.75rem',
                          borderColor: isExpanded ? 'var(--primary-600)' : '#cbd5e1',
                          color: isExpanded ? 'var(--primary-700)' : 'var(--text-main)',
                          backgroundColor: isExpanded ? '#eff6ff' : '#ffffff'
                        }}
                      >
                        Sub-links ({item.subItems.length})
                        <ChevronDown size={14} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Submenu Items Dropdown Configuration */}
                {hasSub && isExpanded && (
                  <div style={{
                    backgroundColor: '#f8fafc',
                    borderTop: '1px solid #e2e8f0',
                    padding: '1.25rem 1.5rem',
                  }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <BookmarkCheck size={14} color="var(--primary-700)" />
                      Dropdown Sub-Menu Links for "{item.defaultLabel}":
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                      {item.subItems.map((sub) => {
                        const isSubVisible = formData[sub.key] !== 'false';
                        return (
                          <label
                            key={sub.key}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.6rem',
                              padding: '0.65rem 0.85rem',
                              backgroundColor: '#ffffff',
                              borderRadius: '8px',
                              border: isSubVisible ? '1px solid #cbd5e1' : '1px dashed #fca5a5',
                              cursor: 'pointer',
                              margin: 0
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isSubVisible}
                              onChange={() => handleToggle(sub.key)}
                              style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--primary-700)' }}
                            />
                            <div style={{ flex: 1 }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: isSubVisible ? '600' : '400', color: isSubVisible ? 'var(--text-main)' : '#991b1b', textDecoration: isSubVisible ? 'none' : 'line-through' }}>
                                {sub.label}
                              </span>
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                {sub.path}
                              </div>
                            </div>
                            <span style={{
                              fontSize: '0.7rem',
                              fontWeight: '700',
                              color: isSubVisible ? '#059669' : '#dc2626'
                            }}>
                              {isSubVisible ? 'ON' : 'OFF'}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Header Controls: Search & Apply Button */}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.75rem', borderTop: '2px dashed #e2e8f0' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0 0 1rem 0', color: 'var(--text-main)' }}>
            Header Utility Buttons & Actions
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {/* Search Bar Button */}
            <div style={{
              border: formData['nav_show_search_btn'] !== 'false' ? '1.5px solid #cbd5e1' : '1.5px dashed #fca5a5',
              borderRadius: '12px',
              padding: '1.25rem',
              backgroundColor: formData['nav_show_search_btn'] !== 'false' ? '#ffffff' : '#fef2f2'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={formData['nav_show_search_btn'] !== 'false'}
                    onChange={() => handleToggle('nav_show_search_btn')}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary-700)', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                    Sitewide Search Button (⌘K)
                  </span>
                </label>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  backgroundColor: formData['nav_show_search_btn'] !== 'false' ? '#ecfdf5' : '#fee2e2',
                  color: formData['nav_show_search_btn'] !== 'false' ? '#047857' : '#b91c1c'
                }}>
                  {formData['nav_show_search_btn'] !== 'false' ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Displays the fast universal search launcher in the desktop header and mobile drawer.
              </p>
            </div>

            {/* Apply Now CTA Button */}
            <div style={{
              border: formData['nav_show_apply_btn'] !== 'false' ? '1.5px solid #cbd5e1' : '1.5px dashed #fca5a5',
              borderRadius: '12px',
              padding: '1.25rem',
              backgroundColor: formData['nav_show_apply_btn'] !== 'false' ? '#ffffff' : '#fef2f2'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={formData['nav_show_apply_btn'] !== 'false'}
                    onChange={() => handleToggle('nav_show_apply_btn')}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary-700)', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                    "Apply Now" Gold CTA Button
                  </span>
                </label>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  backgroundColor: formData['nav_show_apply_btn'] !== 'false' ? '#ecfdf5' : '#fee2e2',
                  color: formData['nav_show_apply_btn'] !== 'false' ? '#047857' : '#b91c1c'
                }}>
                  {formData['nav_show_apply_btn'] !== 'false' ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  Button Label:
                </span>
                <input
                  type="text"
                  value={formData['nav_label_apply_btn'] || 'Apply Now'}
                  onChange={(e) => handleLabelChange('nav_label_apply_btn', e.target.value)}
                  className="form-control"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Floating/Sticky Save Action Bar */}
        <div style={{
          marginTop: '2.5rem',
          padding: '1.25rem 1.5rem',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1.5px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-main)' }}>
              Ready to apply changes?
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Saved settings immediately reflect across all desktop and mobile navigation menus.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="btn btn-outline"
            >
              <RotateCcw size={16} /> Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary"
              style={{ fontWeight: '700', minWidth: '180px' }}
            >
              {saving ? 'Saving...' : <><Save size={16} /> Save Navbar Menu</>}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
