import React, { useEffect, useState } from 'react';
import { Bell, ChevronRight, ExternalLink, Plus, Edit } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AnnouncementTicker = () => {
  const [notices, setNotices] = useState([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/notices?important=true')
      .then(res => {
        if (res.success && res.data?.length > 0) {
          setNotices(res.data);
        } else {
          // Fallback announcement with functional links
          setNotices([
            {
              id: 1,
              title: 'Admissions Open for 1st PUC (Science & Commerce) 2026-27 - Submit Online Enquiry Now!',
              documentUrl: '/admissions#enquiry-form'
            },
            {
              id: 2,
              title: 'Important Circular: Schedule for First Unit Test Examinations',
              documentUrl: '/examinations'
            }
          ]);
        }
      })
      .catch(() => {
        setNotices([
          {
            id: 1,
            title: 'Admissions Open for 1st PUC (Science & Commerce) 2026-27 - Submit Online Enquiry Now!',
            documentUrl: '/admissions#enquiry-form'
          },
          {
            id: 2,
            title: 'Important Circular: Schedule for First Unit Test Examinations',
            documentUrl: '/examinations'
          }
        ]);
      });
  }, []);

  const handleNoticeClick = (n) => {
    let url = n.documentUrl;

    // Smart contextual resolution if documentUrl is missing or just '#'
    if (!url || url === '#' || url.trim() === '') {
      const lowerTitle = (n.title || '').toLowerCase();
      if (
        lowerTitle.includes('unit test') ||
        lowerTitle.includes('exam') ||
        lowerTitle.includes('timetable') ||
        lowerTitle.includes('preparatory') ||
        lowerTitle.includes('board') ||
        lowerTitle.includes('assessment')
      ) {
        url = '/examinations';
      } else if (
        lowerTitle.includes('scholarship') ||
        lowerTitle.includes('fee') ||
        lowerTitle.includes('concession')
      ) {
        url = '/admissions#scholarships';
      } else if (
        lowerTitle.includes('admission') ||
        lowerTitle.includes('enquiry') ||
        lowerTitle.includes('apply')
      ) {
        url = '/admissions#enquiry-form';
      } else if (lowerTitle.includes('calendar') || lowerTitle.includes('holiday')) {
        url = '/academics#calendar';
      } else if (lowerTitle.includes('library') || lowerTitle.includes('lab')) {
        url = '/facilities';
      } else {
        url = '/news';
      }
    }

    // External URL or PDF file
    if (url.startsWith('http://') || url.startsWith('https://') || url.endsWith('.pdf')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Internal navigation with hash anchor support
    const hashIndex = url.indexOf('#');
    if (hashIndex !== -1) {
      const path = url.substring(0, hashIndex) || '/';
      const hash = url.substring(hashIndex + 1);
      navigate(path);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      navigate(url);
    }
  };

  if (notices.length === 0) return null;

  return (
    <div className="ticker-wrap">
      <div className="container">
        <div className="ticker-inner">
          {/* Badge Label */}
          <span className="ticker-badge">
            <Bell size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} /> Announcements
          </span>

          {/* Marquee Ticker Track (Pauses on Hover for Easy Clicking) */}
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', flexGrow: 1, position: 'relative' }}>
            <div className="ticker-marquee-track">
              {/* Render items duplicated so it forms a continuous stream */}
              {[...notices, ...notices].map((n, idx) => (
                <button
                  key={`${n.id || idx}-${idx}`}
                  type="button"
                  className="ticker-item-btn"
                  onClick={() => handleNoticeClick(n)}
                  title={`Click to open details: ${n.title}`}
                >
                  <span style={{ marginRight: '6px' }}>📢</span>
                  <span className="ticker-text-title">{n.title}</span>
                  <ExternalLink size={12} className="ticker-link-icon" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Action Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            {isAuthenticated && (
              <Link 
                to="/admin/notices" 
                className="ticker-admin-btn"
                title="Admin: Click here to add or manage ticker announcements"
              >
                <Plus size={13} /> Add Announcement
              </Link>
            )}

            <Link 
              to="/news" 
              className="ticker-view-all"
              title="View all official notices and circulars"
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .ticker-marquee-track {
          display: inline-flex;
          align-items: center;
          animation: marqueeScroll 32s linear infinite;
        }

        .ticker-marquee-track:hover {
          animation-play-state: paused;
        }

        .ticker-item-btn {
          background: transparent;
          border: none;
          color: var(--primary-950);
          font-family: inherit;
          font-size: 0.84rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          margin-right: 3rem;
          cursor: pointer;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          transition: all 0.16s ease;
          white-space: nowrap;
          text-align: left;
        }

        .ticker-item-btn:hover {
          background-color: rgba(11, 37, 69, 0.14);
          color: #0B2545;
          text-decoration: underline;
        }

        .ticker-text-title {
          letter-spacing: -0.005em;
        }

        .ticker-link-icon {
          margin-left: 6px;
          opacity: 0.65;
          flex-shrink: 0;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }

        .ticker-item-btn:hover .ticker-link-icon {
          opacity: 1;
          transform: translate(1px, -1px);
        }

        .ticker-admin-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background-color: #0B2545;
          color: #ffffff !important;
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          font-size: 0.74rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          transition: all 0.15s ease;
        }

        .ticker-admin-btn:hover {
          background-color: #133E87;
          transform: translateY(-1px);
        }

        .ticker-view-all {
          display: inline-flex;
          align-items: center;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: underline;
          color: var(--primary-950);
          white-space: nowrap;
        }

        .ticker-view-all:hover {
          color: #0B2545;
        }

        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default AnnouncementTicker;
