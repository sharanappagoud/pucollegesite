import React, { useEffect, useState } from 'react';
import { Bell, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export const AnnouncementTicker = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    api.get('/notices?important=true')
      .then(res => {
        if (res.success && res.data?.length > 0) {
          setNotices(res.data);
        } else {
          // Fallback announcement
          setNotices([
            { id: 1, title: 'Admissions Open for 1st PUC (Science & Commerce) 2026-27 - Submit Online Enquiry Now!' }
          ]);
        }
      })
      .catch(() => {
        setNotices([
          { id: 1, title: 'Admissions Open for 1st PUC (Science & Commerce) 2026-27 - Submit Online Enquiry Now!' }
        ]);
      });
  }, []);

  if (notices.length === 0) return null;

  return (
    <div className="ticker-wrap">
      <div className="container">
        <div className="ticker-inner">
          <span className="ticker-badge">
            <Bell size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} /> Announcements
          </span>
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', flexGrow: 1 }}>
            <span style={{ display: 'inline-block', animation: 'marquee 25s linear infinite' }}>
              {notices.map((n, idx) => (
                <span key={n.id || idx} style={{ marginRight: '3rem' }}>
                  📢 {n.title}
                </span>
              ))}
            </span>
          </div>
          <Link to="/news" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.8rem', fontWeight: '700', textDecoration: 'underline', color: 'inherit' }}>
            View All <ChevronRight size={14} />
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
