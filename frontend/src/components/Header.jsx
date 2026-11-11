import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, GraduationCap, Menu, X, ChevronDown, ChevronRight,
  ExternalLink, Lock, Calendar, BookOpen, Award, Users, Search 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import SearchModal from './SearchModal';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const { navbarBrandName, navbarBrandSub, navbarBrandTagline, settings, isNavVisible, getNavLabel } = useSettings();
  const navigate = useNavigate();

  // Listen for Cmd+K / Ctrl+K keyboard shortcut to toggle sitewide search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setMobileSubmenu(null);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setMobileSubmenu(null);
  };

  const toggleMobileSubmenu = (menu) => {
    setMobileSubmenu(mobileSubmenu === menu ? null : menu);
  };

  const handleDropdownItemClick = (targetPath) => {
    setActiveDropdown(null);
    closeMobileMenu();

    const hashIndex = targetPath.indexOf('#');
    if (hashIndex !== -1) {
      const targetHash = targetPath.substring(hashIndex + 1);
      setTimeout(() => {
        const element = document.getElementById(targetHash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 80);
    } else {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <>
      {/* Top Contact Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-inner">
            <div className="top-bar-left">
              <span className="top-bar-item top-bar-address">
                <MapPin size={13} color="#D4AF37" /> {settings.campus_address ? settings.campus_address.split(',').slice(0, 2).join(',') : 'Malleshwaram, Bengaluru - 560003'}
              </span>
              <a href={`tel:${settings.phone_primary || '+918023456789'}`} className="top-bar-item top-bar-phone">
                <Phone size={13} color="#D4AF37" /> {settings.phone_primary || '+91 80 2345 6789'}
              </a>
              <a href={`mailto:${settings.email_admissions || 'admissions@svcpuc.edu.in'}`} className="top-bar-item top-bar-email">
                <Mail size={13} color="#D4AF37" /> {settings.email_admissions || 'admissions@svcpuc.edu.in'}
              </a>
            </div>
            <div className="top-bar-right">
              <span className="top-bar-item top-bar-code" style={{ color: '#d4af37', fontWeight: '600' }}>
                Affiliation Code: {settings.college_code || 'KA-PUC-0842'}
              </span>
              {isAuthenticated ? (
                <Link to="/admin" className="top-bar-item top-bar-auth" style={{ color: '#60a5fa', fontWeight: '700' }}>
                  <Lock size={12} /> Admin Dashboard ({user?.username})
                </Link>
              ) : (
                <Link to="/admin/login" className="top-bar-item top-bar-auth">
                  <Lock size={12} /> Staff / Admin Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="main-header">
        <div className="container">
          <nav className="navbar">
            <Link to="/" className="brand-wrap" onClick={closeMobileMenu}>
              <div className="brand-logo-icon">
                <GraduationCap size={26} />
              </div>
              <div className="brand-text-col">
                <span className="brand-name">{navbarBrandName}</span>
                <span className="brand-sub">{navbarBrandSub}</span>
              </div>
            </Link>

            {/* Desktop Navigation Links - Serial Order */}
            <ul className="nav-links">
              {isNavVisible('nav_show_home') && (
                <li className="nav-item">
                  <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    {getNavLabel('nav_label_home', 'Home')}
                  </NavLink>
                </li>
              )}

              {/* About Us Dropdown */}
              {isNavVisible('nav_show_about') && (
                <li 
                  className={`nav-item ${activeDropdown === 'about' ? 'dropdown-open' : ''}`}
                  onMouseEnter={() => setActiveDropdown('about')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    {getNavLabel('nav_label_about', 'About Us')} <ChevronDown size={13} className="nav-chevron" />
                  </NavLink>
                  <div className="dropdown-menu">
                    {isNavVisible('nav_show_about_history') && (
                      <Link 
                        to="/about#history" 
                        className="dropdown-item" 
                        onClick={() => handleDropdownItemClick('/about#history')}
                      >
                        College History & Overview
                      </Link>
                    )}
                    {isNavVisible('nav_show_about_vision') && (
                      <Link 
                        to="/about#vision-mission" 
                        className="dropdown-item" 
                        onClick={() => handleDropdownItemClick('/about#vision-mission')}
                      >
                        Vision & Mission
                      </Link>
                    )}
                    {isNavVisible('nav_show_about_principal') && (
                      <Link 
                        to="/about#principal-message" 
                        className="dropdown-item" 
                        onClick={() => handleDropdownItemClick('/about#principal-message')}
                      >
                        Principal's Message
                      </Link>
                    )}
                    {isNavVisible('nav_show_about_management') && (
                      <Link 
                        to="/about#management" 
                        className="dropdown-item" 
                        onClick={() => handleDropdownItemClick('/about#management')}
                      >
                        Board of Management
                      </Link>
                    )}
                    {isNavVisible('nav_show_about_student_life') && (
                      <Link 
                        to="/student-life" 
                        className="dropdown-item" 
                        onClick={() => handleDropdownItemClick('/student-life')}
                      >
                        Student Life
                      </Link>
                    )}
                  </div>
                </li>
              )}

              {/* Academics Dropdown */}
              {isNavVisible('nav_show_academics') && (
                <li 
                  className={`nav-item ${activeDropdown === 'academics' ? 'dropdown-open' : ''}`}
                  onMouseEnter={() => setActiveDropdown('academics')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <NavLink to="/academics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    {getNavLabel('nav_label_academics', 'Academics')} <ChevronDown size={13} className="nav-chevron" />
                  </NavLink>
                  <div className="dropdown-menu">
                    {isNavVisible('nav_show_academics_science') && (
                      <Link 
                        to="/academics?stream=SCIENCE#combinations" 
                        className="dropdown-item" 
                        onClick={() => handleDropdownItemClick('/academics?stream=SCIENCE#combinations')}
                      >
                        Science Stream (PCMB, PCMC)
                      </Link>
                    )}
                    {isNavVisible('nav_show_academics_commerce') && (
                      <Link 
                        to="/academics?stream=COMMERCE#combinations" 
                        className="dropdown-item" 
                        onClick={() => handleDropdownItemClick('/academics?stream=COMMERCE#combinations')}
                      >
                        Commerce Stream (CEBA, MEBA)
                      </Link>
                    )}
                    {isNavVisible('nav_show_academics_coaching') && (
                      <Link 
                        to="/academics#coaching" 
                        className="dropdown-item" 
                        onClick={() => handleDropdownItemClick('/academics#coaching')}
                      >
                        CET, NEET & JEE Coaching
                      </Link>
                    )}
                    {isNavVisible('nav_show_academics_calendar') && (
                      <Link 
                        to="/academics#calendar" 
                        className="dropdown-item" 
                        onClick={() => handleDropdownItemClick('/academics#calendar')}
                      >
                        Academic Calendar
                      </Link>
                    )}
                  </div>
                </li>
              )}

              {/* Admissions Dropdown */}
              {isNavVisible('nav_show_admissions') && (
                <li 
                  className={`nav-item ${activeDropdown === 'admissions' ? 'dropdown-open' : ''}`}
                  onMouseEnter={() => setActiveDropdown('admissions')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <NavLink to="/admissions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    {getNavLabel('nav_label_admissions', 'Admissions')} <ChevronDown size={13} className="nav-chevron" />
                  </NavLink>
                  <div className="dropdown-menu">
                    {isNavVisible('nav_show_admissions_guidelines') && (
                      <Link 
                        to="/admissions#guidelines" 
                        className="dropdown-item" 
                        onClick={() => handleDropdownItemClick('/admissions#guidelines')}
                      >
                        Admission Guidelines & Eligibility
                      </Link>
                    )}
                    {isNavVisible('nav_show_admissions_enquiry') && (
                      <Link 
                        to="/admissions#enquiry-form" 
                        className="dropdown-item" 
                        onClick={() => handleDropdownItemClick('/admissions#enquiry-form')}
                      >
                        Online Admission Enquiry
                      </Link>
                    )}
                    {isNavVisible('nav_show_admissions_track') && (
                      <Link 
                        to="/admissions#track" 
                        className="dropdown-item" 
                        onClick={() => handleDropdownItemClick('/admissions#track')}
                      >
                        Track Application Status
                      </Link>
                    )}
                    {isNavVisible('nav_show_admissions_scholarships') && (
                      <Link 
                        to="/admissions#scholarships" 
                        className="dropdown-item" 
                        onClick={() => handleDropdownItemClick('/admissions#scholarships')}
                      >
                        Scholarships & Fee Structure
                      </Link>
                    )}
                  </div>
                </li>
              )}

              {isNavVisible('nav_show_examinations') && (
                <li className="nav-item">
                  <NavLink to="/examinations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    {getNavLabel('nav_label_examinations', 'Examinations')}
                  </NavLink>
                </li>
              )}

              {isNavVisible('nav_show_faculty') && (
                <li className="nav-item">
                  <NavLink to="/faculty" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    {getNavLabel('nav_label_faculty', 'Faculty')}
                  </NavLink>
                </li>
              )}

              {isNavVisible('nav_show_facilities') && (
                <li className="nav-item">
                  <NavLink to="/facilities" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    {getNavLabel('nav_label_facilities', 'Facilities')}
                  </NavLink>
                </li>
              )}

              {isNavVisible('nav_show_gallery') && (
                <li className="nav-item">
                  <NavLink to="/gallery" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    {getNavLabel('nav_label_gallery', 'Gallery')}
                  </NavLink>
                </li>
              )}

              {isNavVisible('nav_show_news') && (
                <li className="nav-item">
                  <NavLink to="/news" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    {getNavLabel('nav_label_news', 'News & Events')}
                  </NavLink>
                </li>
              )}

              {isNavVisible('nav_show_contact') && (
                <li className="nav-item">
                  <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    {getNavLabel('nav_label_contact', 'Contact')}
                  </NavLink>
                </li>
              )}
            </ul>

            {/* Header Right Action Buttons */}
            <div className="navbar-actions">
              {isNavVisible('nav_show_search_btn') && (
                <button
                  type="button"
                  className="nav-search-btn"
                  onClick={() => setSearchModalOpen(true)}
                  title="Search courses, exams, fees, faculty, admissions (Press ⌘K or Ctrl+K)"
                  aria-label="Search college information"
                >
                  <div className="nav-search-left">
                    <Search size={16} className="nav-search-icon" />
                    <span className="nav-search-label">Search courses, exams, fees...</span>
                  </div>
                  <span className="nav-search-kbd">
                    <kbd>⌘K</kbd>
                  </span>
                </button>
              )}

              {isNavVisible('nav_show_apply_btn') && (
                <Link 
                  to="/admissions#enquiry-form" 
                  className="btn btn-gold btn-sm nav-cta-btn"
                  onClick={() => handleDropdownItemClick('/admissions#enquiry-form')}
                >
                  {getNavLabel('nav_label_apply_btn', 'Apply Now')}
                </Link>
              )}
              <button
                onClick={toggleMobileMenu}
                className="mobile-toggle"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </nav>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="mobile-drawer">
              {/* Quick Search Trigger in Mobile Drawer */}
              {isNavVisible('nav_show_search_btn') && (
                <div 
                  className="mobile-search-trigger-wrap" 
                  onClick={() => {
                    setSearchModalOpen(true);
                    closeMobileMenu();
                  }}
                >
                  <div className="mobile-search-trigger-box">
                    <Search size={16} color="#0B2545" />
                    <span className="mobile-search-trigger-text">Search courses, timetables, admissions...</span>
                    <span className="mobile-search-trigger-badge">Search</span>
                  </div>
                </div>
              )}

              {isNavVisible('nav_show_home') && (
                <NavLink to="/" end onClick={closeMobileMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                  {getNavLabel('nav_label_home', 'Home')}
                </NavLink>
              )}

              {/* Mobile About Us with Submenu Toggle */}
              {isNavVisible('nav_show_about') && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '0.75rem' }}>
                    <NavLink to="/about" onClick={closeMobileMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} style={{ flex: 1 }}>
                      {getNavLabel('nav_label_about', 'About Us')}
                    </NavLink>
                    <button 
                      onClick={() => toggleMobileSubmenu('about')} 
                      className="mobile-submenu-toggle"
                      aria-label="Toggle About Submenu"
                    >
                      <ChevronDown size={18} style={{ transform: mobileSubmenu === 'about' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>
                  </div>
                  {mobileSubmenu === 'about' && (
                    <div className="mobile-submenu">
                      {isNavVisible('nav_show_about_history') && (
                        <Link to="/about#history" onClick={() => handleDropdownItemClick('/about#history')} className="mobile-sub-link">
                          <ChevronRight size={14} /> College History & Overview
                        </Link>
                      )}
                      {isNavVisible('nav_show_about_vision') && (
                        <Link to="/about#vision-mission" onClick={() => handleDropdownItemClick('/about#vision-mission')} className="mobile-sub-link">
                          <ChevronRight size={14} /> Vision & Mission
                        </Link>
                      )}
                      {isNavVisible('nav_show_about_principal') && (
                        <Link to="/about#principal-message" onClick={() => handleDropdownItemClick('/about#principal-message')} className="mobile-sub-link">
                          <ChevronRight size={14} /> Principal's Message
                        </Link>
                      )}
                      {isNavVisible('nav_show_about_management') && (
                        <Link to="/about#management" onClick={() => handleDropdownItemClick('/about#management')} className="mobile-sub-link">
                          <ChevronRight size={14} /> Board of Management
                        </Link>
                      )}
                      {isNavVisible('nav_show_about_student_life') && (
                        <Link to="/student-life" onClick={() => handleDropdownItemClick('/student-life')} className="mobile-sub-link">
                          <ChevronRight size={14} /> Student Life
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Academics with Submenu Toggle */}
              {isNavVisible('nav_show_academics') && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '0.75rem' }}>
                    <NavLink to="/academics" onClick={closeMobileMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} style={{ flex: 1 }}>
                      {getNavLabel('nav_label_academics', 'Academics')}
                    </NavLink>
                    <button 
                      onClick={() => toggleMobileSubmenu('academics')} 
                      className="mobile-submenu-toggle"
                      aria-label="Toggle Academics Submenu"
                    >
                      <ChevronDown size={18} style={{ transform: mobileSubmenu === 'academics' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>
                  </div>
                  {mobileSubmenu === 'academics' && (
                    <div className="mobile-submenu">
                      {isNavVisible('nav_show_academics_science') && (
                        <Link to="/academics?stream=SCIENCE#combinations" onClick={() => handleDropdownItemClick('/academics?stream=SCIENCE#combinations')} className="mobile-sub-link">
                          <ChevronRight size={14} /> Science Stream (PCMB, PCMC)
                        </Link>
                      )}
                      {isNavVisible('nav_show_academics_commerce') && (
                        <Link to="/academics?stream=COMMERCE#combinations" onClick={() => handleDropdownItemClick('/academics?stream=COMMERCE#combinations')} className="mobile-sub-link">
                          <ChevronRight size={14} /> Commerce Stream (CEBA, MEBA)
                        </Link>
                      )}
                      {isNavVisible('nav_show_academics_coaching') && (
                        <Link to="/academics#coaching" onClick={() => handleDropdownItemClick('/academics#coaching')} className="mobile-sub-link">
                          <ChevronRight size={14} /> CET, NEET & JEE Coaching
                        </Link>
                      )}
                      {isNavVisible('nav_show_academics_calendar') && (
                        <Link to="/academics#calendar" onClick={() => handleDropdownItemClick('/academics#calendar')} className="mobile-sub-link">
                          <ChevronRight size={14} /> Academic Calendar
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Admissions with Submenu Toggle */}
              {isNavVisible('nav_show_admissions') && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '0.75rem' }}>
                    <NavLink to="/admissions" onClick={closeMobileMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} style={{ flex: 1 }}>
                      {getNavLabel('nav_label_admissions', 'Admissions')}
                    </NavLink>
                    <button 
                      onClick={() => toggleMobileSubmenu('admissions')} 
                      className="mobile-submenu-toggle"
                      aria-label="Toggle Admissions Submenu"
                    >
                      <ChevronDown size={18} style={{ transform: mobileSubmenu === 'admissions' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>
                  </div>
                  {mobileSubmenu === 'admissions' && (
                    <div className="mobile-submenu">
                      {isNavVisible('nav_show_admissions_guidelines') && (
                        <Link to="/admissions#guidelines" onClick={() => handleDropdownItemClick('/admissions#guidelines')} className="mobile-sub-link">
                          <ChevronRight size={14} /> Admission Guidelines & Eligibility
                        </Link>
                      )}
                      {isNavVisible('nav_show_admissions_enquiry') && (
                        <Link to="/admissions#enquiry-form" onClick={() => handleDropdownItemClick('/admissions#enquiry-form')} className="mobile-sub-link">
                          <ChevronRight size={14} /> Online Admission Enquiry
                        </Link>
                      )}
                      {isNavVisible('nav_show_admissions_track') && (
                        <Link to="/admissions#track" onClick={() => handleDropdownItemClick('/admissions#track')} className="mobile-sub-link">
                          <ChevronRight size={14} /> Track Application Status
                        </Link>
                      )}
                      {isNavVisible('nav_show_admissions_scholarships') && (
                        <Link to="/admissions#scholarships" onClick={() => handleDropdownItemClick('/admissions#scholarships')} className="mobile-sub-link">
                          <ChevronRight size={14} /> Scholarships & Fee Structure
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}

              {isNavVisible('nav_show_examinations') && (
                <NavLink to="/examinations" onClick={closeMobileMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                  {getNavLabel('nav_label_examinations', 'Examinations')}
                </NavLink>
              )}
              {isNavVisible('nav_show_faculty') && (
                <NavLink to="/faculty" onClick={closeMobileMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                  {getNavLabel('nav_label_faculty', 'Faculty')}
                </NavLink>
              )}
              {isNavVisible('nav_show_facilities') && (
                <NavLink to="/facilities" onClick={closeMobileMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                  {getNavLabel('nav_label_facilities', 'Facilities & Labs')}
                </NavLink>
              )}
              {isNavVisible('nav_show_gallery') && (
                <NavLink to="/gallery" onClick={closeMobileMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                  {getNavLabel('nav_label_gallery', 'Photo Gallery')}
                </NavLink>
              )}
              {isNavVisible('nav_show_news') && (
                <NavLink to="/news" onClick={closeMobileMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                  {getNavLabel('nav_label_news', 'News & Events')}
                </NavLink>
              )}
              {isNavVisible('nav_show_contact') && (
                <NavLink to="/contact" onClick={closeMobileMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                  {getNavLabel('nav_label_contact', 'Contact Us')}
                </NavLink>
              )}

              <div className="mobile-drawer-footer">
                {isNavVisible('nav_show_apply_btn') && (
                  <Link 
                    to="/admissions#enquiry-form" 
                    onClick={() => handleDropdownItemClick('/admissions#enquiry-form')} 
                    className="btn btn-gold btn-sm" 
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    {getNavLabel('nav_label_apply_btn', 'Apply For Admission')}
                  </Link>
                )}
                {isAuthenticated ? (
                  <Link to="/admin" onClick={closeMobileMenu} className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>
                    Admin ({user?.username})
                  </Link>
                ) : (
                  <Link to="/admin/login" onClick={closeMobileMenu} className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>
                    Staff Login
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Backdrop Overlay */}
        {mobileMenuOpen && (
          <div className="mobile-drawer-backdrop" onClick={closeMobileMenu} />
        )}
      </header>

      {/* Sitewide Universal Search Modal */}
      <SearchModal 
        isOpen={searchModalOpen} 
        onClose={() => setSearchModalOpen(false)} 
      />
    </>
  );
};
