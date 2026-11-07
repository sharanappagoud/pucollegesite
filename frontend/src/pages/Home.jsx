import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Award, BookOpen, Users, Building, ArrowRight, CheckCircle2,
  Calendar, Newspaper, Sparkles, GraduationCap, ChevronRight, Send,
  Microscope, Cpu, TrendingUp, Calculator, ShieldCheck, HeartHandshake
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { HeroBannerCarousel } from '../components/HeroBannerCarousel';

const defaultCourses = [
  {
    id: 1,
    code: 'PCMB',
    name: 'Physics, Chemistry, Mathematics, Biology',
    stream: 'SCIENCE',
    duration: '2 Years',
    description: 'The ideal combination for aspirants aiming for medicine, biotechnology, healthcare, engineering, and pure sciences. Dual-track NEET & JEE prep.',
    feePerYear: 55000,
    subjects: [{ subjectName: 'Physics' }, { subjectName: 'Chemistry' }, { subjectName: 'Mathematics' }, { subjectName: 'Biology' }]
  },
  {
    id: 2,
    code: 'PCMC',
    name: 'Physics, Chemistry, Mathematics, Computer Science',
    stream: 'SCIENCE',
    duration: '2 Years',
    description: 'Tailored for students targeting premier engineering institutes, data science, and modern technological careers with Python programming.',
    feePerYear: 58000,
    subjects: [{ subjectName: 'Physics' }, { subjectName: 'Chemistry' }, { subjectName: 'Mathematics' }, { subjectName: 'Computer Science' }]
  },
  {
    id: 3,
    code: 'CEBA',
    name: 'Computer Science, Economics, Business Studies, Accountancy',
    stream: 'COMMERCE',
    duration: '2 Years',
    description: 'Modern commerce program integrating financial fundamentals with IT and business analytical tools for banking and fintech.',
    feePerYear: 48000,
    subjects: [{ subjectName: 'Computer Science' }, { subjectName: 'Economics' }, { subjectName: 'Business Studies' }, { subjectName: 'Accountancy' }]
  }
];

const defaultNews = [
  {
    id: 1,
    title: 'Admissions Open for 1st PUC Academic Year 2026-27',
    category: 'Admissions',
    publishedAt: '2026-06-01',
    excerpt: 'Applications are invited for Science (PCMB, PCMC) and Commerce (CEBA, MEBA) combinations. Apply online or visit campus counter.',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=300&q=80',
    slug: 'admissions-open-2026-27'
  },
  {
    id: 2,
    title: 'State Level Science Olympiad: Outstanding Distinction for SVCPUC',
    category: 'Achievements',
    publishedAt: '2026-05-18',
    excerpt: 'Our students secured 1st and 3rd ranks at the Karnataka State Level Pre-University Science Exhibition.',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=300&q=80',
    slug: 'science-olympiad-distinction'
  },
  {
    id: 3,
    title: 'New Modern Robotics & AI Lab Inaugurated on Campus',
    category: 'Facilities',
    publishedAt: '2026-04-10',
    excerpt: 'A state-of-the-art computational laboratory with high-performance computing setups was inaugurated for student research.',
    imageUrl: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=300&q=80',
    slug: 'robotics-ai-lab-inauguration'
  }
];

const defaultEvents = [
  {
    id: 1,
    title: 'First Unit Test Assessment 2026',
    eventDate: '2026-08-01',
    eventTime: '10:00 AM - 11:30 AM',
    location: 'Main Examination Halls',
    status: 'SCHEDULED'
  },
  {
    id: 2,
    title: 'Annual Science & Tech Exhibition "Vidyodaya TechFest"',
    eventDate: '2026-09-15',
    eventTime: '09:30 AM - 04:00 PM',
    location: 'Campus Open Air Auditorium',
    status: 'UPCOMING'
  }
];

const defaultTestimonials = [
  {
    id: 1,
    studentName: 'Ananya Sharma',
    batchYear: 'Batch 2025',
    stream: 'PCMB',
    achievement: 'NEET AIR 482 • MBBS at BMCRI',
    quote: 'The rigorous coaching, daily doubt-clearing sessions, and dedicated teachers at Sri Vidyodaya helped me secure a top medical seat.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 2,
    studentName: 'Rahul Hegde',
    batchYear: 'Batch 2025',
    stream: 'PCMC',
    achievement: 'KCET Rank 142 • B.Tech at RVCE',
    quote: 'The blend of state board curriculum and KCET/JEE preparation under one roof gave me the analytical confidence to crack competitive exams.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 3,
    studentName: 'Sneha Kulkarni',
    batchYear: 'Batch 2025',
    stream: 'CEBA',
    achievement: '98.5% in 2nd PUC Board • CA Foundation Cleared',
    quote: 'Faculty in Accountancy and Business Studies laid a rock-solid foundation that made clearing CA Foundation on my very first attempt effortless.',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
  }
];

const defaultFacilities = [
  {
    id: 1,
    title: 'Physics & Electronics Labs',
    description: 'Precision optical benches, electronic circuit training kits, and board-certified apparatus.',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'Advanced Computer & AI Lab',
    description: 'High-speed gigabit workstations equipped with Python, C++, and database dev environments.',
    imageUrl: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'Central Digital Library',
    description: 'Over 15,000 academic titles, national science journals, and digital e-resource kiosks.',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    title: 'Sports & Wellness Complex',
    description: 'Dedicated courts for badminton, basketball, table tennis, and yoga fitness studio.',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80'
  }
];

export const Home = () => {
  const { user } = useAuth();
  const { collegeName, collegeShortName, navbarBrandName, navbarBrandSub, settings } = useSettings();
  const [courses, setCourses] = useState(defaultCourses);
  const [news, setNews] = useState(defaultNews);
  const [events, setEvents] = useState(defaultEvents);
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [facilities, setFacilities] = useState(defaultFacilities);
  const [enquirySuccess, setEnquirySuccess] = useState(null);
  const [enquiryError, setEnquiryError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const enquirySectionRef = useRef(null);
  const [isEnquiryVisible, setIsEnquiryVisible] = useState(false);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setIsEnquiryVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsEnquiryVisible(true);
          } else if (entry.boundingClientRect.top > 0) {
            // When user scrolls back up above the section, reset so it re-animates smoothly when scrolling down
            setIsEnquiryVisible(false);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    const currentRef = enquirySectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    // Fetch live courses
    api.get('/courses')
      .then(res => {
        if (res.success && res.data?.length > 0) {
          setCourses(res.data);
        }
      })
      .catch(() => { });

    // Fetch live news
    api.get('/news')
      .then(res => {
        if (res.success && res.data?.length > 0) {
          setNews(res.data.slice(0, 3));
        }
      })
      .catch(() => { });

    // Fetch upcoming events
    api.get('/events')
      .then(res => {
        if (res.success && res.data?.length > 0) {
          setEvents(res.data.slice(0, 3));
        }
      })
      .catch(() => { });

    // Fetch testimonials
    api.get('/testimonials')
      .then(res => {
        if (res.success && res.data?.length > 0) {
          setTestimonials(res.data);
        }
      })
      .catch(() => { });

    // Fetch facilities
    api.get('/facilities')
      .then(res => {
        if (res.success && res.data?.length > 0) {
          setFacilities(res.data.slice(0, 4));
        }
      })
      .catch(() => { });
  }, []);

  const onSubmitEnquiry = async (data) => {
    setSubmitting(true);
    setEnquiryError('');
    setEnquirySuccess(null);
    try {
      const payload = {
        studentName: data.studentName,
        parentName: data.parentName,
        studentPhone: data.studentPhone,
        parentPhone: data.parentPhone,
        email: data.email,
        lastCompletedClass: data.lastCompletedClass,
        board: data.board,
        preferredStream: data.preferredStream,
        preferredCombination: data.preferredCombination,
        academicYear: '2026-27',
        address: data.address || '',
        pincode: data.pincode || '',
        referredBy: data.referredBy || '',
        message: data.message || 'Homepage quick enquiry',
        consentGiven: true
      };
      const res = await api.post('/admission-enquiries', payload);
      if (res.success) {
        setEnquirySuccess(res.data);
        reset();
      } else {
        setEnquiryError(res.message || 'Submission failed');
      }
    } catch (err) {
      setEnquiryError(err.message || 'Could not submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Dynamic Hero Banner Owl Carousel (Admin-managed) */}
      <HeroBannerCarousel />

      {/* Statistics Highlights Bar */}
      <section style={{
        marginTop: '-2.5rem',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="container">
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid var(--border-subtle)',
            padding: '2rem 1.5rem'
          }}>
            <div className="grid-4" style={{ textAlign: 'center' }}>
              <div style={{ padding: '0.5rem 1rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-800)', fontFamily: 'var(--font-heading)' }}>
                  98.6%
                </div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  PUC Board Pass Rate
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Consistent Distinction Record</div>
              </div>

              <div style={{ padding: '0.5rem 1rem', borderLeft: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--gold-600)', fontFamily: 'var(--font-heading)' }}>
                  25+
                </div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  Years of Academic Legacy
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Established in 1998</div>
              </div>

              <div style={{ padding: '0.5rem 1rem', borderLeft: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-800)', fontFamily: 'var(--font-heading)' }}>
                  40+
                </div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  State Ranks & Medals
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>In KCET, NEET & State PUC</div>
              </div>

              <div style={{ padding: '0.5rem 1rem', borderLeft: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--gold-600)', fontFamily: 'var(--font-heading)' }}>
                  100%
                </div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  Practical Lab Training
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Individual Stations & Workbenches</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* College Introduction & Principal's Message Section */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '3.5rem' }}>
            <div>
              <span className="section-subtitle">Welcome to Sri Vidyodaya PU College</span>
              <h2 className="section-title">Nurturing Intellectual Excellence & Ethical Values</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '1.05rem', lineHeight: '1.7' }}>
                Sri Vidyodaya Composite Pre-University College stands as one of Bengaluru's premier educational institutions. Established with the vision to deliver high-calibre collegiate education, we foster an environment that combines academic rigor with character building.
              </p>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', lineHeight: '1.7' }}>
                Our integrated curriculum prepares students not only to ace the Karnataka PU State Board examinations but also to crack highly competitive national entrance tests such as NEET, JEE Main, KCET, and CA Foundation without requiring separate external tuition.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                  <CheckCircle2 size={18} color="#059669" /> Experienced Senior Faculty
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                  <CheckCircle2 size={18} color="#059669" /> High-Tech Labs & Digital Classrooms
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                  <CheckCircle2 size={18} color="#059669" /> Integrated Entrance Coaching
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                  <CheckCircle2 size={18} color="#059669" /> Personalized Mentorship & Tracking
                </div>
              </div>

              <Link to="/about" className="btn btn-outline-primary">
                Learn More About Us <ArrowRight size={16} />
              </Link>
            </div>

            {/* Principal Quote Card */}
            {settings?.principal_desk_enabled !== 'false' && (
              <div id="principal-desk" style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                padding: '2.5rem',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-subtle)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  right: '25px',
                  backgroundColor: 'var(--gold-500)',
                  color: 'var(--primary-950)',
                  padding: '0.35rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  letterSpacing: '0.05em',
                  boxShadow: '0 2px 8px rgba(212, 175, 55, 0.4)'
                }}>
                  {settings?.principal_badge_text || "PRINCIPAL'S DESK"}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  <img
                    src={settings?.principal_photo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                    alt={settings?.principal_name || "Principal"}
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
                    }}
                    style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--gold-500)', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', margin: '0 0 0.2rem 0' }}>
                      {settings?.principal_name || "Dr. K. S. Venkatesh"}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                      {settings?.principal_title_line || "M.Sc., M.Phil., Ph.D. | Principal & Professor"}
                    </p>
                  </div>
                </div>

                <blockquote style={{
                  fontStyle: 'italic',
                  color: 'var(--text-muted)',
                  lineHeight: '1.7',
                  borderLeft: '3px solid var(--gold-500)',
                  paddingLeft: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  "{(settings?.principal_quote || "The two years of Pre-University education are the most transformative phase in a student's academic journey. At Sri Vidyodaya PU College, we mentor each student to realize their fullest latent capability, fostering scientific inquiry and disciplined character.")
                    .replace(/\{collegeShortName\}/g, 'Sri Vidyodaya PU College')
                    .replace(/\{collegeName\}/g, 'Sri Vidyodaya Composite Pre-University College')}"
                </blockquote>

                <Link
                  to={settings?.principal_cta_link || "/about#principal-message"}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-700)' }}
                >
                  {settings?.principal_cta_text || "Read Principal's Complete Message"} <ChevronRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Courses & Combinations Section */}
      <section className="section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle">Academic Offerings</span>
            <h2 className="section-title">Pre-University Courses (Science & Commerce)</h2>
            <p className="section-desc">
              Comprehensive two-year programs recognized by the Pre-University Education Board, Karnataka with modern subject combinations tailored for engineering, healthcare, analytics, and business careers.
            </p>
          </div>

          <div className="grid-3">
            {courses.length > 0 ? (
              courses.map(course => (
                <div key={course.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span className={`badge ${course.stream === 'SCIENCE' ? 'badge-science' : 'badge-commerce'}`}>
                      {course.stream} STREAM
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                      {course.duration}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: 'var(--primary-900)' }}>
                    {course.code}
                  </h3>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--primary-700)', marginBottom: '0.75rem' }}>
                    {course.name}
                  </h4>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem', flexGrow: 1 }}>
                    {course.description}
                  </p>

                  <div style={{ backgroundColor: 'var(--bg-page)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Subjects Included:
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-900)' }}>
                      {course.subjects?.map(s => s.subjectName).join(', ') || 'Physics, Chemistry, Maths, Biology'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Annual Fee</span>
                      <div style={{ fontWeight: '700', color: 'var(--primary-900)', fontSize: '1rem' }}>
                        ₹{Number(course.feePerYear || 50000).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <Link to="/admissions" className="btn btn-outline-primary btn-sm">
                      Apply Now <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              // Fallback courses while loading
              [
                { code: 'PCMB', stream: 'SCIENCE', name: 'Physics, Chemistry, Maths, Biology', desc: 'Dual-track preparation for NEET medical and JEE/KCET engineering.' },
                { code: 'PCMC', stream: 'SCIENCE', name: 'Physics, Chem, Maths, Computer Science', desc: 'Cutting-edge training in core sciences and Python programming.' },
                { code: 'CEBA', stream: 'COMMERCE', name: 'Computer Sci, Economics, Business, Accounts', desc: 'Fintech and commercial training with modern IT applications.' }
              ].map((c, i) => (
                <div key={i} className="card">
                  <span className={`badge ${c.stream === 'SCIENCE' ? 'badge-science' : 'badge-commerce'}`}>{c.stream}</span>
                  <h3 style={{ margin: '0.5rem 0' }}>{c.code}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{c.desc}</p>
                </div>
              ))
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/academics" className="btn btn-primary">
              View Detailed Curriculum & Combinations <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Campus Infrastructure Highlights */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle">World-Class Campus</span>
            <h2 className="section-title">Infrastructure & Laboratories</h2>
            <p className="section-desc">
              State-of-the-art physics, chemistry, biology, and computer science laboratories conforming to the highest educational standards.
            </p>
          </div>

          <div className="grid-4">
            {facilities.length > 0 ? (
              facilities.map(facility => (
                <div key={facility.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                  <img
                    src={facility.imageUrl}
                    alt={facility.title}
                    style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '1.25rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--primary-700)', textTransform: 'uppercase' }}>
                      {facility.category}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', margin: '0.4rem 0', color: 'var(--primary-900)' }}>
                      {facility.title}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      {facility.description ? facility.description.substring(0, 95) + '...' : ''}
                    </p>
                  </div>
                </div>
              ))
            ) : null}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/facilities" className="btn btn-outline-primary">
              Explore All Facilities & Laboratories <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Admission Enquiry Section: Left Column = fadeInLeft | Right Form = fadeInRight */}
      <section
        id="quick-enquiry"
        ref={enquirySectionRef}
        className="section section-dark"
      >
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '3.5rem' }}>
            {/* Left Column: Text & Features (animated fadeInLeft) */}
            <div className={isEnquiryVisible ? 'animated fadeInLeft' : 'enquiry-animate-left-ready'}>
              <span className="section-subtitle" style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: 'var(--gold-400)' }}>
                Fast-Track Admissions 2026-27
              </span>
              <h2 className="section-title" style={{ color: '#ffffff' }}>
                Begin Your Journey With Sri Vidyodaya Composite PU College
              </h2>
              <p style={{ color: '#cbd5e1', marginBottom: '1.75rem', lineHeight: '1.7', fontSize: '1.05rem' }}>
                Submit this quick enquiry form to reserve your seat or request personalized academic counselling. Our admissions coordinator will reach out to you within 24 working hours.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#cbd5e1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ShieldCheck size={20} color="var(--gold-400)" />
                  <span>Merit-based scholarships available for students scoring &gt; 90% in 10th Board.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle2 size={20} color="var(--gold-400)" />
                  <span>Direct interaction with stream heads for subject combination selection.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <HeartHandshake size={20} color="var(--gold-400)" />
                  <span>Free sample test series and counselling session for KCET & NEET aspirants.</span>
                </div>
              </div>
            </div>

            {/* Right Column: Online Form Container (animated fadeInRight) */}
            <div
              className={isEnquiryVisible ? 'animated fadeInRight' : 'enquiry-animate-right-ready'}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                padding: '2.25rem',
                color: 'var(--text-main)',
                boxShadow: 'var(--shadow-xl)'
              }}
            >
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.25rem', color: 'var(--primary-900)' }}>
                Online Admission Enquiry
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Fill in the details below to generate an instant enquiry reference number.
              </p>

              {enquirySuccess ? (
                <div style={{
                  backgroundColor: '#ecfdf5',
                  border: '1.5px solid #059669',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  textAlign: 'center'
                }}>
                  <CheckCircle2 size={42} color="#059669" style={{ margin: '0 auto 0.75rem auto' }} />
                  <h4 style={{ color: '#065f46', fontSize: '1.15rem' }}>Enquiry Submitted Successfully!</h4>
                  <p style={{ fontSize: '0.9rem', color: '#047857', marginTop: '0.5rem' }}>
                    Your reference number is:
                  </p>
                  <div style={{
                    fontSize: '1.4rem',
                    fontWeight: '800',
                    color: '#065f46',
                    letterSpacing: '0.05em',
                    backgroundColor: '#d1fae5',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    margin: '0.75rem 0'
                  }}>
                    {enquirySuccess.referenceNo}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#065f46' }}>
                    Please save this reference number. Our admissions desk will contact you at {enquirySuccess.studentPhone}.
                  </p>
                  <button
                    onClick={() => setEnquirySuccess(null)}
                    className="btn btn-outline-primary btn-sm"
                    style={{ marginTop: '1rem' }}
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmitEnquiry)}>
                  {enquiryError && (
                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                      {enquiryError}
                    </div>
                  )}

                  <div className="grid-2" style={{ gap: '0.75rem' }}>
                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label">Student Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Rohith Rao"
                        {...register('studentName', { required: 'Student name is required' })}
                      />
                      {errors.studentName && <span className="form-error">{errors.studentName.message}</span>}
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label">Parent / Guardian Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Suresh Rao"
                        {...register('parentName', { required: 'Parent name is required' })}
                      />
                      {errors.parentName && <span className="form-error">{errors.parentName.message}</span>}
                    </div>
                  </div>

                  <div className="grid-2" style={{ gap: '0.75rem' }}>
                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label">Student Mobile *</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="10-digit number"
                        {...register('studentPhone', { required: 'Student phone is required' })}
                      />
                      {errors.studentPhone && <span className="form-error">{errors.studentPhone.message}</span>}
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label">Parent Mobile *</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="10-digit number"
                        {...register('parentPhone', { required: 'Parent phone is required' })}
                      />
                      {errors.parentPhone && <span className="form-error">{errors.parentPhone.message}</span>}
                    </div>
                  </div>

                  <div className="grid-2" style={{ gap: '0.75rem' }}>
                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="student@example.com"
                        {...register('email', { required: 'Email is required' })}
                      />
                      {errors.email && <span className="form-error">{errors.email.message}</span>}
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label">10th / SSLC Board *</label>
                      <select className="form-select" {...register('board', { required: 'Select board' })}>
                        <option value="Karnataka State Board">Karnataka State Board (SSLC)</option>
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="Other">Other State / International Board</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid-2" style={{ gap: '0.75rem' }}>
                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label">Preferred Stream *</label>
                      <select className="form-select" {...register('preferredStream', { required: 'Select stream' })}>
                        <option value="SCIENCE">Science</option>
                        <option value="COMMERCE">Commerce</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label">Subject Combination *</label>
                      <select className="form-select" {...register('preferredCombination', { required: 'Select combination' })}>
                        <option value="PCMB">PCMB (Physics, Chem, Maths, Bio)</option>
                        <option value="PCMC">PCMC (Physics, Chem, Maths, CS)</option>
                        <option value="CEBA">CEBA (CS, Econ, Business, Accounts)</option>
                        <option value="MEBA">MEBA (Basic Maths, Econ, Business, Accounts)</option>
                        <option value="SEBA">SEBA (Stats, Econ, Business, Accounts)</option>
                        <option value="MSBA">MSBA (Basic Maths, Stats, Business, Accounts)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid-2" style={{ gap: '0.75rem' }}>
                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label">Residential Address</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Village / Town / City"
                        {...register('address')}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label">Pincode</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="6-digit Pincode"
                        maxLength="10"
                        {...register('pincode')}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label">Referred By / Reference</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Friend, Staff, Newspaper, Social Media, etc."
                      {...register('referredBy')}
                    />
                  </div>

                  <input type="hidden" value="10th Standard" {...register('lastCompletedClass')} />

                  <div style={{ marginTop: '1.25rem' }}>
                    <button type="submit" disabled={submitting} className="btn btn-gold" style={{ width: '100%' }}>
                      {submitting ? 'Submitting Enquiry...' : 'Submit Enquiry & Get Reference Number'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Latest News & Upcoming Events Section */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '3rem' }}>
            {/* News Column */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>Latest College News</h3>
                <Link to="/news" style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-700)' }}>
                  View All News &rarr;
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {news.map(article => (
                  <div key={article.id} style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    transition: 'transform 0.15s ease'
                  }}>
                    <img
                      src={article.imageUrl || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=300&q=80"}
                      alt={article.title}
                      style={{ width: '90px', height: '80px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--gold-600)', textTransform: 'uppercase' }}>
                        {article.category || 'Academics'} • {article.publishedAt}
                      </span>
                      <h4 style={{ fontSize: '0.98rem', margin: '0.25rem 0', color: 'var(--primary-900)' }}>
                        <Link to={`/news#${article.slug}`} style={{ color: 'inherit' }}>{article.title}</Link>
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                        {article.excerpt ? article.excerpt.substring(0, 90) + '...' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events Column */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>Upcoming Events</h3>
                <Link to="/news" style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-700)' }}>
                  Event Calendar &rarr;
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {events.map(ev => (
                  <div key={ev.id} style={{
                    display: 'flex',
                    gap: '1.25rem',
                    alignItems: 'center',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-page)'
                  }}>
                    <div style={{
                      backgroundColor: 'var(--primary-800)',
                      color: '#ffffff',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      textAlign: 'center',
                      minWidth: '65px',
                      flexShrink: 0
                    }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', lineHeight: '1' }}>
                        {ev.eventDate ? ev.eventDate.split('-')[2] : '15'}
                      </div>
                      <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--gold-400)' }}>
                        {ev.eventDate ? new Date(ev.eventDate).toLocaleString('default', { month: 'short' }) : 'AUG'}
                      </div>
                    </div>

                    <div style={{ flexGrow: 1 }}>
                      <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#15803d', marginBottom: '0.25rem' }}>
                        {ev.status || 'UPCOMING'}
                      </span>
                      <h4 style={{ fontSize: '1rem', margin: '0.2rem 0', color: 'var(--primary-900)' }}>{ev.title}</h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        🕒 {ev.eventTime || '10:00 AM'} | 📍 {ev.location || 'Campus Auditorium'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student & Alumni Testimonials */}
      <section className="section" style={{ backgroundColor: 'var(--bg-page)' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle">Student Testimonials</span>
            <h2 className="section-title">Words From Our Alumni & Achievers</h2>
          </div>

          <div className="grid-3">
            {testimonials.map(t => (
              <div key={t.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem', flexGrow: 1 }}>
                  "{t.quote}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <img
                    src={t.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                    alt={t.studentName}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h5 style={{ fontSize: '0.95rem', color: 'var(--primary-900)' }}>{t.studentName}</h5>
                    <p style={{ fontSize: '0.78rem', color: 'var(--gold-600)', fontWeight: '600' }}>{t.batchYear} • {t.stream}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.achievement}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
