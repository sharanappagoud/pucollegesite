import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  BookOpen, Microscope, Cpu, TrendingUp, Calculator, 
  BarChart3, PieChart, CheckCircle2, Calendar, Award, ArrowRight 
} from 'lucide-react';
import api from '../services/api';

const defaultCourses = [
  {
    id: 1,
    code: 'PCMB',
    name: 'Physics, Chemistry, Mathematics, Biology',
    stream: 'SCIENCE',
    duration: '2 Years',
    description: 'Premier combination for medicine, surgery, bio-engineering, biotechnology, pharmacy, and multidisciplinary scientific careers.',
    eligibility: 'Pass in 10th Standard / SSLC / CBSE / ICSE or equivalent with minimum 60% aggregate in Science and Mathematics.',
    careerProspects: 'MBBS, BDS, B.V.Sc, B.Pharm, Biotechnology, Pure Science Research (IISc/IISER), Biomedical Engineering.',
    feePerYear: 65000,
    subjects: [
      { id: 101, subjectName: 'Physics', isCore: true },
      { id: 102, subjectName: 'Chemistry', isCore: true },
      { id: 103, subjectName: 'Mathematics', isCore: true },
      { id: 104, subjectName: 'Biology', isCore: true },
      { id: 105, subjectName: 'English', isCore: false },
      { id: 106, subjectName: 'Kannada / Hindi / Sanskrit', isCore: false },
    ]
  },
  {
    id: 2,
    code: 'PCMC',
    name: 'Physics, Chemistry, Mathematics, Computer Science',
    stream: 'SCIENCE',
    duration: '2 Years',
    description: 'Engineered for aspiring computer scientists, software architects, AI engineers, and hardware specialists with Python & C++ practicals.',
    eligibility: 'Pass in 10th Standard / SSLC / CBSE / ICSE with high proficiency in Mathematics and Physical Sciences.',
    careerProspects: 'B.E. / B.Tech in Computer Science, Artificial Intelligence, Data Science, Cyber Security, Robotics, B.Sc. IT.',
    feePerYear: 70000,
    subjects: [
      { id: 201, subjectName: 'Physics', isCore: true },
      { id: 202, subjectName: 'Chemistry', isCore: true },
      { id: 203, subjectName: 'Mathematics', isCore: true },
      { id: 204, subjectName: 'Computer Science', isCore: true },
      { id: 205, subjectName: 'English', isCore: false },
      { id: 206, subjectName: 'Kannada / Hindi / Sanskrit', isCore: false },
    ]
  },
  {
    id: 3,
    code: 'CEBA',
    name: 'Computer Science, Economics, Business Studies, Accountancy',
    stream: 'COMMERCE',
    duration: '2 Years',
    description: 'Tailored for tech-savvy finance leaders, fintech innovators, corporate analysts, and modern chartered accountants.',
    eligibility: 'Pass in 10th Standard / SSLC / CBSE / ICSE with minimum 55% aggregate marks.',
    careerProspects: 'B.Com, BBA (FinTech), Chartered Accountancy (CA), CS, Corporate Law, Financial Risk Management, Banking.',
    feePerYear: 55000,
    subjects: [
      { id: 301, subjectName: 'Computer Science', isCore: true },
      { id: 302, subjectName: 'Economics', isCore: true },
      { id: 303, subjectName: 'Business Studies', isCore: true },
      { id: 304, subjectName: 'Accountancy', isCore: true },
      { id: 305, subjectName: 'English', isCore: false },
      { id: 306, subjectName: 'Kannada / Hindi / Sanskrit', isCore: false },
    ]
  },
  {
    id: 4,
    code: 'MEBA',
    name: 'Basic Maths, Economics, Business Studies, Accountancy',
    stream: 'COMMERCE',
    duration: '2 Years',
    description: 'Classic analytical business combination blending commercial arithmetic with economic theories and auditing principles.',
    eligibility: 'Pass in 10th Standard / SSLC / CBSE / ICSE or equivalent examination.',
    careerProspects: 'Chartered Accountancy (CA), Cost & Management Accounting (CMA), B.Com (Honours), Investment Banking, Civil Services.',
    feePerYear: 52000,
    subjects: [
      { id: 401, subjectName: 'Basic Mathematics', isCore: true },
      { id: 402, subjectName: 'Economics', isCore: true },
      { id: 403, subjectName: 'Business Studies', isCore: true },
      { id: 404, subjectName: 'Accountancy', isCore: true },
      { id: 405, subjectName: 'English', isCore: false },
      { id: 406, subjectName: 'Kannada / Hindi / Sanskrit', isCore: false },
    ]
  }
];

const defaultCalendar = [
  { id: 1, eventName: 'Commencement of 1st PUC Academic Session', eventDate: '2026-06-15', category: 'ACADEMIC', description: 'Orientation program and stream distribution.' },
  { id: 2, eventName: 'First Unit Test Assessment Series', eventDate: '2026-08-01', category: 'EXAMINATION', description: 'Internal assessment on foundational units.' },
  { id: 3, eventName: 'Mid-Term Examinations 2026', eventDate: '2026-10-12', category: 'EXAMINATION', description: 'Comprehensive mid-year evaluations across all subjects.' },
  { id: 4, eventName: 'Annual Sports & Athletic Meet', eventDate: '2026-11-20', category: 'SPORTS', description: 'Track events, inter-class tournaments, and team relays.' },
  { id: 5, eventName: 'Preparatory Board Examinations', eventDate: '2027-01-18', category: 'EXAMINATION', description: 'Full syllabus mock board examinations.' },
  { id: 6, eventName: 'Karnataka State PU Annual Board Exams', eventDate: '2027-03-01', category: 'EXAMINATION', description: 'Final Karnataka School Examination and Assessment Board (KSEAB) examinations.' }
];

export const Academics = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStream = searchParams.get('stream') || 'ALL';
  const [activeStream, setActiveStream] = useState(initialStream);
  const [courses, setCourses] = useState(defaultCourses);
  const [calendar, setCalendar] = useState(defaultCalendar);

  useEffect(() => {
    const streamFromUrl = searchParams.get('stream') || 'ALL';
    setActiveStream(streamFromUrl);
  }, [searchParams]);

  useEffect(() => {
    const streamParam = activeStream === 'ALL' ? '' : `?stream=${activeStream}`;
    api.get(`/courses${streamParam}`)
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setCourses(res.data);
        } else {
          if (activeStream === 'ALL') {
            setCourses(defaultCourses);
          } else {
            setCourses(defaultCourses.filter(c => c.stream === activeStream));
          }
        }
      })
      .catch(() => {
        if (activeStream === 'ALL') {
          setCourses(defaultCourses);
        } else {
          setCourses(defaultCourses.filter(c => c.stream === activeStream));
        }
      });
  }, [activeStream]);

  useEffect(() => {
    api.get('/calendar?year=2026-27')
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setCalendar(res.data);
        } else {
          setCalendar(defaultCalendar);
        }
      })
      .catch(() => setCalendar(defaultCalendar));
  }, []);

  const handleStreamChange = (stream) => {
    setActiveStream(stream);
    setSearchParams(stream === 'ALL' ? {} : { stream });
  };

  return (
    <div>
      {/* Header Banner */}
      <section style={{
        background: 'linear-gradient(rgba(7, 23, 44, 0.9), rgba(11, 37, 69, 0.94)), url("https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        padding: '4.5rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <span className="section-subtitle" style={{ backgroundColor: 'rgba(212,175,55,0.2)', color: 'var(--gold-400)' }}>
            Academic Programs & Curriculum
          </span>
          <h1 style={{ fontSize: '2.75rem', color: '#ffffff', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Pre-University Education (1st & 2nd PUC)
          </h1>
          <p style={{ maxWidth: '680px', margin: '0 auto', color: '#cbd5e1', fontSize: '1.05rem' }}>
            Two-year state board syllabus integrated with CET, NEET, JEE, and CA Foundation coaching for high-achievement careers.
          </p>
        </div>
      </section>

      {/* Program Structure Overview */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle">Academic Blueprint</span>
            <h2 className="section-title">Karnataka PU Board Academic Architecture</h2>
            <p className="section-desc">
              The Pre-University course is a pivotal 2-year bridge program consisting of Part-I (Languages) and Part-II (Core Discipline Combinations).
            </p>
          </div>

          <div className="grid-2" style={{ gap: '2rem' }}>
            <div className="card" style={{ borderLeft: '4px solid var(--primary-700)' }}>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--primary-900)' }}>
                Part I: Languages
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1rem' }}>
                Every student studies two compulsory languages:
              </p>
              <ul style={{ listStyle: 'none', color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.8' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#059669" /> <strong>Language 1:</strong> English (Compulsory)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#059669" /> <strong>Language 2:</strong> Kannada / Hindi / Sanskrit (Choice based)
                </li>
              </ul>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--gold-500)' }}>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--primary-900)' }}>
                Part II: Core Optionals
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1rem' }}>
                Four core subjects determined by the chosen stream and combination:
              </p>
              <ul style={{ listStyle: 'none', color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.8' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#b8860b" /> <strong>Science Stream:</strong> PCMB, PCMC
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#b8860b" /> <strong>Commerce Stream:</strong> CEBA, MEBA, SEBA, MSBA
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Course Combinations & Filter Tabs */}
      <section id="combinations" className="section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleStreamChange('ALL')}
              className={`btn ${activeStream === 'ALL' ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              All Combinations
            </button>
            <button
              onClick={() => handleStreamChange('SCIENCE')}
              className={`btn ${activeStream === 'SCIENCE' ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              Science Combinations (PCMB, PCMC)
            </button>
            <button
              onClick={() => handleStreamChange('COMMERCE')}
              className={`btn ${activeStream === 'COMMERCE' ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              Commerce Combinations (CEBA, MEBA, SEBA, MSBA)
            </button>
          </div>

          <div className="grid-2" style={{ gap: '2rem' }}>
            {courses.map(course => (
              <div key={course.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className={`badge ${course.stream === 'SCIENCE' ? 'badge-science' : 'badge-commerce'}`}>
                    {course.stream} STREAM
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-800)' }}>
                    {course.duration}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.45rem', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>
                  {course.code}
                </h3>
                <h4 style={{ fontSize: '1.02rem', fontWeight: '600', color: 'var(--primary-700)', marginBottom: '1rem' }}>
                  {course.name}
                </h4>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                  {course.description}
                </p>

                <div style={{ marginBottom: '1rem' }}>
                  <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Subjects:
                  </h5>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {course.subjects?.map(s => (
                      <span key={s.id} style={{
                        backgroundColor: s.isCore ? '#eff6ff' : '#f1f5f9',
                        color: s.isCore ? '#1e40af' : '#475569',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {s.subjectName}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Eligibility:
                  </h5>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>
                    {course.eligibility}
                  </p>
                </div>

                <div style={{ marginBottom: '1.5rem', flexGrow: 1 }}>
                  <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Career & Higher Education Prospects:
                  </h5>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                    {course.careerProspects}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Annual Fee</span>
                    <div style={{ fontWeight: '800', color: 'var(--primary-900)', fontSize: '1.1rem' }}>
                      ₹{Number(course.feePerYear || 50000).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <Link to="/admissions#enquiry-form" className="btn btn-gold btn-sm">
                    Enquire for {course.code} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrated Coaching Section */}
      <section id="coaching" className="section">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle">Competitive Edge</span>
            <h2 className="section-title">Integrated CET, NEET, JEE & CA Foundation Coaching</h2>
            <p className="section-desc">
              Save precious travel time and mental fatigue with our on-campus integrated morning and weekend preparatory coaching modules.
            </p>
          </div>

          <div className="grid-3">
            <div className="card">
              <div style={{ width: '46px', height: '46px', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Microscope size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary-900)' }}>NEET (Medical)</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1rem' }}>
                In-depth line-by-line NCERT Biology mastery, organic synthesis diagrams, optical physics calculations, and 200+ simulated NEET mock speed tests.
              </p>
              <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>Top Score: 672/720</span>
            </div>

            <div className="card">
              <div style={{ width: '46px', height: '46px', backgroundColor: '#fef3c7', color: '#b45309', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Cpu size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary-900)' }}>KCET & JEE Mains</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1rem' }}>
                Rigorous calculus derivations, electrostatic potential shortcuts, periodic trends, and past 15-year state & national question paper analysis.
              </p>
              <span className="badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>KCET State Rank 9th</span>
            </div>

            <div className="card">
              <div style={{ width: '46px', height: '46px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <TrendingUp size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary-900)' }}>CA Foundation</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1rem' }}>
                Conducted by practicing Chartered Accountants covering Principles of Accounting, Mercantile Law, Business Mathematics, and Economics.
              </p>
              <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>95% Batch Pass Percentage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Calendar Milestones */}
      <section id="calendar" className="section section-dark">
        <div className="container">
          <div className="section-title-wrap dark">
            <span className="section-subtitle">Important Dates</span>
            <h2 className="section-title">Academic Year Calendar 2026-27</h2>
          </div>

          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event / Milestone</th>
                  <th>Category</th>
                  <th>Commencement Date</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {calendar.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: '700', color: 'var(--primary-900)' }}>{item.eventTitle}</td>
                    <td>
                      <span className="badge" style={{
                        backgroundColor: item.category === 'EXAMINATION' ? '#fee2e2' : item.category === 'HOLIDAY' ? '#fef3c7' : '#e0f2fe',
                        color: item.category === 'EXAMINATION' ? '#991b1b' : item.category === 'HOLIDAY' ? '#92400e' : '#075985'
                      }}>
                        {item.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: '600' }}>{item.startDate} {item.endDate ? `to ${item.endDate}` : ''}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
