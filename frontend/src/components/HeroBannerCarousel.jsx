import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';

/**
 * HeroBannerCarousel – Pure Image Slider (No Text, No Dark Color Overlays, No Overlay Badges)
 * Auto-advances every 5 seconds with smooth cross-fade transition.
 */
export const HeroBannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
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
        }
      `}</style>
    </div>
  );
};

export default HeroBannerCarousel;
