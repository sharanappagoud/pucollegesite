import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, Phone, Mail, MapPin, Clock, 
  Facebook, Instagram, Youtube, Linkedin, ShieldCheck, Heart 
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const Footer = () => {
  const { navbarBrandName, navbarBrandSub, settings, collegeName } = useSettings();

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="grid-4" style={{ gap: '2.5rem' }}>
          {/* Column 1: College Intro */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '40px', height: '40px',
                background: 'linear-gradient(135deg, #133E87 0%, #1D4ED8 100%)',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#D4AF37', border: '1.5px solid #D4AF37'
              }}>
                <GraduationCap size={24} />
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '1.05rem', lineHeight: '1.2' }}>{navbarBrandName}</h4>
                <p style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: '700' }}>{navbarBrandSub}</p>
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1.25rem', color: '#94a3b8' }}>
              {settings.college_tagline || 'Committed to imparting value-based pre-university education with strong conceptual foundation in Science and Commerce streams, empowering students for top national competitive entrances.'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                <Facebook size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                <Instagram size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                <Youtube size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Academic Streams */}
          <div>
            <h4 className="footer-col-title">Academic Courses</h4>
            <ul className="footer-links">
              <li className="footer-link-item">
                <Link to="/academics?stream=SCIENCE" className="footer-link">
                  PCMB - Physics, Chem, Maths, Biology
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/academics?stream=SCIENCE" className="footer-link">
                  PCMC - Physics, Chem, Maths, Computer
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/academics?stream=COMMERCE" className="footer-link">
                  CEBA - Comp Sci, Economics, Business, Accounts
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/academics?stream=COMMERCE" className="footer-link">
                  MEBA - Basic Maths, Economics, Business, Accounts
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/academics?stream=COMMERCE" className="footer-link">
                  SEBA - Statistics, Economics, Business, Accounts
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/academics?stream=COMMERCE" className="footer-link">
                  MSBA - Basic Maths, Statistics, Business, Accounts
                </Link>
              </li>
              <li className="footer-link-item" style={{ marginTop: '0.5rem' }}>
                <span style={{ color: '#D4AF37', fontSize: '0.8rem', fontWeight: '600' }}>
                  ★ Integrated CET / NEET / JEE / CA Prep
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              <li className="footer-link-item"><Link to="/about" className="footer-link">About College & Vision</Link></li>
              <li className="footer-link-item"><Link to="/admissions" className="footer-link">Admissions 2026-27</Link></li>
              <li className="footer-link-item"><Link to="/examinations" className="footer-link">Examinations & Schedules</Link></li>
              <li className="footer-link-item"><Link to="/admissions#enquiry-form" className="footer-link">Online Admission Enquiry</Link></li>
              <li className="footer-link-item"><Link to="/faculty" className="footer-link">Distinguished Faculty</Link></li>
              <li className="footer-link-item"><Link to="/facilities" className="footer-link">Laboratories & Library</Link></li>
              <li className="footer-link-item"><Link to="/gallery" className="footer-link">Campus Photo Gallery</Link></li>
              <li className="footer-link-item"><Link to="/student-life" className="footer-link">Student Life & Cultural Clubs</Link></li>
              <li className="footer-link-item"><Link to="/news" className="footer-link">Notices & Event Calendar</Link></li>
              <li className="footer-link-item"><Link to="/admin/login" className="footer-link">Admin / Staff Portal</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Campus Info */}
          <div>
            <h4 className="footer-col-title">Campus Information</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <MapPin size={18} color="#D4AF37" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>#45, Vidya Soudha Campus, 18th Cross, Malleshwaram, Bengaluru, Karnataka - 560003</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <Phone size={18} color="#D4AF37" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <a href="tel:+918023456789" style={{ display: 'block', color: 'inherit' }}>+91 80 2345 6789</a>
                  <a href="tel:+918023456790" style={{ display: 'block', color: 'inherit' }}>+91 80 2345 6790 (Admissions)</a>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <Mail size={18} color="#D4AF37" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <a href="mailto:info@svcpuc.edu.in" style={{ display: 'block', color: 'inherit' }}>info@svcpuc.edu.in</a>
                  <a href="mailto:admissions@svcpuc.edu.in" style={{ display: 'block', color: 'inherit' }}>admissions@svcpuc.edu.in</a>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <Clock size={18} color="#D4AF37" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Mon - Fri: 8:30 AM - 4:30 PM<br/>Sat: 8:30 AM - 1:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Sri Vidyodaya Composite Pre-University College. All Rights Reserved.
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
              Affiliation: {settings.affiliation || 'Department of Pre-University Education, Government of Karnataka'} (Institution Code: {settings.college_code || 'KA-PUC-0842'})
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem' }}>
            <Link to="/privacy-policy" style={{ color: '#cbd5e1' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: '#cbd5e1' }}>Terms & Conditions</Link>
            <Link to="/accessibility" style={{ color: '#cbd5e1' }}>Accessibility</Link>
            <Link to="/admin" style={{ color: '#D4AF37', fontWeight: '600' }}>Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
