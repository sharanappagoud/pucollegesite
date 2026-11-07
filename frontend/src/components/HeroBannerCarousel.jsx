import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Camera, Upload, Edit2, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * HeroBannerCarousel – Pure Image Slider (No Text, No Dark Color Overlays)
 * Auto-advances every 5 seconds with smooth cross-fade transition.
 * Provides direct access for Admin to change, upload, and manage carousel photos.
 */
export const HeroBannerCarousel = () => {
  const { user, token } = useAuth();
  const isAuthenticated = Boolean(token && user);

  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [uploadingQuick, setUploadingQuick] = useState(false);
  const timerRef = useRef(null);

  // Default curated high-resolution campus photos if none stored in database
  const defaultSlides = [
    {
      id: 'default-1',
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=85',
      title: 'Sri Vidyodaya College Main Campus Block'
    },
    {
      id: 'default-2',
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=85',
      title: 'Academic Grounds & Library Building'
    },
    {
      id: 'default-3',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=85',
      title: 'Collegiate Learning & Research Labs'
    }
  ];

  // Fetch active banners from backend
  const fetchBanners = () => {
    api.get('/banners')
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data
            .filter(b => b.imageUrl && !b.imageUrl.includes('photos.google.com/photo/'))
            .map((b) => ({
              id: b.id,
              imageUrl: b.imageUrl,
              title: b.title || 'Campus Photo'
            }));
          setBanners(mapped.length > 0 ? mapped : defaultSlides);
        } else {
          setBanners(defaultSlides);
        }
      })
      .catch(() => {
        setBanners(defaultSlides);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const activeSlides = banners.length > 0 ? banners : defaultSlides;
  const totalSlides = activeSlides.length;

  // Auto-play timer: moves to next image every 5 seconds (5000ms)
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(timerRef.current);
  }, [isPaused, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (idx) => {
    setCurrentSlide(idx);
  };

  // Touch Swipe handlers for mobile
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };

  // Direct quick photo upload for Admin right on the carousel
  const handleQuickPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploadingQuick(true);

    try {
      const uploadRes = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (uploadRes.success && uploadRes.data?.url) {
        const newBanner = {
          imageUrl: uploadRes.data.url,
          title: file.name ? file.name.replace(/\.[^/.]+$/, "") : 'Campus Banner',
          displayOrder: activeSlides.length + 1,
          active: true
        };
        await api.post('/admin/banners', newBanner);
        fetchBanners();
        setCurrentSlide(activeSlides.length);
        alert('New photo uploaded and added to the carousel successfully!');
      }
    } catch (err) {
      alert('Photo upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingQuick(false);
      e.target.value = '';
    }
  };

  return (
    <div
      className="hero-carousel-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(420px, 52vw, 620px)',
        minHeight: '420px',
        maxHeight: '640px',
        overflow: 'hidden',
        backgroundColor: '#0a192f'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Campus Hero Image Gallery"
    >
      {/* ── Slide Images (Clean pure photos with NO color overlay and NO text) ── */}
      {activeSlides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id || index}
            className="hero-carousel-slide"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: isActive ? 1 : 0,
              visibility: isActive ? 'visible' : 'hidden',
              transition: 'opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1), transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isActive ? 'scale(1)' : 'scale(1.03)',
              zIndex: isActive ? 1 : 0,
              overflow: 'hidden'
            }}
          >
            <img
              src={slide.imageUrl}
              alt={slide.title || `Campus View ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block'
              }}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=85';
              }}
            />
          </div>
        );
      })}

      {/* ── Direct Admin Access for Changing Photos ────────────────────────── */}
      {isAuthenticated ? (
        <div
          className="hero-admin-floating-bar"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            zIndex: 25,
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            backgroundColor: 'rgba(10, 37, 64, 0.88)',
            border: '1.5px solid #d4af37',
            padding: '0.4rem 0.85rem',
            borderRadius: '30px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.2s ease'
          }}
        >
          <span
            style={{
              fontSize: '0.76rem',
              fontWeight: 700,
              color: '#fef08a',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              paddingRight: '0.25rem',
              borderRight: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <Camera size={14} /> Photo {currentSlide + 1} of {totalSlides}
          </span>

          {/* Quick upload input */}
          <label
            style={{
              cursor: 'pointer',
              margin: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.76rem',
              fontWeight: 700,
              color: '#07172c',
              backgroundColor: '#d4af37',
              padding: '0.32rem 0.75rem',
              borderRadius: '20px',
              transition: 'all 0.15s ease',
              boxShadow: '0 2px 8px rgba(212, 175, 55, 0.35)'
            }}
            title="Upload a photo from your computer to add to the carousel"
          >
            <Upload size={13} /> {uploadingQuick ? 'Uploading...' : '+ Add Photo'}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleQuickPhotoUpload}
              disabled={uploadingQuick}
            />
          </label>

          {/* Manage Photos link to Admin Portal */}
          <Link
            to="/admin/banners"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.76rem',
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              padding: '0.32rem 0.75rem',
              borderRadius: '20px',
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
            title="Open Admin Banner Manager to reorder, replace, or delete photos"
          >
            <Edit2 size={12} /> Manage Photos
          </Link>
        </div>
      ) : (
        <Link
          to="/admin/banners"
          className="hero-admin-subtle-btn"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            zIndex: 20,
            backgroundColor: 'rgba(7, 23, 44, 0.65)',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '0.4rem 0.85rem',
            borderRadius: '25px',
            fontSize: '0.76rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backdropFilter: 'blur(8px)',
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
            transition: 'all 0.2s ease'
          }}
          title="Staff / Admin: Click to login and manage carousel photos"
        >
          <Camera size={13} color="#d4af37" /> Change Photos
        </Link>
      )}

      {/* ── Navigation Arrows (Left / Right) ─────────────────────────────────── */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="hero-nav-arrow hero-nav-prev"
            style={{
              position: 'absolute',
              left: '1.25rem',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 15,
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'rgba(7, 23, 44, 0.65)',
              border: '1.5px solid rgba(212, 175, 55, 0.75)',
              color: '#d4af37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.18s ease',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d4af37';
              e.currentTarget.style.color = '#07172c';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(7, 23, 44, 0.65)';
              e.currentTarget.style.color = '#d4af37';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="hero-nav-arrow hero-nav-next"
            style={{
              position: 'absolute',
              right: '1.25rem',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 15,
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'rgba(7, 23, 44, 0.65)',
              border: '1.5px solid rgba(212, 175, 55, 0.75)',
              color: '#d4af37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.18s ease',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d4af37';
              e.currentTarget.style.color = '#07172c';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(7, 23, 44, 0.65)';
              e.currentTarget.style.color = '#d4af37';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* ── Pagination Indicator Dots (5-Second Progress) ───────────────────── */}
      {totalSlides > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 15,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            backgroundColor: 'rgba(7, 23, 44, 0.65)',
            padding: '0.4rem 0.9rem',
            borderRadius: '9999px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {activeSlides.map((_, idx) => {
            const isDotActive = idx === currentSlide;
            return (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: isDotActive ? '28px' : '9px',
                  height: '9px',
                  borderRadius: '9999px',
                  backgroundColor: isDotActive ? '#d4af37' : 'rgba(255, 255, 255, 0.55)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            );
          })}
        </div>
      )}

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 768px) {
          .hero-nav-arrow {
            width: 38px !important;
            height: 38px !important;
          }
          .hero-admin-floating-bar {
            top: 0.75rem !important;
            right: 0.75rem !important;
            padding: 0.3rem 0.65rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroBannerCarousel;
