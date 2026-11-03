import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, UserCheck, MessageSquare, BookOpen, 
  Users, Building2, Newspaper, Calendar, Bell, CalendarDays, 
  Settings, LogOut, ArrowLeft, Shield, Menu, X, ExternalLink,
  FileText, Image as ImageIcon, Award, ClipboardList, GraduationCap,
  DollarSign, Layers, MessageSquareQuote, Globe, Mail,
  ShieldCheck, History, FileSpreadsheet, Database, UserCog, Bot, Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { collegeShortName } = useSettings();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard }
      ]
    },
    {
      title: 'ADMISSIONS & STUDENTS',
      items: [
        { name: 'Admission Enquiries', path: '/admin/enquiries', icon: UserCheck },
        { name: 'Student & Application Records', path: '/admin/students', icon: ClipboardList },
        { name: 'Fee & Scholarships', path: '/admin/scholarships', icon: DollarSign },
        { name: 'Student Achievements & Results', path: '/admin/achievements', icon: Award }
      ]
    },
    {
      title: 'ACADEMICS & FACULTY',
      items: [
        { name: 'Courses & Combinations', path: '/admin/courses', icon: BookOpen },
        { name: 'Examination Management', path: '/admin/examinations', icon: GraduationCap },
        { name: 'Academic Calendar', path: '/admin/calendar', icon: CalendarDays },
        { name: 'Faculty Profiles', path: '/admin/faculty', icon: Users },
        { name: 'Staff & Departments', path: '/admin/departments', icon: Layers }
      ]
    },
    {
      title: 'CONTENT & MEDIA CMS',
      items: [
        { name: 'Page Content Management', path: '/admin/pages', icon: FileText },
        { name: 'Hero Banner Carousel', path: '/admin/banners', icon: ImageIcon },
        { name: 'Campus Photo Gallery', path: '/admin/gallery', icon: Camera },
        { name: "Principal's Desk", path: '/admin/principal-desk', icon: UserCheck },
        { name: 'Campus Facilities', path: '/admin/facilities', icon: Building2 },
        { name: 'News & Announcements', path: '/admin/news', icon: Newspaper },
        { name: 'College Events', path: '/admin/events', icon: Calendar },
        { name: 'Notices & Circulars', path: '/admin/notices', icon: Bell },
        { name: 'Testimonials & Reviews', path: '/admin/testimonials', icon: MessageSquareQuote }
      ]
    },
    {
      title: 'COMMUNICATIONS & SEO',
      items: [
        { name: 'Email & SMS History', path: '/admin/communication-history', icon: History },
        { name: 'AI Chatbot Management', path: '/admin/chatbot', icon: Bot },
        { name: 'Contact Messages', path: '/admin/contact-enquiries', icon: MessageSquare },
        { name: 'SEO & Social Media', path: '/admin/seo', icon: Globe },
        { name: 'Email & Notifications', path: '/admin/notifications', icon: Mail }
      ]
    },
    {
      title: 'SYSTEM & SECURITY',
      items: [
        { name: 'Navbar & College Settings', path: '/admin/settings', icon: Settings },
        { name: 'Roles & Permissions', path: '/admin/roles', icon: ShieldCheck },
        { name: 'Audit Logs & History', path: '/admin/audit-logs', icon: History },
        { name: 'Reports & CSV Export', path: '/admin/reports', icon: FileSpreadsheet },
        { name: 'Backup & Maintenance', path: '/admin/backup', icon: Database },
        { name: 'Security & Account', path: '/admin/account', icon: UserCog }
      ]
    }
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="admin-sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px', height: '36px',
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              border: '1.5px solid var(--gold-500)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--gold-400)'
            }}>
              <Shield size={20} />
            </div>
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '700' }}>{collegeShortName || 'SVCPUC'} ADMIN</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Full Portal CMS (27 Modules)</p>
            </div>
          </div>
        </div>

        <div className="admin-sidebar-scroll">
          {navSections.map((sec, idx) => (
            <div key={idx} style={{ marginBottom: '0.85rem' }}>
              <div className="admin-nav-category-title">
                {sec.title}
              </div>
              <ul className="admin-nav">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path} className="admin-nav-item">
                      <NavLink
                        to={item.path}
                        end={item.path === '/admin'}
                        className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon size={17} />
                        <span>{item.name}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Sidebar Footer Link */}
        <div style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
          <Link
            to="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#94a3b8',
              fontSize: '0.82rem',
              textDecoration: 'none'
            }}
          >
            <ExternalLink size={14} /> Visit Public Website
          </Link>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
        />
      )}

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Toggle Navigation Menu"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span style={{ fontSize: '0.88rem', color: '#475569' }}>
              Welcome back, <strong style={{ color: '#0f172a' }}>{user?.fullName || user?.username || 'Administrator'}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link
              to="/admin/account"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.82rem',
                color: 'var(--primary-700)',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              <UserCog size={16} /> My Account
            </Link>

            <button
              onClick={handleLogout}
              className="btn btn-outline-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </header>

        {/* Content View */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
