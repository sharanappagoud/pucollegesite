import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass, Sparkles, MapPin, Eye, ArrowRight, CheckCircle2,
  Maximize2, Volume2, ShieldCheck, Award, GraduationCap, Calendar
} from 'lucide-react';
import CampusTour3D, { CAMPUS_LOCATIONS } from '../components/CampusTour3D';
import { useSettings } from '../context/SettingsContext';

export const VirtualTour = () => {
  const { collegeName, settings } = useSettings();
  const [activeLocation, setActiveLocation] = useState('quadrangle');

  return (
    <div>
      {/* 3D Experience Page Header */}
      <section style={{
        background: 'linear-gradient(135deg, #07172c 0%, #0B2545 50%, #133E87 100%)',
        color: '#ffffff',
        padding: '3.5rem 0 2.5rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(212, 175, 55, 0.18)',
              color: '#D4AF37',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              padding: '0.35rem 0.9rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '1rem'
            }}>
              <Sparkles size={14} /> Interactive 360° & 3D Walkthrough
            </span>

            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 2.85rem)',
              fontWeight: '800',
              lineHeight: '1.2',
              marginBottom: '1rem',
              color: '#ffffff',
              letterSpacing: '-0.02em'
            }}>
              Explore <span style={{ color: '#D4AF37' }}>{collegeName || 'Sri Vidyodaya'}</span> in 3D
            </h1>

            <p style={{
              fontSize: '1.05rem',
              color: '#cbd5e1',
              lineHeight: '1.65',
              marginBottom: '1.5rem'
            }}>
              Step inside our world-class science and computer laboratories, digital library, and academic quadrangle. Drag in any direction to explore 360°, zoom in to examine equipment, and tap floating 3D pins for detailed lab specifications.
            </p>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1.5rem',
              fontSize: '0.86rem',
              color: '#e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <CheckCircle2 size={16} color="#D4AF37" /> 360° Spherical Panoramic Views
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <CheckCircle2 size={16} color="#D4AF37" /> Interactive 3D Equipment Pins
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <CheckCircle2 size={16} color="#D4AF37" /> Day / Sunset / Night Lighting
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Virtual Tour Viewport Container */}
      <section style={{ backgroundColor: '#020617', padding: '1.5rem 0 3rem 0' }}>
        <div className="container">
          <CampusTour3D initialLocation={activeLocation} isEmbedded={true} />

          {/* User Navigation Tips */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem'
          }}>
            <div style={{
              backgroundColor: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '1rem',
              color: '#cbd5e1',
              fontSize: '0.84rem'
            }}>
              <strong style={{ color: '#ffffff', display: 'block', marginBottom: '0.25rem' }}>
                🖱️ Drag & Pan 360°
              </strong>
              Click and drag mouse or swipe on touch screens to orbit the camera in any direction.
            </div>

            <div style={{
              backgroundColor: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '1rem',
              color: '#cbd5e1',
              fontSize: '0.84rem'
            }}>
              <strong style={{ color: '#ffffff', display: 'block', marginBottom: '0.25rem' }}>
                🔍 Scroll / Pinch to Zoom
              </strong>
              Use your mouse scroll wheel or pinch to zoom in on apparatus, book stacks, and workstations.
            </div>

            <div style={{
              backgroundColor: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '1rem',
              color: '#cbd5e1',
              fontSize: '0.84rem'
            }}>
              <strong style={{ color: '#ffffff', display: 'block', marginBottom: '0.25rem' }}>
                ✨ Tap Floating 3D Pins
              </strong>
              Click the pulsing gold hotspots to inspect equipment specifications, laser benches, and safety rules.
            </div>

            <div style={{
              backgroundColor: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '1rem',
              color: '#cbd5e1',
              fontSize: '0.84rem'
            }}>
              <strong style={{ color: '#ffffff', display: 'block', marginBottom: '0.25rem' }}>
                ☀️ Switch Atmosphere
              </strong>
              Toggle the sun/moon icon at the top right to view the campus in day, golden sunset, or twilight illumination.
            </div>
          </div>
        </div>
      </section>

      {/* Campus Zones Fast Jump Directory */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle">Key Collegiate Zones</span>
            <h2 className="section-title">Campus Tour Destinations</h2>
            <p className="section-desc">
              Select any of our state-of-the-art facilities below to jump directly into its 3D environment.
            </p>
          </div>

          <div className="grid-3">
            {CAMPUS_LOCATIONS.map(loc => (
              <div
                key={loc.id}
                onClick={() => {
                  setActiveLocation(loc.id);
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className="card"
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.22s ease',
                  border: '1.5px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{
                    backgroundColor: 'rgba(11, 37, 69, 0.08)',
                    color: 'var(--primary-800)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}>
                    {loc.category}
                  </span>
                  <span style={{
                    color: '#D4AF37',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.78rem',
                    fontWeight: '700'
                  }}>
                    <Sparkles size={13} /> 3D View
                  </span>
                </div>

                <h3 style={{ fontSize: '1.18rem', fontWeight: '800', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
                  {loc.name}
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem', flexGrow: 1 }}>
                  {loc.subtitle}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-subtle)',
                  color: 'var(--primary-700)',
                  fontWeight: '700',
                  fontSize: '0.84rem'
                }}>
                  <span>{loc.hotspots?.length || 3} Interactive Hotspots</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    Enter in 3D <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Book In-Person Visit Banner */}
          <div style={{
            marginTop: '3.5rem',
            background: 'linear-gradient(135deg, var(--primary-950) 0%, var(--primary-900) 100%)',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            boxShadow: '0 16px 40px rgba(11, 37, 69, 0.15)'
          }}>
            <div>
              <span style={{
                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                color: '#D4AF37',
                padding: '0.25rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}>
                Experience Campus In Person
              </span>
              <h3 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#ffffff', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                Schedule an In-Person Campus Tour with Admissions
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.92rem', maxWidth: '600px' }}>
                Walk the corridors with our senior faculty, tour the high-tech laboratories, and receive one-on-one academic counseling for PU Science & Commerce combinations.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-gold">
                Schedule Campus Visit <ArrowRight size={16} />
              </Link>
              <Link to="/admissions" className="btn btn-outline-light">
                Apply For Admission 2026-27
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VirtualTour;
