import React from 'react';
import { 
  Trophy, Sparkles, Heart, Users, Compass, 
  Tv, Cpu, Leaf, BookOpen, Music, CheckCircle2 
} from 'lucide-react';

export const StudentLife = () => {
  return (
    <div>
      {/* Banner */}
      <section style={{
        background: 'linear-gradient(rgba(7, 23, 44, 0.9), rgba(11, 37, 69, 0.94)), url("https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        padding: '4.5rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <span className="section-subtitle" style={{ backgroundColor: 'rgba(212,175,55,0.2)', color: 'var(--gold-400)' }}>
            Vibrant Campus Culture
          </span>
          <h1 style={{ fontSize: '2.75rem', color: '#ffffff', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Student Life, Clubs & Achievements
          </h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', color: '#cbd5e1', fontSize: '1.05rem' }}>
            Beyond classroom textbooks: fostering leadership, creativity, sportsmanship, and civic empathy.
          </p>
        </div>
      </section>

      {/* Pratibha Cultural Fest */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '3.5rem' }}>
            <div>
              <span className="section-subtitle">Flagship Cultural Festival</span>
              <h2 className="section-title">'Pratibha' Annual Inter-Collegiate Cultural Fest</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.7' }}>
                Every winter, the SVCPUC quadrangle comes alive with 'Pratibha', our flagship two-day cultural festival. The extravaganza brings together more than 1,200 students across 40 Pre-University colleges in Karnataka to celebrate performing arts, literature, and youth camaraderie.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <Music size={18} color="var(--primary-700)" /> Classical & Western Dance
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <Tv size={18} color="var(--primary-700)" /> Street Plays & Mime Skits
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <BookOpen size={18} color="var(--primary-700)" /> Literary Debates & Quizzes
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <Sparkles size={18} color="var(--primary-700)" /> Fashion Pageant & Fine Arts
                </div>
              </div>
            </div>

            <div>
              <img
                src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80"
                alt="Cultural Fest"
                style={{ width: '100%', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Student Clubs Section */}
      <section className="section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle">Co-Curricular Exploration</span>
            <h2 className="section-title">Active Student Clubs & Societies</h2>
          </div>

          <div className="grid-3">
            <div className="card">
              <div style={{ width: '44px', height: '44px', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Cpu size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary-900)' }}>
                Turing Tech & Robotics Club
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Hands-on weekend bootcamps on Python programming, microcontrollers (Arduino/Raspberry Pi), algorithmic logic, and web design.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '44px', height: '44px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Leaf size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary-900)' }}>
                Vriksha Eco & Sustainability Club
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Leading on-campus rainwater harvesting audits, sapling plantation drives, e-waste recycling campaigns, and environmental awareness tours.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '44px', height: '44px', backgroundColor: '#fef3c7', color: '#b45309', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Heart size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary-900)' }}>
                Youth Red Cross & NSS Wing
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Instilling humanitarian service through annual blood donation camps, first-aid certifications, and rural education outreach camps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sports & Athletics */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '3.5rem' }}>
            <img
              src="https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80"
              alt="Basketball Tournament"
              style={{ width: '100%', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)' }}
            />

            <div>
              <span className="section-subtitle">Physical Fitness</span>
              <h2 className="section-title">Sports & Athletic Excellence</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.7' }}>
                A sound mind resides in a sound body. SVCPUC encourages regular physical activity through full-time coaches, structured training schedules, and district level tournament participation.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem' }}>
                  <Trophy size={18} color="var(--gold-600)" />
                  <span>Bangalore North District PU Basketball Champions (2024 & 2025)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem' }}>
                  <Trophy size={18} color="var(--gold-600)" />
                  <span>State Level Badminton Championship Silver Medalist in Boys Singles</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem' }}>
                  <Trophy size={18} color="var(--gold-600)" />
                  <span>Annual Inter-Class Cricket Tournament 'Vidyodaya Trophy'</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
