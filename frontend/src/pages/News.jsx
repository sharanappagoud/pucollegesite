import React, { useState, useEffect } from 'react';
import { 
  Newspaper, Calendar, Bell, Search, 
  ChevronRight, Download, FileText, X, ExternalLink 
} from 'lucide-react';
import api from '../services/api';

export const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [noticesList, setNoticesList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    api.get('/news')
      .then(res => res.success && setNewsList(res.data))
      .catch(() => {});

    api.get('/events')
      .then(res => res.success && setEventsList(res.data))
      .catch(() => {});

    api.get('/notices')
      .then(res => res.success && setNoticesList(res.data))
      .catch(() => {});
  }, []);

  const filteredNews = newsList.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.excerpt && n.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      {/* Banner */}
      <section style={{
        background: 'linear-gradient(rgba(7, 23, 44, 0.9), rgba(11, 37, 69, 0.94)), url("https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        padding: '4.5rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <span className="section-subtitle" style={{ backgroundColor: 'rgba(212,175,55,0.2)', color: 'var(--gold-400)' }}>
            Information Center
          </span>
          <h1 style={{ fontSize: '2.75rem', color: '#ffffff', marginTop: '0.5rem', marginBottom: '1rem' }}>
            College News, Events & Notices
          </h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', color: '#cbd5e1', fontSize: '1.05rem' }}>
            Stay updated with state board circulars, examination schedules, academic achievements, and upcoming campus activities.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: '3.5rem', alignItems: 'flex-start' }}>
            {/* Left Column: News Articles */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-900)' }}>Press Releases & Articles</h2>
                <div style={{ position: 'relative', width: '220px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search news..."
                    style={{ padding: '0.45rem 0.75rem 0.45rem 2rem', fontSize: '0.85rem' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search size={15} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {filteredNews.map(article => (
                  <div key={article.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <img
                      src={article.imageUrl || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80"}
                      alt={article.title}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                          {article.category || 'Academics'}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {article.publishedAt}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '0.6rem', lineHeight: '1.3' }}>
                        {article.title}
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                        {article.excerpt}
                      </p>
                      <button
                        onClick={() => setSelectedArticle(article)}
                        className="btn btn-outline-primary btn-sm"
                      >
                        Read Full Story <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Events & Circulars */}
            <div>
              {/* Upcoming Events */}
              <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-900)', marginBottom: '1.5rem' }}>
                  Upcoming Events
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {eventsList.map(ev => (
                    <div key={ev.id} className="card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', padding: '1.25rem' }}>
                      <div style={{
                        backgroundColor: 'var(--primary-800)',
                        color: '#ffffff',
                        borderRadius: '10px',
                        padding: '0.75rem',
                        textAlign: 'center',
                        minWidth: '65px',
                        flexShrink: 0
                      }}>
                        <div style={{ fontSize: '1.35rem', fontWeight: '800', lineHeight: '1' }}>
                          {ev.eventDate ? ev.eventDate.split('-')[2] : '20'}
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--gold-400)' }}>
                          {ev.eventDate ? new Date(ev.eventDate).toLocaleString('default', { month: 'short' }) : 'JUN'}
                        </div>
                      </div>

                      <div>
                        <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#15803d', marginBottom: '0.25rem' }}>
                          {ev.status || 'UPCOMING'}
                        </span>
                        <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-900)', margin: '0.2rem 0' }}>
                          {ev.title}
                        </h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          🕒 {ev.eventTime} | 📍 {ev.location}
                        </p>
                        {ev.description && (
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.4rem', lineHeight: '1.5' }}>
                            {ev.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Notices Board */}
              <div>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-900)', marginBottom: '1.5rem' }}>
                  Notices & Circulars
                </h2>
                <div className="card" style={{ padding: '1rem' }}>
                  {noticesList.map((notice, idx) => (
                    <div key={notice.id || idx} style={{
                      padding: '1rem 0.5rem',
                      borderBottom: idx < noticesList.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        {notice.isImportant && (
                          <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b', marginRight: '0.5rem' }}>
                            IMPORTANT
                          </span>
                        )}
                        <h5 style={{ fontSize: '0.92rem', color: 'var(--primary-900)', display: 'inline' }}>
                          {notice.title}
                        </h5>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          Published on: {notice.publishedAt}
                        </div>
                      </div>

                      <a
                        href={notice.documentUrl || '#'}
                        onClick={(e) => {
                          if (!notice.documentUrl || notice.documentUrl === '#') {
                            e.preventDefault();
                            alert('This circular document is available at the college administrative office.');
                          }
                        }}
                        className="btn btn-outline-primary btn-sm"
                        style={{ flexShrink: 0, padding: '0.35rem 0.75rem' }}
                      >
                        <FileText size={14} /> View
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Article Modal */}
      {selectedArticle && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2.5rem',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedArticle(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              <X size={24} />
            </button>

            <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', marginBottom: '0.75rem' }}>
              {selectedArticle.category} • {selectedArticle.publishedAt}
            </span>

            <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-900)', marginBottom: '1.25rem', lineHeight: '1.3' }}>
              {selectedArticle.title}
            </h2>

            {selectedArticle.imageUrl && (
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1.5rem' }}
              />
            )}

            <div style={{
              color: 'var(--text-main)',
              lineHeight: '1.8',
              fontSize: '0.95rem',
              whiteSpace: 'pre-line'
            }}>
              {selectedArticle.content}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
              <button onClick={() => setSelectedArticle(null)} className="btn btn-primary btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
