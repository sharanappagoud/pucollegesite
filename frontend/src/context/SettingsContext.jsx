import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const defaultSettings = {
  college_name: 'Sri Vidyodaya Composite Pre-University College',
  college_short_name: 'SVCPUC',
  college_tagline: 'Excellence in Pre-University Education & Holistic Development',
  college_code: 'KA-PUC-0842',
  affiliation: 'Recognized by Department of Pre-University Education, Govt. of Karnataka',
  navbar_brand_name: 'SRI VIDYODAYA',
  navbar_brand_sub: 'COMPOSITE PRE-UNIVERSITY COLLEGE',
  navbar_brand_tagline: 'Recognized by Dept. of PU Education, Govt. of Karnataka',
  phone_primary: '+91 80 2345 6789',
  phone_secondary: '+91 80 2345 6790',
  email_primary: 'info@svcpuc.edu.in',
  email_admissions: 'admissions@svcpuc.edu.in',
  campus_address: '#45, Vidya Soudha Campus, 18th Cross, Malleshwaram, Bengaluru, Karnataka - 560003',
  office_hours: 'Monday - Friday: 8:30 AM - 4:30 PM | Saturday: 8:30 AM - 1:30 PM',
  google_maps_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.6534578964344!2d77.5684!3d13.0033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDAwJzExLjkiTiA3N8KwMzQnMDYuMiJF!5e0!3m2!1sen!2sin!4v1620000000000',
  facebook_url: 'https://facebook.com/svcpuc',
  instagram_url: 'https://instagram.com/svcpuc_official',
  youtube_url: 'https://youtube.com/@svcpuc_bengaluru',
  linkedin_url: 'https://linkedin.com/school/svcpuc',
  // Leadership & Principal's Desk
  principal_badge_text: "PRINCIPAL'S DESK",
  principal_name: 'Dr. K. S. Venkatesh',
  principal_title_line: 'M.Sc., M.Phil., Ph.D. | Principal & Professor',
  principal_photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  principal_quote: 'The two years of Pre-University education are the most transformative phase in a student\'s academic journey. At Sri Vidyodaya PU College, we mentor each student to realize their fullest latent capability, fostering scientific inquiry and disciplined character.',
  principal_cta_text: 'Read Principal\'s Complete Message',
  principal_cta_link: '/about#principal-message',
  principal_accolade: 'Recipient of the State Best Teacher Accolade (2019)',
  principal_full_message: 'Dear Students, Parents, and Well-Wishers,\n\nPre-University education is the critical watershed of higher secondary learning in India. The decisions made during these crucial two years define future trajectories in medicine, engineering, pure research, chartered accountancy, corporate finance, and administration.\n\nAt our institution, we have engineered an academic framework that balances state board requirements with rigorous competitive problem solving. Our faculty members are empathetic mentors who monitor every student\'s learning pace, identify individual strengths, and provide remedial handholding whenever required.\n\nI warmly invite you to visit our campus, interact with our teaching staff, and experience the vibrant learning atmosphere.',
  principal_desk_enabled: 'true',
  // Dynamic Navbar Items Configuration (Admin ON/OFF toggles & custom labels)
  nav_show_home: 'true',
  nav_label_home: 'Home',
  nav_show_about: 'true',
  nav_label_about: 'About Us',
  nav_show_about_history: 'true',
  nav_show_about_vision: 'true',
  nav_show_about_principal: 'true',
  nav_show_about_management: 'true',
  nav_show_about_student_life: 'true',
  nav_show_academics: 'true',
  nav_label_academics: 'Academics',
  nav_show_academics_science: 'true',
  nav_show_academics_commerce: 'true',
  nav_show_academics_coaching: 'true',
  nav_show_academics_calendar: 'true',
  nav_show_admissions: 'true',
  nav_label_admissions: 'Admissions',
  nav_show_admissions_guidelines: 'true',
  nav_show_admissions_enquiry: 'true',
  nav_show_admissions_track: 'true',
  nav_show_admissions_scholarships: 'true',
  nav_show_examinations: 'true',
  nav_label_examinations: 'Examinations',
  nav_show_faculty: 'true',
  nav_label_faculty: 'Faculty',
  nav_show_facilities: 'true',
  nav_label_facilities: 'Facilities',
  nav_show_gallery: 'true',
  nav_label_gallery: 'Gallery',
  nav_show_news: 'true',
  nav_label_news: 'News & Events',
  nav_show_contact: 'true',
  nav_label_contact: 'Contact',
  nav_show_apply_btn: 'true',
  nav_label_apply_btn: 'Apply Now',
  nav_show_search_btn: 'true',
};

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    try {
      const res = await api.get('/settings');
      if (res.success && res.data) {
        setSettings(prev => ({
          ...prev,
          ...res.data,
        }));
      }
    } catch (err) {
      console.warn('Failed to load dynamic college settings, using current state:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  // Update a single setting in backend and refresh state
  const updateSetting = async (key, value) => {
    await api.post('/admin/settings', { key, value });
    setSettings(prev => ({ ...prev, [key]: value }));
    await refreshSettings();
  };

  // Update multiple settings at once (e.g., from Navbar branding editor)
  const updateMultipleSettings = async (settingsMap) => {
    try {
      await api.post('/admin/settings/batch', settingsMap);
    } catch {
      for (const [key, value] of Object.entries(settingsMap)) {
        await api.post('/admin/settings', { key, value });
      }
    }
    setSettings(prev => ({ ...prev, ...settingsMap }));
    await refreshSettings();
  };

  const collegeName = settings.college_name || 'Sri Vidyodaya Composite Pre-University College';
  const collegeShortName = settings.college_short_name || 'SVCPUC';

  const getNavbarBrandName = () => {
    if (settings.navbar_brand_name && settings.navbar_brand_name.trim() !== '') {
      return settings.navbar_brand_name.trim();
    }
    if (settings.college_short_name && settings.college_short_name.trim() !== '') {
      return settings.college_short_name.trim().toUpperCase();
    }
    if (settings.college_name && settings.college_name.trim() !== '') {
      return settings.college_name.trim();
    }
    return 'SRI VIDYODAYA';
  };

  const getNavbarBrandSub = () => {
    if (settings.navbar_brand_sub && settings.navbar_brand_sub.trim() !== '') {
      return settings.navbar_brand_sub.trim();
    }
    return 'COMPOSITE PRE-UNIVERSITY COLLEGE';
  };

  const navbarBrandName = getNavbarBrandName();
  const navbarBrandSub = getNavbarBrandSub();
  const navbarBrandTagline = settings.navbar_brand_tagline || settings.affiliation || 'Recognized by Dept. of PU Education, Govt. of Karnataka';

  // Navigation menu visibility check (defaults to true if unset or not 'false')
  const isNavVisible = useCallback((key) => {
    const val = settings[key];
    if (val === undefined || val === null || val === '') return true;
    return val === 'true' || val === true;
  }, [settings]);

  // Navigation menu custom display label helper
  const getNavLabel = useCallback((key, fallback) => {
    const val = settings[key];
    if (val !== undefined && val !== null && String(val).trim() !== '') {
      return String(val).trim();
    }
    return fallback;
  }, [settings]);

  // Keep HTML document title in sync with college name
  useEffect(() => {
    if (collegeName) {
      document.title = `${collegeName} | Bengaluru`;
    }
  }, [collegeName]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings,
        updateSetting,
        updateMultipleSettings,
        navbarBrandName,
        navbarBrandSub,
        navbarBrandTagline,
        collegeName,
        collegeShortName,
        isNavVisible,
        getNavLabel,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
