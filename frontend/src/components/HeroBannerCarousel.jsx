import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';

/**
 * HeroBannerCarousel – Professional Owl Carousel slider for the Hero Section
 * Fully responsive with auto-play, pause on hover, touch/drag swipe,
 * animated transitions, pagination dots, and navigation arrows.
 * Fetches active slides dynamically from /api/v1/banners (managed by Admin).
 */
export const HeroBannerCarousel = () => {
  const { collegeName } = useSettings();
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const timerRef = useRef(null);

  // Default fallback slides if none fetched from API
  const defaultSlides = [
    {
      id: 'default-1',
      title: 'Building Strong Foundations for Engineering, Medicine & Corporate Leadership',
      subtitle: `${collegeName || 'Sri Vidyodaya Composite Pre-University College'} provides rigorous Karnataka State Pre-University board education integrated with premier coaching for KCET, NEET, JEE, and CA Foundation.`,
      titleColor: '#FFFFFF',
      highlightText: 'Engineering, Medicine & Corporate',
      highlightColor: '#E6CA65',
      subtitleColor: '#CBD5E1',
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80',
      ctaText: 'Apply For Admission',
      ctaLink: '/admissions',
      secondaryText: 'Explore Courses & Streams',
      secondaryLink: '/academics',
      tertiaryText: 'Enquire Now',
      tertiaryLink: '#quick-enquiry'
    },
    {
      id: 'default-2',
      title: 'Integrated Coaching for KCET, NEET, JEE & CA Foundation',
      subtitle: 'State-of-the-art laboratory workshops, distinguished senior faculties, and weekly chapter-wise mock tests ensuring 98.6% distinction rate.',
      titleColor: '#FFFFFF',
      highlightText: 'KCET, NEET, JEE & CA Foundation',
      highlightColor: '#E6CA65',
      subtitleColor: '#CBD5E1',
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80',
      ctaText: 'Explore Science Stream',
      ctaLink: '/academics',
      secondaryText: 'Apply For Admission',
      secondaryLink: '/admissions',
      tertiaryText: 'Enquire Now',
      tertiaryLink: '#quick-enquiry'
    },
    {
      id: 'default-3',
      title: 'Excellence in Science & Commerce Streams with Modern Infrastructure',
      subtitle: 'Nurturing student potential with advanced computing labs, expansive library study corridors, sports arenas, and holistic student development.',
      titleColor: '#FFFFFF',
      highlightText: 'Science & Commerce Streams',
      highlightColor: '#E6CA65',
      subtitleColor: '#CBD5E1',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80',
      ctaText: 'Explore Commerce Stream',
      ctaLink: '/academics',
      secondaryText: 'Campus Facilities',
      secondaryLink: '/facilities',
      tertiaryText: 'Enquire Now',
      tertiaryLink: '#quick-enquiry'
    }
  ];

  // Fetch active banners from backend
  useEffect(() => {
    let isMounted = true;
    api.get('/banners')
      .then((res) => {
        if (!isMounted) return;
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          // Normalize slides with fallback links
          const mapped = res.data.map((b) => ({
            id: b.id,
            title: b.title || 'Excellence in Collegiate Education',
            subtitle: b.subtitle || 'Empowering students with knowledge, character, and leadership.',
            titleColor: b.titleColor || '#FFFFFF',
            highlightText: b.highlightText || '',
            highlightColor: b.highlightColor || '#E6CA65',
            subtitleColor: b.subtitleColor || '#CBD5E1',
            imageUrl: (b.imageUrl && !b.imageUrl.includes('photos.google.com/photo/'))
              ? b.imageUrl
              : 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80',
            ctaText: b.ctaText || 'Apply For Admission',
            ctaLink: b.ctaLink || '/admissions',
            secondaryText: 'Explore Courses & Streams',
            secondaryLink: '/academics',
            tertiaryText: 'Enquire Now',
            tertiaryLink: '#quick-enquiry'
          }));
          setBanners(mapped);
        } else {
          setBanners(defaultSlides);
        }
      })
      .catch(() => {
        if (isMounted) setBanners(defaultSlides);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [collegeName]);

  const activeSlides = banners.length > 0 ? banners : defaultSlides;
  const totalSlides = activeSlides.length;

  // Auto-play timer (advances every 5.5 seconds)
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5500);

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

  // Helper to format title with customizable accent highlight words
  const formatTitle = (slide) => {
    if (!slide || !slide.title) return null;
    const titleStr = slide.title;
    const highlightWord = slide.highlightText && slide.highlightText.trim();
    const hlColor = slide.highlightColor || 'var(--gold-400)';

    if (highlightWord && titleStr.includes(highlightWord)) {
      const parts = titleStr.split(highlightWord);
      return (
        <>
          {parts[0]}
          <span style={{ color: hlColor }}>{highlightWord}</span>
          {parts.slice(1).join(highlightWord)}
        </>
      );
    }

    // Fallback common key terms in gold if present
    const keywords = ['Engineering, Medicine & Corporate', 'Science & Commerce', 'KCET, NEET, JEE', 'Distinction', 'Academic Distinction'];
    for (const kw of keywords) {
      if (titleStr.includes(kw)) {
        const parts = titleStr.split(kw);
        return (
          <>
            {parts[0]}
            <span style={{ color: hlColor }}>{kw}</span>
            {parts[1]}
          </>
        );
      }
    }
    return titleStr;
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '620px',
        overflow: 'hidden',
        backgroundColor: '#07172c',
        color: '#ffffff'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      {activeSlides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id || index}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: isActive ? 1 : 0,
              visibility: isActive ? 'visible' : 'hidden',
              transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out',
              transform: isActive ? 'scale(1)' : 'scale(1.04)',
              background: `linear-gradient(rgba(7, 23, 44, 0.84), rgba(11, 37, 69, 0.90)), url("${slide.imageUrl}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              padding: '6rem 0 7.5rem 0',
              zIndex: isActive ? 1 : 0
            }}
          >
            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ maxWidth: '840px', padding: '0 0.5rem' }}>

                {/* Admissions Badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'rgba(212, 175, 55, 0.18)',
                    border: '1px solid rgba(212, 175, 55, 0.55)',
                    padding: '0.45rem 1.15rem',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    color: 'var(--gold-400)',
                    marginBottom: '1.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    backdropFilter: 'blur(6px)',
                    animation: isActive ? 'heroSlideUp 0.6s ease forwards' : 'none'
                  }}
                >
                  <Sparkles size={16} /> Admissions Open For Academic Year 2026-27
                </div>

                {/* Hero Title */}
                <h1
                  style={{
                    fontSize: 'clamp(2.1rem, 4.2vw, 3.35rem)',
                    fontWeight: '800',
                    color: slide.titleColor || '#ffffff',
                    letterSpacing: '-0.025em',
                    lineHeight: '1.18',
                    marginBottom: '1.5rem',
                    animation: isActive ? 'heroSlideUp 0.8s ease forwards' : 'none'
                  }}
                >
                  {formatTitle(slide)}
                </h1>

                {/* Hero Subtitle */}
                <p
                  style={{
                    fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
                    color: slide.subtitleColor || '#cbd5e1',
                    lineHeight: '1.7',
                    marginBottom: '0',
                    maxWidth: '740px',
                    animation: isActive ? 'heroSlideUp 1s ease forwards' : 'none'
                  }}
                >
                  {slide.subtitle}
                </p>

              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows (Owl Carousel style) */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            style={{
              position: 'absolute',
              left: '1.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'rgba(7, 23, 44, 0.75)',
              border: '1.5px solid rgba(212, 175, 55, 0.6)',
              color: 'var(--gold-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
              transition: 'all 0.12s ease',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--gold-500)';
              e.currentTarget.style.color = '#07172C';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(7, 23, 44, 0.75)';
              e.currentTarget.style.color = 'var(--gold-400)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            style={{
              position: 'absolute',
              right: '1.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'rgba(7, 23, 44, 0.75)',
              border: '1.5px solid rgba(212, 175, 55, 0.6)',
              color: 'var(--gold-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
              transition: 'all 0.25s ease',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--gold-500)';
              e.currentTarget.style.color = '#07172C';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(7, 23, 44, 0.75)';
              e.currentTarget.style.color = 'var(--gold-400)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Pagination Dots (Owl Carousel style) */}
      {totalSlides > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            backgroundColor: 'rgba(7, 23, 44, 0.65)',
            padding: '0.45rem 0.9rem',
            borderRadius: '9999px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
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
                  width: isDotActive ? '26px' : '9px',
                  height: '9px',
                  borderRadius: '9999px',
                  backgroundColor: isDotActive ? 'var(--gold-500)' : 'rgba(255, 255, 255, 0.45)',
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

      {/* Keyframe animation styling */}
      <style>{`
        @keyframes heroSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default HeroBannerCarousel;

