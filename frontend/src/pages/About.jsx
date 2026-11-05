import React from 'react';
import { Target, Compass, BookOpen, Award, CheckCircle2, Shield, Users, Heart, Building2, GraduationCap, Briefcase } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const About = () => {
  const { collegeName, collegeShortName, settings } = useSettings();

  return (
    <div>
      {/* Page Header Banner */}
      <section style={{
        background: 'linear-gradient(rgba(7, 23, 44, 0.9), rgba(11, 37, 69, 0.94)), url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        padding: '4.5rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <span className="section-subtitle" style={{ backgroundColor: 'rgba(212,175,55,0.2)', color: 'var(--gold-400)' }}>
            Institution Overview
          </span>
          <h1 style={{ fontSize: '2.75rem', color: '#ffffff', marginTop: '0.5rem', marginBottom: '1rem' }}>
            About Sri Vidyodaya Composite Pre-University College
          </h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', color: '#cbd5e1', fontSize: '1.05rem' }}>
            {settings.college_tagline || 'Inspiring academic rigor, intellectual curiosity, and ethical responsibility in Pre-University students.'}
          </p>
        </div>
      </section>

      {/* College History */}
      <section id="history" className="section">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '3.5rem' }}>
            <div>
              <span className="section-subtitle">Our Journey</span>
              <h2 className="section-title">A Legacy of Academic Brilliance</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.7' }}>
                Sri Vidyodaya Composite Pre-University College was established with a singular mission: to provide high quality, disciplined, and accessible pre-university education.
              </p>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.7' }}>
                Recognized by the Department of Pre-University Education, Government of Karnataka, Sri Vidyodaya PU College (SVCPUC) has grown from humble beginnings into a distinguished center of learning boasting state-of-the-art physics, chemistry, biology, and computer science laboratories, a digital library, and an enviable faculty roster.
              </p>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '2rem', color: 'var(--primary-800)', fontWeight: '800' }}>2,800+</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Alumni Placed in Premier Institutes</p>
                </div>
                <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '2rem' }}>
                  <h3 style={{ fontSize: '2rem', color: 'var(--gold-600)', fontWeight: '800' }}>100%</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Commitment to Holistic Grooming</p>
                </div>
              </div>
            </div>

            <div>
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"
                alt="College Campus"
                style={{ width: '100%', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section id="vision-mission" className="section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle">Our Purpose</span>
            <h2 className="section-title">Vision & Mission</h2>
          </div>

          <div className="grid-2" style={{ gap: '2.5rem' }}>
            <div className="card" style={{ borderTop: '4px solid var(--primary-700)', padding: '2.5rem' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Compass size={28} />
              </div>
              <h3 style={{ fontSize: '1.45rem', marginBottom: '1rem', color: 'var(--primary-900)' }}>Our Vision</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.02rem' }}>
                "To emerge as a benchmark institution in Pre-University education, empowering students through conceptual academic mastery, scientific temperament, digital proficiency, and ethical leadership to build a progressive global society."
              </p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--gold-500)', padding: '2.5rem' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: 'var(--gold-100)', color: 'var(--gold-600)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Target size={28} />
              </div>
              <h3 style={{ fontSize: '1.45rem', marginBottom: '1rem', color: 'var(--primary-900)' }}>Our Mission</h3>
              <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', listStyle: 'none' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={18} color="var(--gold-600)" style={{ flexShrink: 0, marginTop: '4px' }} />
                  Deliver in-depth conceptual clarity in Science and Commerce curricula.
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={18} color="var(--gold-600)" style={{ flexShrink: 0, marginTop: '4px' }} />
                  Provide world-class laboratory, computer, and digital library facilities.
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={18} color="var(--gold-600)" style={{ flexShrink: 0, marginTop: '4px' }} />
                  Foster critical thinking and prepare students for CET, NEET, JEE, and CA Foundation.
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="var(--gold-600)" style={{ flexShrink: 0, marginTop: '4px' }} />
                  Inculcate social sensitivity, moral values, and civic responsibility.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Principal's Message Section */}
      <section id="principal-message" className="section">
        <div className="container">
          <div className="card" style={{ padding: '3rem', maxWidth: '1000px', margin: '0 auto', boxShadow: 'var(--shadow-lg)' }}>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2rem' }}>
              <img
                src={settings?.principal_photo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=220&q=80"}
                alt={settings?.principal_name || "Principal"}
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=220&q=80";
                }}
                style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--gold-500)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <div>
                <span className="section-subtitle">Leadership Message</span>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--primary-900)', margin: '0.2rem 0' }}>
                  {settings?.principal_name || "Dr. K. S. Venkatesh"}
                </h3>
                <p style={{ color: 'var(--primary-700)', fontWeight: '600', margin: '0 0 0.3rem 0' }}>
                  {settings?.principal_title_line || "M.Sc., M.Phil., Ph.D. (IISc) | Principal & Professor"}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                  {settings?.principal_accolade || "Recipient of the State Best Teacher Accolade (2019)"}
                </p>
              </div>
            </div>

            <div style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.02rem' }}>
              {settings?.principal_full_message ? (
                settings.principal_full_message.split('\n\n').map((para, i) => (
                  <p key={i} style={{ marginBottom: '1rem' }}>
                    {para.replace(/\{collegeShortName\}/g, collegeShortName || 'SVCPUC').replace(/\{collegeName\}/g, collegeName || 'our institution')}
                  </p>
                ))
              ) : (
                <>
                  <p style={{ marginBottom: '1rem' }}>
                    Dear Students, Parents, and Well-Wishers,
                  </p>
                  <p style={{ marginBottom: '1rem' }}>
                    Pre-University education is the critical watershed of higher secondary learning in India. The decisions made during these crucial two years define future trajectories in medicine, engineering, pure research, chartered accountancy, corporate finance, and administration.
                  </p>
                  <p style={{ marginBottom: '1rem' }}>
                    At Sri Vidyodaya Composite Pre-University College, we have engineered an academic framework that balances the state board requirements with rigorous competitive problem solving. Our faculty members are not merely teachers; they are empathetic mentors who monitor every student's learning pace, identify strengths, and provide remedial handholding whenever required.
                  </p>
                  <p>
                    I warmly invite you to visit our campus, interact with our teaching staff, and experience the vibrant learning atmosphere that sets Sri Vidyodaya PU College apart.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Values */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-title-wrap dark">
            <span className="section-subtitle">The Pillars of Our Ethos</span>
            <h2 className="section-title">Core Institutional Values</h2>
          </div>

          <div className="grid-4">
            <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}>
              <Shield size={32} color="var(--gold-400)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Integrity & Ethics</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Uncompromising commitment to honesty, transparency, and academic ethics in every endeavor.</p>
            </div>

            <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}>
              <BookOpen size={32} color="var(--gold-400)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Intellectual Inquiry</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Encouraging inquisitive questions, scientific skepticism, and analytical problem-solving skills.</p>
            </div>

            <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}>
              <Users size={32} color="var(--gold-400)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Inclusivity & Empathy</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Welcoming learners from diverse backgrounds and ensuring personalized support for every pupil.</p>
            </div>

            <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}>
              <Award size={32} color="var(--gold-400)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Pursuit of Excellence</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Relentless drive for distinction in examinations, competitive tests, sports, and cultural arts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Board of Management & Governing Council */}
      <section id="management" className="section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle">Institutional Governance</span>
            <h2 className="section-title">Board of Management & Governing Council</h2>
            <p className="section-desc">
              Eminent academicians, visionary philanthropists, and seasoned administrators guiding Sri Vidyodaya Composite PU College towards holistic collegiate excellence.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '2rem' }}>
            <div className="card" style={{ borderTop: '4px solid var(--primary-800)', textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <Building2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>Sri B. S. Vishwanath</h3>
              <p style={{ color: 'var(--gold-600)', fontWeight: '700', fontSize: '0.88rem', marginBottom: '0.75rem' }}>President & Founder Trustee</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Veteran industrialist and educationist championing modern educational infrastructure and affordable scholarship endowments across Karnataka.
              </p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--gold-500)', textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'var(--gold-100)', color: 'var(--gold-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <Users size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>Smt. Shantha Venkatesh</h3>
              <p style={{ color: 'var(--gold-600)', fontWeight: '700', fontSize: '0.88rem', marginBottom: '0.75rem' }}>Vice President & Secretary</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Devoted to institutional culture, girl-child empowerment in STEM, student welfare policies, and collegiate extracurricular ecosystems.
              </p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--primary-700)', textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <GraduationCap size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>Dr. K. S. Venkatesh</h3>
              <p style={{ color: 'var(--gold-600)', fontWeight: '700', fontSize: '0.88rem', marginBottom: '0.75rem' }}>Principal & Member Secretary</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                M.Sc., M.Phil., Ph.D. Oversees academic standards, competitive examination coaching, board liaison, and faculty excellence initiatives.
              </p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--primary-600)', textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <Award size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>Prof. R. G. Narayanaswamy</h3>
              <p style={{ color: 'var(--gold-600)', fontWeight: '700', fontSize: '0.88rem', marginBottom: '0.75rem' }}>Academic Advisor (Ex-Director, PU Board)</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Former Joint Director of Pre-University Board providing strategic guidance on curricula compliance and pedagogical assessments.
              </p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--gold-600)', textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'var(--gold-100)', color: 'var(--gold-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <Briefcase size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>Sri M. C. Krishna Murthy</h3>
              <p style={{ color: 'var(--gold-600)', fontWeight: '700', fontSize: '0.88rem', marginBottom: '0.75rem' }}>Treasurer & Financial Trustee</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Chartered Accountant ensuring statutory transparency, sound endowment management, and equitable fee concessions for deserving pupils.
              </p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--primary-800)', textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <Heart size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>Smt. Geetha R. Hegde</h3>
              <p style={{ color: 'var(--gold-600)', fontWeight: '700', fontSize: '0.88rem', marginBottom: '0.75rem' }}>Trustee & Senior Educationist</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Former collegiate professor advising on student counselling, value-based mentoring, and parent-teacher collaboration forums.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
