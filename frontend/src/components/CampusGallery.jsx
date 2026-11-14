import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, X, Camera } from 'lucide-react';
import api from '../services/api';

/**
 * CampusGallery – Professional Owl Carousel-style photo gallery
 * Uses pure CSS animations + React for full Vite/ESM compatibility.
 * Fetches images from /api/v1/gallery with optional category filtering.
 */
const defaultGalleryImages = [
  {
    id: 'def-1',
    title: 'Advanced Physics & Chemistry Research Laboratory',
    categoryName: 'Science Labs',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    description: 'High-tech lab setups for hands-on experiments.'
  },
  {
    id: 'def-2',
    title: 'Central Digital Library & Research Hall',
    categoryName: 'Library',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    description: 'Extensive repository of collegiate reference books & e-journals.'
  },
  {
    id: 'def-3',
    title: 'Computer Science & Computational Lab',
    categoryName: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    description: 'Modern computing terminals for programming & data analytics.'
  },
  {
    id: 'def-4',
    title: 'Annual Cultural Fest & Stage Performances',
    categoryName: 'Events',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    description: 'Vibrant artistic displays and student talents.'
  },
  {
    id: 'def-5',
    title: 'Inter-Collegiate Sports Tournament & Athletic Meet',
    categoryName: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    description: 'Track and court events promoting team spirit and physical fitness.'
  },
  {
    id: 'def-6',
    title: 'Main Academic Quadrangle & Campus Greenery',
    categoryName: 'Campus',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    description: 'Serene botanical surroundings conducive to focused learning.'
  }
];

export const CampusGallery = () => {
  const [images, setImages] = useState(defaultGalleryImages);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const autoPlayRef = useRef(null);
  const trackRef = useRef(null);

  // ── Responsive: how many items per view ───────────────────────────────────
  const [itemsPerView, setItemsPerView] = useState(3);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setItemsPerView(w < 640 ? 1 : w < 1024 ? 2 : 3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── Fetch categories ────────────────────────────────────────────────────────
  useEffect(() => {
    api.get('/gallery/categories')
      .then(res => res.success && setCategories(res.data || []))
      .catch(() => {});
  }, []);

  // ── Fetch images when category changes ─────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setCurrentSlide(0);
    const url = selectedCategory ? `/gallery?categoryId=${selectedCategory}` : '/gallery';
    api.get(url)
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setImages(res.data);
        } else {
          setImages(defaultGalleryImages);
        }
      })
      .catch(() => setImages(defaultGalleryImages))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  // ── Auto-play ────────────────────────────────────────────────────────────
  const maxSlide = Math.max(0, images.length - itemsPerView);
  useEffect(() => {
    if (!autoPlay || images.length === 0) return;
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev >= maxSlide ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(autoPlayRef.current);
  }, [autoPlay, images.length, maxSlide, itemsPerView]);

  const goTo = (idx) => {
    const clamped = Math.max(0, Math.min(idx, maxSlide));
    setCurrentSlide(clamped);
  };
  const prev = () => goTo(currentSlide === 0 ? maxSlide : currentSlide - 1);
  const next = () => goTo(currentSlide >= maxSlide ? 0 : currentSlide + 1);

  // ── Touch/Drag ────────────────────────────────────────────────────────────
  const onPointerDown = (e) => { setIsDragging(true); setDragStart(e.clientX); };
  const onPointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const delta = dragStart - e.clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
  };

  const slideWidth = 100 / itemsPerView; // percent per card

  return (
    <section style={{ background: 'var(--primary-900)', padding: '5rem 0', overflow: 'hidden' }}>
      <div className="container">

        {/* ── Section Header ─────────────────────────────────────────────── */}
        <div className="section-title-wrap" style={{ marginBottom: '2.5rem' }}>
          <span className="section-subtitle" style={{
            color: 'var(--gold-400)', background: 'rgba(212,175,55,0.12)',
            border: '1px solid rgba(212,175,55,0.3)', borderRadius: '20px',
            padding: '0.3rem 1rem', fontSize: '0.78rem', textTransform: 'uppercase',
            letterSpacing: '0.1em', fontWeight: 700, display: 'inline-block',
            marginBottom: '1rem'
          }}>
            📸 Visual Tour
          </span>
          <h2 className="section-title" style={{ color: '#fff', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
            Campus Photo Gallery
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.6rem', maxWidth: 600, margin: '0.6rem auto 0' }}>
            Experience campus life, labs, cultural fests, sports, and academics through our lens.
          </p>
        </div>

        {/* ── Category Filter Pills ──────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {[{ id: 0, name: '📷 All Photos' }, ...categories.map(c => ({ ...c, name: c.name }))].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: '20px',
                border: selectedCategory === cat.id ? '2px solid var(--gold-500)' : '1.5px solid rgba(255,255,255,0.2)',
                background: selectedCategory === cat.id ? 'var(--gold-500)' : 'rgba(255,255,255,0.06)',
                color: selectedCategory === cat.id ? '#07172C' : '#e2e8f0',
                fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* ── Carousel ──────────────────────────────────────────────────── */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '4rem 0', fontSize: '0.9rem' }}>
            <Camera size={32} style={{ display: 'block', margin: '0 auto 0.75rem' }} />
            Loading gallery…
          </div>
        ) : images.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '4rem 0' }}>
            No photos in this category yet.
          </div>
        ) : (
          <div style={{ position: 'relative' }}
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
          >
            {/* Carousel Track Wrapper */}
            <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerLeave={() => setIsDragging(false)}
            >
              <div
                ref={trackRef}
                style={{
                  display: 'flex',
                  transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)',
                  transform: `translateX(-${currentSlide * slideWidth}%)`,
                  willChange: 'transform',
                }}
              >
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    style={{
                      flex: `0 0 ${slideWidth}%`,
                      padding: '0 0.5rem',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div style={{
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      background: '#0f1e35',
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      cursor: 'pointer',
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-6px)';
                        e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.5)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
                      }}
                      onClick={() => setLightboxImg(img)}
                    >
                      {/* Image */}
                      <div style={{ position: 'relative', overflow: 'hidden', height: '220px' }}>
                        <img
                          src={img.imageUrl}
                          alt={img.title}
                          loading="lazy"
                          style={{
                            width: '100%', height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                            display: 'block',
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        />
                        {/* Zoom overlay */}
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'rgba(7,23,44,0)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'background 0.3s ease',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(7,23,44,0.45)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(7,23,44,0)'}
                        >
                          <ZoomIn size={28} color="rgba(255,255,255,0.9)" style={{ opacity: 0, transition: 'opacity 0.3s' }}
                            onMouseEnter={e => e.currentTarget.style.opacity = 1}
                          />
                        </div>
                        {/* Category Badge */}
                        {img.categoryName && (
                          <span style={{
                            position: 'absolute', top: '0.6rem', left: '0.6rem',
                            background: 'rgba(7,23,44,0.82)', color: 'var(--gold-400)',
                            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em',
                            padding: '0.25rem 0.65rem', borderRadius: '12px',
                            textTransform: 'uppercase', backdropFilter: 'blur(4px)',
                          }}>
                            {img.categoryName}
                          </span>
                        )}
                      </div>
                      {/* Caption */}
                      <div style={{ padding: '0.85rem 1rem 1rem' }}>
                        <h4 style={{
                          color: '#f1f5f9', fontSize: '0.88rem',
                          fontWeight: 700, marginBottom: '0.25rem',
                          lineHeight: 1.3,
                          overflow: 'hidden', display: '-webkit-box',
                          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        }}>
                          {img.title}
                        </h4>
                        {img.description && (
                          <p style={{
                            color: '#64748b', fontSize: '0.76rem',
                            lineHeight: 1.4,
                            overflow: 'hidden', display: '-webkit-box',
                            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                          }}>
                            {img.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Nav Arrows ─────────────────────────────────────────────── */}
            <button onClick={prev} style={arrowStyle('left')}>
              <ChevronLeft size={22} />
            </button>
            <button onClick={next} style={arrowStyle('right')}>
              <ChevronRight size={22} />
            </button>

            {/* ── Dots ────────────────────────────────────────────────────── */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.75rem' }}>
              {Array.from({ length: maxSlide + 1 }).map((_, i) => (
                <button key={i} onClick={() => goTo(i)} style={{
                  width: i === currentSlide ? '28px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === currentSlide ? 'var(--gold-500)' : 'rgba(255,255,255,0.25)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'all 0.3s ease',
                }} />
              ))}
            </div>

            {/* ── Counter ─────────────────────────────────────────────────── */}
            <div style={{ textAlign: 'center', color: '#475569', fontSize: '0.78rem', marginTop: '0.75rem' }}>
              {currentSlide * itemsPerView + 1}–{Math.min((currentSlide + 1) * itemsPerView, images.length)} of {images.length} photos
            </div>
          </div>
        )}
      </div>

      {/* ── Lightbox ────────────────────────────────────────────────────────── */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem',
            backdropFilter: 'blur(8px)',
          }}
        >
          <button
            onClick={() => setLightboxImg(null)}
            style={{
              position: 'fixed', top: '1.2rem', right: '1.2rem',
              background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)',
              borderRadius: '50%', width: 42, height: 42,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff', zIndex: 10000,
            }}
          >
            <X size={20} />
          </button>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: 900, width: '100%',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              background: '#0b1e35',
              boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
            }}
          >
            <img
              src={lightboxImg.imageUrl}
              alt={lightboxImg.title}
              style={{ width: '100%', maxHeight: '70vh', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ padding: '1.25rem 1.5rem' }}>
              {lightboxImg.categoryName && (
                <span style={{
                  fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.08em', color: 'var(--gold-400)',
                  display: 'inline-block', marginBottom: '0.35rem',
                }}>
                  {lightboxImg.categoryName}
                </span>
              )}
              <h3 style={{ color: '#f1f5f9', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                {lightboxImg.title}
              </h3>
              {lightboxImg.description && (
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {lightboxImg.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

function arrowStyle(side) {
  return {
    position: 'absolute',
    top: '50%',
    [side]: '-1rem',
    transform: 'translateY(-50%)',
    background: 'var(--gold-500)',
    border: 'none',
    color: '#07172C',
    borderRadius: '50%',
    width: 44, height: 44,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
    zIndex: 10,
    transition: 'background 0.2s ease, transform 0.2s ease',
    fontWeight: 700,
  };
}

export default CampusGallery;

