import React, { useState, useEffect } from 'react';
import { Camera, Sparkles, ZoomIn, X, ChevronLeft, ChevronRight, Layers, Filter, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';

export const Gallery = () => {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Fetch categories and initial images
  useEffect(() => {
    api.get('/gallery/categories')
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          setCategories(res.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = selectedCategory ? `/gallery?categoryId=${selectedCategory}` : '/gallery';
    api.get(url)
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          setImages(res.data);
        } else {
          setImages([]);
        }
      })
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  // Lightbox keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev + 1) % images.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, images.length]);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* ── Page Hero Banner ──────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(rgba(7, 23, 44, 0.90), rgba(11, 37, 69, 0.94)), url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        padding: '5rem 0 4.5rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(212, 175, 55, 0.18)',
            border: '1px solid rgba(212, 175, 55, 0.45)',
            padding: '0.4rem 1.15rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: '700',
            color: 'var(--gold-400)',
            marginBottom: '1.25rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            <Sparkles size={14} /> Campus Visual Journey
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: '800',
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            Campus Photo Gallery
          </h1>

          <p style={{
            maxWidth: '680px',
            margin: '0 auto',
            color: '#cbd5e1',
            fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
            lineHeight: '1.6'
          }}>
            Explore our state-of-the-art laboratory workshops, vibrant cultural fests, academic achievements, sports meets, and life at Sri Vidyodaya.
          </p>
        </div>
      </section>

      {/* ── Photo Gallery Section ────────────────────────────────────────── */}
      <section className="section" style={{ padding: '3.5rem 0 5rem 0' }}>
        <div className="container">
          {/* Category Filter Pills & Photo Count */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.65rem',
            flexWrap: 'wrap',
            marginBottom: '2.5rem'
          }}>
            <button
              onClick={() => setSelectedCategory(0)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.6rem 1.35rem',
                borderRadius: '9999px',
                fontSize: '0.88rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: selectedCategory === 0 ? '1px solid var(--primary-700)' : '1px solid #cbd5e1',
                backgroundColor: selectedCategory === 0 ? 'var(--primary-800)' : '#ffffff',
                color: selectedCategory === 0 ? '#ffffff' : 'var(--text-main)',
                boxShadow: selectedCategory === 0 ? '0 4px 12px rgba(19,62,135,0.22)' : 'none'
              }}
            >
              <Layers size={15} /> All Photos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.6rem 1.35rem',
                  borderRadius: '9999px',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: selectedCategory === cat.id ? '1px solid var(--primary-700)' : '1px solid #cbd5e1',
                  backgroundColor: selectedCategory === cat.id ? 'var(--primary-800)' : '#ffffff',
                  color: selectedCategory === cat.id ? '#ffffff' : 'var(--text-main)',
                  boxShadow: selectedCategory === cat.id ? '0 4px 12px rgba(19,62,135,0.22)' : 'none'
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Photos Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div className="loading-spinner" style={{ margin: '0 auto 1rem auto' }}></div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading photographs...</p>
            </div>
          ) : images.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <Camera size={44} style={{ color: '#94a3b8', margin: '0 auto 1rem auto' }} />
              <h4 style={{ color: 'var(--primary-900)', marginBottom: '0.5rem' }}>No Photos In This Category Yet</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                New campus photographs will be uploaded by the administration soon.
              </p>
              <button
                onClick={() => setSelectedCategory(0)}
                className="btn btn-outline-primary btn-sm"
              >
                View All Photos
              </button>
            </div>
          ) : (
            <div className="grid-3" style={{ gap: '1.75rem' }}>
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  onClick={() => setLightboxIndex(idx)}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.05)';
                  }}
                >
                  <div style={{ position: 'relative', overflow: 'hidden', height: '230px', backgroundColor: '#07172c' }}>
                    <img
                      src={img.imageUrl}
                      alt={img.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    {img.categoryName && (
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(7, 23, 44, 0.85)',
                        backdropFilter: 'blur(6px)',
                        color: 'var(--gold-400)',
                        fontSize: '0.68rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '4px',
                        border: '1px solid rgba(212, 175, 55, 0.35)'
                      }}>
                        {img.categoryName}
                      </span>
                    )}
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: 'var(--primary-900)',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}>
                      <ZoomIn size={16} />
                    </div>
                  </div>

                  <div style={{ padding: '1.15rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: 'var(--primary-900)',
                        marginBottom: '0.35rem',
                        lineHeight: '1.3'
                      }}>
                        {img.title}
                      </h4>
                      {img.description && (
                        <p style={{
                          fontSize: '0.82rem',
                          color: 'var(--text-muted)',
                          lineHeight: '1.5',
                          marginBottom: 0
                        }}>
                          {img.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── High-Resolution Lightbox Modal ──────────────────────────────── */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div
          onClick={() => setLightboxIndex(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(4, 15, 30, 0.96)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            aria-label="Close Lightbox"
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100000
            }}
          >
            <X size={24} />
          </button>

          {/* Previous Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
            }}
            aria-label="Previous Photo"
            style={{
              position: 'absolute',
              left: '1.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100000
            }}
          >
            <ChevronLeft size={28} />
          </button>

          {/* Next Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev + 1) % images.length);
            }}
            aria-label="Next Photo"
            style={{
              position: 'absolute',
              right: '1.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100000
            }}
          >
            <ChevronRight size={28} />
          </button>

          {/* Active Image & Caption */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '920px',
              width: '100%',
              textAlign: 'center'
            }}
          >
            <img
              src={images[lightboxIndex].imageUrl}
              alt={images[lightboxIndex].title}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80';
              }}
              style={{
                maxHeight: '75vh',
                maxWidth: '100%',
                objectFit: 'contain',
                borderRadius: '10px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
              }}
            />
            <div style={{ marginTop: '1rem', color: '#ffffff' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.3rem', color: '#ffffff' }}>
                {images[lightboxIndex].title}
              </h3>
              {images[lightboxIndex].description && (
                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', maxWidth: '640px', margin: '0 auto' }}>
                  {images[lightboxIndex].description}
                </p>
              )}
              <div style={{ fontSize: '0.78rem', color: 'var(--gold-400)', marginTop: '0.4rem', fontWeight: '600' }}>
                {images[lightboxIndex].categoryName} • Photo {lightboxIndex + 1} of {images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

