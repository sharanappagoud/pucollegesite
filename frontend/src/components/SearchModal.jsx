import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, X, BookOpen, GraduationCap, Users, Building2,
  Calendar, FileText, Phone, Award, Sparkles, ChevronRight,
  ExternalLink, ArrowRight, CornerDownLeft, Info
} from 'lucide-react';
import api from '../services/api';

// Comprehensive indexed sitewide college catalog
const SITE_INDEX = [
  // 1. Academics & Courses
  {
    title: 'PCMB - Physics, Chemistry, Mathematics, Biology',
    category: 'Academics',
    path: '/academics?stream=SCIENCE#combinations',
    description: 'Premier Karnataka PU Board Science stream for Medicine (NEET), Pharmacy, Biotech, and Allied Healthcare careers.',
    keywords: 'pcmb science medical neet doctor biology chemistry physics combinations streams courses'
  },
  {
    title: 'PCMC - Physics, Chemistry, Mathematics, Computer Science',
    category: 'Academics',
    path: '/academics?stream=SCIENCE#combinations',
    description: 'Leading PU Science combination tailored for Engineering (JEE Mains/Advanced, KCET), AI, and Computing disciplines.',
    keywords: 'pcmc computer science coding python engineering jeee kcet math programming courses'
  },
  {
    title: 'CEBA - Computer Science, Economics, Business Studies, Accountancy',
    category: 'Academics',
    path: '/academics?stream=COMMERCE#combinations',
    description: 'Modern commerce stream integrating commercial computing, financial systems, and corporate management.',
    keywords: 'ceba commerce computer business accounts economics ca foundation corporate'
  },
  {
    title: 'MEBA - Basic Maths, Economics, Business Studies, Accountancy',
    category: 'Academics',
    path: '/academics?stream=COMMERCE#combinations',
    description: 'Commerce combination for students seeking quantitative aptitude for quantitative finance, CA, and banking.',
    keywords: 'meba commerce maths mathematics accounts banking finance economics'
  },
  {
    title: 'SEBA - Statistics, Economics, Business Studies, Accountancy',
    category: 'Academics',
    path: '/academics?stream=COMMERCE#combinations',
    description: 'Commerce combination specializing in statistical inference, actuarial sciences, and data-driven corporate analysis.',
    keywords: 'seba statistics business accounts economics commerce actuarial data analytics'
  },
  {
    title: 'MSBA - Basic Maths, Statistics, Business Studies, Accountancy',
    category: 'Academics',
    path: '/academics?stream=COMMERCE#combinations',
    description: 'Rigorous dual quantitative combination with applied statistics and commercial arithmetic.',
    keywords: 'msba maths statistics business accounts commerce quantitative'
  },
  {
    title: 'Integrated CET, NEET & JEE Coaching',
    category: 'Academics',
    path: '/academics#coaching',
    description: 'Built-in weekend and morning test series with chapter-wise problem clinics for national competitive entrance tests.',
    keywords: 'cet neet jee mains coaching test series mock tests entrance competitive prep'
  },
  {
    title: 'Academic Calendar 2026-27',
    category: 'Academics',
    path: '/academics#calendar',
    description: 'Term schedule, working days, mid-term assessment weeks, vacation windows, and board preparatory dates.',
    keywords: 'calendar academic year working days holidays vacation schedule term dates'
  },

  // 2. Admissions & Fees
  {
    title: 'Admission Guidelines & Eligibility 2026-27',
    category: 'Admissions',
    path: '/admissions#guidelines',
    description: 'Eligibility criteria for 10th SSLC / CBSE / ICSE passed students, stream cutoff guidelines, and document checklist.',
    keywords: 'admissions admission criteria eligibility sslc cbse icse cut off documents checklist apply'
  },
  {
    title: 'Online Admission Enquiry Form',
    category: 'Admissions',
    path: '/admissions#enquiry-form',
    description: 'Submit candidate details online to receive instant counseling guidance, fee structure, and seat confirmation.',
    keywords: 'enquiry form apply now online admission seat booking candidate register application'
  },
  {
    title: 'Track Admission Application Status',
    category: 'Admissions',
    path: '/admissions#track',
    description: 'Real-time application status tracker using your unique application enquiry reference code.',
    keywords: 'track status application enquiry reference verify admit confirm'
  },
  {
    title: 'Fee Structure & Scholarships',
    category: 'Admissions',
    path: '/admissions#scholarships',
    description: 'Annual fee schedules, merit scholarships (>90% marks), sports quota fee concessions, and economic aid.',
    keywords: 'fees fee structure scholarship cost concession waiver sports merit concession installments'
  },

  // 4. Faculty & Staff
  {
    title: 'Faculty & Academic Staff Directory',
    category: 'Faculty',
    path: '/faculty',
    description: 'Distinguished senior professors, lecturers, HODs, doctorates, and subject matter mentors across all streams.',
    keywords: 'faculty teachers professors staff directory lecturers hod mentors teaching team'
  },
  {
    title: 'Science Faculty (Physics, Chem, Math, Bio, CS)',
    category: 'Faculty',
    path: '/faculty?dept=Science',
    description: 'Dedicated laboratory in-charges and competitive exam coaching mentors in Science departments.',
    keywords: 'science teachers physics chemistry biology mathematics cs faculty'
  },
  {
    title: 'Commerce Faculty (Accounts, Business, Econ, Stats)',
    category: 'Faculty',
    path: '/faculty?dept=Commerce',
    description: 'Chartered accountants, experienced economists, and commerce pedagogical specialists.',
    keywords: 'commerce teachers accountancy business studies economics statistics faculty'
  },

  // 5. Facilities & Labs
  {
    title: 'Campus Facilities & Infrastructure',
    category: 'Facilities',
    path: '/facilities',
    description: 'State-of-the-art campus with smart classrooms, advanced STEM labs, sports amenities, and high-speed Wi-Fi.',
    keywords: 'facilities campus building infrastructure amenities classrooms grounds playground'
  },
  {
    title: 'Physics, Chemistry, Biology & CS Laboratories',
    category: 'Facilities',
    path: '/facilities#laboratories',
    description: 'Spacious individual workstations, fume hoods, digital compound microscopes, and high-spec computing labs.',
    keywords: 'labs laboratory physics lab chemistry lab biology lab computer lab practical equipment'
  },
  {
    title: 'Digital Library & Research Corridor',
    category: 'Facilities',
    path: '/facilities#library',
    description: 'Over 12,000 reference volumes, state board question banks, competitive journals, and silent study zones.',
    keywords: 'library books digital journals reading room reference volumes study hall'
  },
  {
    title: 'Auditorium & Indoor Sports Complex',
    category: 'Facilities',
    path: '/facilities#amenities',
    description: 'Acoustic seminar halls, badminton courts, table tennis arenas, and sports counseling.',
    keywords: 'auditorium seminar hall sports complex indoor games badminton arena'
  },

  // 6. Student Life & Clubs
  {
    title: 'Student Life & Campus Culture',
    category: 'Student Life',
    path: '/student-life',
    description: 'Holistic co-curricular environment nurturing cultural arts, scientific curiosity, civic empathy, and leadership.',
    keywords: 'student life campus culture activities clubs youth development'
  },
  {
    title: "'Pratibha' Annual Cultural Festival",
    category: 'Student Life',
    path: '/student-life#pratibha',
    description: 'Two-day flagship inter-collegiate extravaganza welcoming over 1,200 students across 40 PU colleges in Karnataka.',
    keywords: 'pratibha fest cultural fest dance music drama competition annual fest'
  },
  {
    title: 'Clubs & Forums (Robotics, Science, Eco & Arts)',
    category: 'Student Life',
    path: '/student-life#clubs',
    description: 'Active student clubs including Coding Club, Science Forum, Eco Guardians, and Literary & Debating Society.',
    keywords: 'clubs robotics club science forum eco club debating drama literary society'
  },

  // 7. About College
  {
    title: 'College History & Vision',
    category: 'About Us',
    path: '/about#history',
    description: 'Legacy of academic brilliance, government affiliation, student mentorship, and holistic pre-university pedagogy.',
    keywords: 'about history vision mission heritage background founding values affiliation'
  },
  {
    title: "Principal's Desk & Leadership Message",
    category: 'About Us',
    path: '/about#principal-message',
    description: 'Message from the Principal outlining academic expectations, competitive coaching integration, and values.',
    keywords: 'principal message desk leadership head teacher address'
  },
  {
    title: 'Board of Management & Trustees',
    category: 'About Us',
    path: '/about#management',
    description: 'Eminent educationists, veteran industrialists, and academicians guiding institutional governance.',
    keywords: 'management trustees board governing council directors founders'
  },

  // 8. Photo Gallery
  {
    title: 'Campus Photo Gallery & Visual Tour',
    category: 'Gallery',
    path: '/gallery',
    description: 'High-definition photography of campus life, science workshops, sports tournaments, and Pratibha cultural fests.',
    keywords: 'gallery photos pictures campus images photo tour visual albums moments'
  },

  // 9. News & Events
  {
    title: 'Latest News, Circulars & Announcements',
    category: 'News & Events',
    path: '/news',
    description: 'Official collegiate updates, board circulars, parent-teacher meeting notices, and holiday schedules.',
    keywords: 'news notices circulars announcements events updates alerts press releases'
  },

  // 10. Contact & Location
  {
    title: 'Contact Information & Campus Map',
    category: 'Contact',
    path: '/contact',
    description: 'Campus helpline numbers, admissions email, visiting hours, office locations, and Google Map directions.',
    keywords: 'contact phone number address email location map directions helpdesk helpline timings'
  },

  // 11. Staff / Admin Login
  {
    title: 'Staff & Administrator Portal Login',
    category: 'Admin',
    path: '/admin/login',
    description: 'Secure authentication gateway for faculty, admission officers, and examination controllers.',
    keywords: 'admin login staff portal faculty login credentials management sign in'
  }
];

const POPULAR_SEARCHES = [
  'Timetable', 'Model Question Paper', 'PCMB', 'PCMC',
  'Admissions 2026', 'Fee Structure', 'Faculty', 'Pratibha Fest', 'Scholarships'
];

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input automatically on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Keyboard shortcut (Escape to close, Up/Down to navigate, Enter to select)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter') {
        if (results.length > 0 && results[selectedIndex]) {
          e.preventDefault();
          handleSelectResult(results[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Perform search
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setResults([]);
      return;
    }

    const words = trimmed.split(/\s+/).filter(Boolean);

    const combinedPool = SITE_INDEX;

    // Score and filter results
    const matched = combinedPool.map(item => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const descLower = item.description.toLowerCase();
      const catLower = item.category.toLowerCase();
      const keyLower = (item.keywords || '').toLowerCase();

      // Exact title match gets highest score
      if (titleLower.includes(trimmed)) score += 30;
      if (catLower.includes(trimmed)) score += 15;
      if (descLower.includes(trimmed)) score += 10;
      if (keyLower.includes(trimmed)) score += 12;

      // Word-by-word match
      for (const w of words) {
        if (titleLower.includes(w)) score += 8;
        if (keyLower.includes(w)) score += 5;
        if (descLower.includes(w)) score += 3;
      }

      return { item, score };
    })
    .filter(res => res.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(res => res.item);

    // Deduplicate by path + title
    const seen = new Set();
    const unique = [];
    for (const item of matched) {
      const key = `${item.title}-${item.path}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
      if (unique.length >= 10) break;
    }

    setResults(unique);
    setSelectedIndex(0);
  }, [query, liveExams]);

  const handleSelectResult = (item) => {
    onClose();
    const hashIndex = item.path.indexOf('#');
    navigate(item.path);

    if (hashIndex !== -1) {
      const targetHash = item.path.substring(hashIndex + 1);
      setTimeout(() => {
        const el = document.getElementById(targetHash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 120);
    } else {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 60);
    }
  };

  if (!isOpen) return null;

  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'Academics':
        return { bg: '#e0f2fe', color: '#0369a1' };
      case 'Examinations':
        return { bg: '#fef3c7', color: '#b45309' };
      case 'Admissions':
        return { bg: '#dcfce7', color: '#166534' };
      case 'Faculty':
        return { bg: '#f3e8ff', color: '#6b21a8' };
      case 'Facilities':
        return { bg: '#e0e7ff', color: '#3730a3' };
      case 'Student Life':
        return { bg: '#fee2e2', color: '#991b1b' };
      case 'Gallery':
        return { bg: '#fef9c3', color: '#854d0e' };
      case 'News & Events':
        return { bg: '#fae8ff', color: '#86198f' };
      case 'Admin':
        return { bg: '#f1f5f9', color: '#334155' };
      default:
        return { bg: '#f1f5f9', color: '#1e293b' };
    }
  };

  return (
    <div
      className="search-modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(7, 23, 44, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '5rem 1rem 2rem 1rem',
        animation: 'fadeInSearch 0.18s ease-out'
      }}
    >
      <div
        className="search-modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '85vh',
          animation: 'slideUpSearch 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Search Input Box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          padding: '1.15rem 1.4rem',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: '#ffffff'
        }}>
          <Search size={22} color="var(--primary-700)" style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any information (courses, exams, timetables, fees, faculty, fest...)"
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '1.05rem',
              color: 'var(--primary-950)',
              fontWeight: 500,
              backgroundColor: 'transparent'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.25rem',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Clear search"
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            className="search-modal-esc"
            style={{
              background: '#f1f5f9',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '0.2rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              cursor: 'pointer',
              marginLeft: '0.25rem'
            }}
          >
            ESC
          </button>
        </div>

        {/* Results / Suggestions Container */}
        <div style={{ overflowY: 'auto', padding: '0.75rem 0', maxHeight: 'calc(85vh - 120px)' }}>
          {query.trim() === '' ? (
            /* Popular Searches when Empty */
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '0.9rem' }}>
                <Sparkles size={14} color="var(--gold-500)" /> Popular College Searches
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {POPULAR_SEARCHES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '9999px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: '#f8fafc',
                      color: 'var(--primary-800)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--gold-100)';
                      e.currentTarget.style.borderColor = 'var(--gold-400)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Quick Navigational Shortcuts
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleSelectResult({ path: '/academics#academic-calendar' })}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: '8px', border: 'none', background: '#f8fafc', cursor: 'pointer', textAlign: 'left', fontSize: '0.85rem', color: 'var(--primary-900)' }}
                  >
                    <Calendar size={16} color="var(--gold-600)" /> Academic Calendar
                  </button>
                  <button
                    onClick={() => handleSelectResult({ path: '/academics?stream=SCIENCE' })}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: '8px', border: 'none', background: '#f8fafc', cursor: 'pointer', textAlign: 'left', fontSize: '0.85rem', color: 'var(--primary-900)' }}
                  >
                    <BookOpen size={16} color="#0284c7" /> Science Streams
                  </button>
                  <button
                    onClick={() => handleSelectResult({ path: '/admissions#enquiry-form' })}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: '8px', border: 'none', background: '#f8fafc', cursor: 'pointer', textAlign: 'left', fontSize: '0.85rem', color: 'var(--primary-900)' }}
                  >
                    <GraduationCap size={16} color="#059669" /> Apply For Admission
                  </button>
                  <button
                    onClick={() => handleSelectResult({ path: '/faculty' })}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: '8px', border: 'none', background: '#f8fafc', cursor: 'pointer', textAlign: 'left', fontSize: '0.85rem', color: 'var(--primary-900)' }}
                  >
                    <Users size={16} color="#7c3aed" /> Faculty Directory
                  </button>
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            /* No Results Found State */
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
              <div style={{
                width: '54px', height: '54px', borderRadius: '50%',
                backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 1rem auto', color: '#94a3b8'
              }}>
                <Search size={26} />
              </div>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-900)', marginBottom: '0.4rem' }}>
                No results found for "{query}"
              </h4>
              <p style={{ fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto 1.25rem auto' }}>
                We couldn't find matching information. Try searching for broader terms like "Courses", "Exams", "Timetable", "Fees", or "Admissions".
              </p>
              <button
                onClick={() => setQuery('')}
                className="btn btn-outline-primary btn-sm"
              >
                Clear Search
              </button>
            </div>
          ) : (
            /* Results List */
            <div>
              <div style={{ padding: '0.4rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between' }}>
                <span>Found {results.length} Matching Results</span>
                <span style={{ fontSize: '0.72rem' }}>Use ↑ ↓ arrows & Enter to navigate</span>
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: '0.25rem 0.75rem' }}>
                {results.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  const badgeStyle = getCategoryBadgeColor(item.category);
                  return (
                    <li key={`${item.title}-${idx}`}>
                      <div
                        onClick={() => handleSelectResult(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          padding: '0.85rem 1rem',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'rgba(19, 62, 135, 0.07)' : 'transparent',
                          transition: 'all 0.12s ease'
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '4px',
                                backgroundColor: badgeStyle.bg,
                                color: badgeStyle.color,
                                flexShrink: 0
                              }}
                            >
                              {item.category}
                            </span>
                            <span style={{ fontWeight: 700, fontSize: '0.96rem', color: isSelected ? 'var(--primary-800)' : 'var(--primary-950)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.title}
                            </span>
                          </div>
                          <p style={{
                            margin: 0,
                            fontSize: '0.82rem',
                            color: 'var(--text-muted)',
                            lineHeight: '1.45',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {item.description}
                          </p>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          color: isSelected ? 'var(--gold-600)' : 'var(--border-subtle)',
                          transition: 'all 0.15s ease',
                          paddingTop: '0.25rem',
                          flexShrink: 0
                        }}>
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '0.75rem 1.4rem',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: '#f8fafc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span><kbd style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.72rem' }}>↑</kbd> <kbd style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.72rem' }}>↓</kbd> to navigate</span>
            <span><kbd style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.72rem' }}>↵</kbd> to select</span>
            <span><kbd style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.72rem' }}>esc</kbd> to close</span>
          </div>
          <span style={{ fontWeight: 600, color: 'var(--primary-800)' }}>
            Sri Vidyodaya Composite PU College
          </span>
        </div>
      </div>

      <style>{`
        @keyframes fadeInSearch {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpSearch {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default SearchModal;
