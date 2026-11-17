import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Calendar, Download, Search, CheckCircle2, AlertTriangle,
  HelpCircle, Phone, Mail, MapPin, Clock, Award, ShieldCheck, ChevronDown,
  ChevronRight, Lock, UserCheck, ExternalLink, Filter, GraduationCap,
  BookOpen, Sparkles, RefreshCw, X, Edit2
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { WhatsAppButton } from '../components/WhatsAppButton';

export const Examinations = () => {
  const { isAuthenticated, user } = useAuth();
  const [examinations, setExaminations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedClass, setSelectedClass] = useState('ALL'); // 'ALL' | '1st PUC' | '2nd PUC'
  const [selectedStream, setSelectedStream] = useState('ALL'); // 'ALL' | 'SCIENCE' | 'COMMERCE'
  const [selectedYear, setSelectedYear] = useState('ALL');

  // FAQs Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  // Student Authentication / Hall Ticket Verification Modal
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authForm, setAuthForm] = useState({ registerNo: '', dob: '' });
  const [authResult, setAuthResult] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Fetch published examinations from backend
  const fetchExaminations = () => {
    setLoading(true);
    setError(null);
    api.get('/examinations')
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          setExaminations(res.data);
        } else {
          setExaminations([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch examinations:', err);
        setError('Unable to load real-time examination schedules. Showing official institutional circulars.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchExaminations();
  }, []);

  const getExamAnchorId = (exam) => {
    if (exam.examType === 'UNIT_TEST') return 'exam-unit-test';
    if (exam.examType === 'MID_TERM') return 'exam-mid-term';
    if (exam.examType === 'PREPARATORY') return 'exam-preparatory';
    if (exam.examType === 'ANNUAL_BOARD') return 'exam-annual-board';
    return `exam-${exam.id}`;
  };

  // Auto-scroll and highlight target exam card if arriving from announcement ticker or anchor link
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('exam-highlight-active');
          setTimeout(() => el.classList.remove('exam-highlight-active'), 3500);
        }
      }
    };

    if (!loading) {
      const timer = setTimeout(handleHashScroll, 200);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Dynamic academic years list
  const availableYears = Array.from(
    new Set(
      ['2026-27', '2027-28', '2025-26', ...examinations.map(e => e.academicYear)].filter(Boolean)
    )
  ).sort().reverse();

  // Filter examinations
  const filteredExams = examinations.filter(exam => {
    // Type filter
    if (selectedType !== 'ALL' && exam.examType !== selectedType) return false;
    // Stream filter
    if (selectedStream !== 'ALL' && exam.stream !== 'ALL' && exam.stream !== selectedStream) return false;
    // Academic Year filter
    if (selectedYear !== 'ALL' && exam.academicYear && exam.academicYear !== selectedYear) return false;
    // Class filter (matches text in examName or instructions)
    if (selectedClass === '1st PUC' && !exam.examName.toLowerCase().includes('1st') && exam.examName.toLowerCase().includes('2nd')) return false;
    if (selectedClass === '2nd PUC' && !exam.examName.toLowerCase().includes('2nd') && exam.examName.toLowerCase().includes('1st')) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = exam.examName?.toLowerCase().includes(q);
      const matchType = exam.examType?.toLowerCase().includes(q);
      const matchInst = exam.instructions?.toLowerCase().includes(q);
      if (!matchName && !matchType && !matchInst) return false;
    }
    return true;
  });

  // Handle Student Hall Ticket & Verification Lookup
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthResult(null);

    // Simulate verified examination portal query
    setTimeout(() => {
      setAuthLoading(false);
      const reg = authForm.registerNo.trim().toUpperCase();
      if (!reg || reg.length < 5) {
        setAuthError('Please enter a valid 6-8 digit Student Register / Admission Number.');
        return;
      }

      setAuthResult({
        studentName: 'Candidate Verified',
        registerNo: reg,
        college: 'Sri Vidyodaya Composite Pre-University College',
        pucClass: reg.startsWith('2') ? '2nd PUC' : '1st PUC',
        stream: reg.includes('S') ? 'Science (PCMC)' : 'Commerce (CEBA)',
        hallTicketStatus: 'ISSUED & CLEARED',
        examCenter: 'Center Code 084 - Main Campus Block A',
        attendancePercentage: '92.4%',
        eligibilityStatus: 'ELIGIBLE FOR ALL EXAMINATIONS',
        hallTicketDownloadUrl: '/uploads/hall-ticket-verified.pdf'
      });
    }, 800);
  };

  const faqs = [
    {
      q: 'What is the minimum attendance required to appear for PUC examinations?',
      a: 'As per the Karnataka Pre-University Board regulations, students must maintain a minimum of 75% attendance in each individual subject (both theory and practicals) to be eligible to receive their exam hall ticket.'
    },
    {
      q: 'When and where are examination Hall Tickets distributed?',
      a: 'Hall tickets are issued directly by the College Examination Cell 7 to 10 days prior to the commencement of examinations upon clearing all library and tuition dues.'
    },
    {
      q: 'What is the passing standard for 1st PUC and 2nd PUC?',
      a: 'Students must secure a minimum aggregate of 35% in each subject (with a minimum of 28 out of 80 in theory exams and 35% in practical examinations) to be declared successful.'
    },
    {
      q: 'What should a student do if they miss an Internal or Mid-term exam on medical grounds?',
      a: 'A formal leave application along with a valid registered medical practitioner certificate must be submitted to the Examination In-charge within 3 working days to be considered for re-tests.'
    },
    {
      q: 'Where are the final 2nd PUC Annual Board results published?',
      a: 'Official State Board results are declared online on the KSEAB portal (karresults.nic.in) and displayed on the college notice board. Consolidated marks sheets are handed out within 15 days.'
    },
    {
      q: 'Are calculators or smartwatches permitted in the examination hall?',
      a: 'Electronic gadgets, programmable calculators, smartphones, and smartwatches are strictly prohibited. Non-programmable basic calculators are permitted only for specified Commerce/Statistics papers.'
    }
  ];

  const previousPapers = [
    { year: '2025-26', title: '2nd PUC Physics Model Paper & Blueprint', stream: 'Science', code: 'PHY-33', url: '/uploads/model-physics-2026.pdf' },
    { year: '2025-26', title: '2nd PUC Mathematics Annual Model Paper', stream: 'Science', code: 'MATH-35', url: '/uploads/model-maths-2026.pdf' },
    { year: '2025-26', title: '2nd PUC Chemistry Solved Question Paper', stream: 'Science', code: 'CHEM-34', url: '/uploads/model-chemistry-2026.pdf' },
    { year: '2025-26', title: '2nd PUC Accountancy Blueprint & Key Answers', stream: 'Commerce', code: 'ACC-30', url: '/uploads/model-accountancy-2026.pdf' },
    { year: '2025-26', title: '2nd PUC Business Studies Model Paper', stream: 'Commerce', code: 'BST-27', url: '/uploads/model-bst-2026.pdf' },
    { year: '2025-26', title: '1st PUC Annual Examination Model Question Set', stream: 'All', code: 'PU1-ALL', url: '/uploads/model-pu1-all-2026.pdf' }
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>

      {/* ── 1. Page Hero Banner ────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(rgba(7, 23, 44, 0.90), rgba(11, 37, 69, 0.94)), url("https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1920&q=80")',
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
            <GraduationCap size={15} /> Academic Assessment & Evaluation
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: '800',
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            Examinations & Assessments
          </h1>

          <p style={{
            maxWidth: '720px',
            margin: '0 auto',
            color: '#cbd5e1',
            fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
            lineHeight: '1.6'
          }}>
            Official examination schedules, timetables, internal assessment calendar, circulars, previous question papers, and guidelines for 1st & 2nd PUC students.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="#timetables" className="btn btn-gold btn-sm">
              <Calendar size={15} /> View Timetables
            </a>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="btn btn-outline-white btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(255,255,255,0.4)', color: '#fff' }}
            >
              <Lock size={14} /> Student Hall Ticket Portal
            </button>
            <a href="#rules" className="btn btn-outline-white btn-sm" style={{ border: '1px solid rgba(255,255,255,0.4)', color: '#fff' }}>
              <ShieldCheck size={15} /> Exam Rules
            </a>
            <WhatsAppButton
              text="WhatsApp Exam Enquiry"
              message="Hello MPUC Examination Cell, I would like to enquire about upcoming PU Board examinations, time tables, and model question papers."
            />
          </div>
        </div>
      </section>

      {/* ── 2. Quick Highlight Stat Cards ──────────────────────────────────── */}
      <section style={{ marginTop: '-2rem', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div className="grid-4" style={{ gap: '1.25rem' }}>
            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary-700)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                <div style={{ backgroundColor: '#eff6ff', padding: '0.5rem', borderRadius: '8px', color: 'var(--primary-700)' }}>
                  <Award size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--primary-900)' }}>1st PUC Annual</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>District Board System</span>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                Evaluated under Karnataka Pre-University District Examination Board standard benchmarks.
              </p>
            </div>

            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #d4af37', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', padding: '0.5rem', borderRadius: '8px', color: '#b8860b' }}>
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--primary-900)' }}>2nd PUC Board</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>State Board (KSEAB)</span>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                Conducted by Karnataka School Examination & Assessment Board with external flying squads.
              </p>
            </div>

            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #059669', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                <div style={{ backgroundColor: '#ecfdf5', padding: '0.5rem', borderRadius: '8px', color: '#059669' }}>
                  <BookOpen size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--primary-900)' }}>Internal Tests</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unit & Mid-Terms</span>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                Continuous monthly assessment cycle ensuring students build steady conceptual mastery.
              </p>
            </div>

            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #7c3aed', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                <div style={{ backgroundColor: '#f5f3ff', padding: '0.5rem', borderRadius: '8px', color: '#7c3aed' }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--primary-900)' }}>98.6% Pass Rate</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Consistent Distinction</span>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                Consistently ranked among top pre-university colleges in Bangalore urban district.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Examination Overview Section ────────────────────────────────── */}
      <section className="section" style={{ padding: '4.5rem 0 3rem 0' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '3.5rem', alignItems: 'center' }}>
            <div>
              <span className="section-subtitle" style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
                Academic Evaluation System
              </span>
              <h2 className="section-title" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.3rem)', marginBottom: '1.25rem' }}>
                Structured Evaluation Scheme Designed for Board & Competitive Excellence
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
                At Sri Vidyodaya Composite Pre-University College, examinations are managed by an autonomous Institutional Examination Committee in strict alignment with the Karnataka State Pre-University Board regulations.
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                Our evaluation system integrates state board examinations with chapter-level unit tests, cumulative mid-term assessments, and comprehensive preparatory mock examinations so students master exam timing, answer presentation, and competitive confidence.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600, color: 'var(--primary-900)' }}>
                  <CheckCircle2 size={18} color="var(--accent-emerald)" /> 80 Theory + 20 Practical/IA Pattern
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600, color: 'var(--primary-900)' }}>
                  <CheckCircle2 size={18} color="var(--accent-emerald)" /> Bi-Weekly Unit Mock Tests
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600, color: 'var(--primary-900)' }}>
                  <CheckCircle2 size={18} color="var(--accent-emerald)" /> Automated SMS Marks to Parents
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600, color: 'var(--primary-900)' }}>
                  <CheckCircle2 size={18} color="var(--accent-emerald)" /> Dedicated Doubt Clinic Post-Exam
                </div>
              </div>
            </div>

            <div>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 16px 36px rgba(11, 37, 69, 0.12)',
                border: '1px solid var(--border-subtle)'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"
                  alt="Students taking exam"
                  style={{ width: '100%', height: '360px', objectFit: 'cover' }}
                />
                <div style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--primary-900)', marginBottom: '0.3rem' }}>
                    Air-Conditioned Examination Corridors & CCTV Surveillance
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                    Transparent, proctored test centers with high-definition CCTV recording and external flying squad monitoring.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. 1st PUC vs 2nd PUC Dual Tabs ─────────────────────────────────── */}
      <section className="section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-title-wrap" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="section-subtitle">Curriculum Benchmarks</span>
            <h2 className="section-title">1st PUC & 2nd PUC Examination Framework</h2>
            <p className="section-desc" style={{ maxWidth: '640px', margin: '0.5rem auto 0' }}>
              Detailed examination structure, evaluation pattern, passing criteria, and practical breakdown for each class.
            </p>
          </div>

          <div className="grid-2" style={{ gap: '2rem' }}>
            {/* 1st PUC Card */}
            <div className="card" style={{ padding: '2rem', border: '1.5px solid #dbeafe', borderRadius: '16px', position: 'relative' }}>
              <div style={{ display: 'inline-block', backgroundColor: 'var(--primary-700)', color: '#ffffff', padding: '0.3rem 0.85rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase' }}>
                Class XI • 1st PUC
              </div>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-900)', marginBottom: '0.75rem' }}>
                1st PUC District-Level Annual Examinations
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Conducted under the centralized question paper framework set by the District Pre-University Examination Committee. Evaluation is executed strictly on board evaluation rubrics.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.87rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span><strong>Theory Papers:</strong> 80 Marks (3 Hours duration per subject)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span><strong>Practicals & IA:</strong> 20 Marks (Internal continuous lab assessment)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span><strong>Pass Standard:</strong> Min 35% overall (Min 28/80 in theory examination)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span><strong>Supplementary Exam:</strong> Conducted in April for eligible promoted students</span>
                </li>
              </ul>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>District Exam Code: <strong>084-PUC1</strong></span>
                <a href="#timetables" onClick={() => setSelectedClass('1st PUC')} className="btn btn-outline-primary btn-sm">
                  View 1st PUC Schedule &rarr;
                </a>
              </div>
            </div>

            {/* 2nd PUC Card */}
            <div className="card" style={{ padding: '2rem', border: '1.5px solid #fef08a', borderRadius: '16px', position: 'relative' }}>
              <div style={{ display: 'inline-block', backgroundColor: 'var(--gold-600)', color: '#ffffff', padding: '0.3rem 0.85rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase' }}>
                Class XII • 2nd PUC State Board
              </div>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-900)', marginBottom: '0.75rem' }}>
                2nd PUC Karnataka State Board (KSEAB)
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                The decisive final board examination conducted by the Karnataka School Examination and Assessment Board. Marks obtained directly determine KCET engineering, veterinary & professional admission ranks.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.87rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--gold-600)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span><strong>Board Pattern:</strong> 80 Marks Theory + 20 Marks Practical / Internal Assessment</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--gold-600)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span><strong>External Practicals:</strong> Conducted in February with external board-appointed examiners</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--gold-600)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span><strong>Mock Preparatory:</strong> 2 Full rounds of statewide preparatory tests before Board final</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--gold-600)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span><strong>Board Hall Ticket:</strong> Barcoded computerized hall tickets released by KSEAB portal</span>
                </li>
              </ul>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>State Board Center: <strong>SVCPUC-084</strong></span>
                <a href="#timetables" onClick={() => setSelectedClass('2nd PUC')} className="btn btn-outline-primary btn-sm">
                  View 2nd PUC Schedule &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Live Examination Timetables & Schedules (from MySQL) ─────────── */}
      <section id="timetables" className="section" style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div className="section-title-wrap" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="section-subtitle">Live Schedules & PDF Downloads</span>
            <h2 className="section-title">Examination Timetables & Assessment Schedules</h2>
            <p className="section-desc" style={{ maxWidth: '640px', margin: '0.5rem auto 0' }}>
              Official examination calendar published by the College Examination Committee. Select filters to find relevant timetables.
            </p>
          </div>

          {/* Admin Management Quick Access Banner */}
          {isAuthenticated ? (
            <div style={{
              backgroundColor: '#eff6ff',
              border: '1.5px solid #bfdbfe',
              borderRadius: '12px',
              padding: '1rem 1.5rem',
              marginBottom: '1.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: '#dbeafe',
                  color: 'var(--primary-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <GraduationCap size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                    Admin Controls Active ({user?.username})
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Add or update timetables, upload model question paper PDFs, or edit schedules.
                  </div>
                </div>
              </div>

              <Link
                to="/admin/examinations"
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
              >
                <Edit2 size={14} /> Open Examination Admin Portal →
              </Link>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '10px',
              padding: '0.75rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              fontSize: '0.82rem',
              color: 'var(--text-muted)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={14} color="var(--primary-700)" />
                <span>Authorized faculty & examination committee staff can add and update examination PDFs.</span>
              </div>
              <Link
                to="/admin/login"
                style={{ fontWeight: 700, color: 'var(--primary-700)', textDecoration: 'none' }}
              >
                Staff / Admin Login →
              </Link>
            </div>
          )}

          {/* Search & Filters Bar */}
          <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>

              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search exam name or instructions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.25rem', fontSize: '0.86rem' }}
                />
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="form-select"
                  style={{ fontSize: '0.86rem' }}
                >
                  <option value="ALL">All Exam Types</option>
                  <option value="UNIT_TEST">Unit Tests</option>
                  <option value="MID_TERM">Mid-Term Examinations</option>
                  <option value="PREPARATORY">Preparatory Mock Board</option>
                  <option value="ANNUAL_BOARD">Annual State Board Exam</option>
                  <option value="PRACTICAL">Practical Lab Examinations</option>
                </select>
              </div>

              {/* Class Filter */}
              <div>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="form-select"
                  style={{ fontSize: '0.86rem' }}
                >
                  <option value="ALL">All Classes (1st & 2nd PUC)</option>
                  <option value="1st PUC">1st PUC Only</option>
                  <option value="2nd PUC">2nd PUC Only</option>
                </select>
              </div>

              {/* Stream Filter */}
              <div>
                <select
                  value={selectedStream}
                  onChange={(e) => setSelectedStream(e.target.value)}
                  className="form-select"
                  style={{ fontSize: '0.86rem' }}
                >
                  <option value="ALL">All Streams (Science & Commerce)</option>
                  <option value="SCIENCE">Science Only</option>
                  <option value="COMMERCE">Commerce Only</option>
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="form-select"
                  style={{ fontSize: '0.86rem' }}
                >
                  <option value="ALL">All Academic Years</option>
                  {availableYears.map(year => (
                    <option key={year} value={year}>Academic Year {year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter tags active */}
            {(selectedType !== 'ALL' || selectedStream !== 'ALL' || selectedClass !== 'ALL' || searchQuery) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Active Filters:</span>
                {selectedType !== 'ALL' && <span className="badge" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>Type: {selectedType}</span>}
                {selectedClass !== 'ALL' && <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>Class: {selectedClass}</span>}
                {selectedStream !== 'ALL' && <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>Stream: {selectedStream}</span>}
                {searchQuery && <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>"{searchQuery}"</span>}
                <button
                  onClick={() => { setSelectedType('ALL'); setSelectedClass('ALL'); setSelectedStream('ALL'); setSearchQuery(''); }}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem', marginLeft: 'auto' }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Timetables Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div className="loading-spinner" style={{ margin: '0 auto 1rem auto' }}></div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading live examination timetables...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #fee2e2' }}>
              <AlertTriangle size={36} color="#dc2626" style={{ margin: '0 auto 0.75rem auto' }} />
              <h4 style={{ color: '#991b1b', marginBottom: '0.4rem' }}>Temporary Connection Notice</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>{error}</p>
              <button onClick={fetchExaminations} className="btn btn-outline-primary btn-sm">
                <RefreshCw size={14} /> Retry Connection
              </button>
            </div>
          ) : filteredExams.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <Calendar size={44} style={{ color: '#94a3b8', margin: '0 auto 1rem auto', opacity: 0.5 }} />
              <h4 style={{ color: 'var(--primary-900)', marginBottom: '0.5rem' }}>No Examination Schedules Found</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                No active examination schedules match the selected filters. Please adjust your search criteria or check back soon.
              </p>
              <button
                onClick={() => { setSelectedType('ALL'); setSelectedClass('ALL'); setSelectedStream('ALL'); setSearchQuery(''); }}
                className="btn btn-primary btn-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid-2" style={{ gap: '1.5rem' }}>
              {filteredExams.map((exam) => (
                <div
                  key={exam.id}
                  id={getExamAnchorId(exam)}
                  className="card exam-schedule-card"
                  style={{
                    padding: '1.75rem',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                    scrollMarginTop: '100px'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.04)'; }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        backgroundColor: exam.examType === 'ANNUAL_BOARD' ? '#fef3c7' : '#eff6ff',
                        color: exam.examType === 'ANNUAL_BOARD' ? '#92400e' : 'var(--primary-800)',
                        border: exam.examType === 'ANNUAL_BOARD' ? '1px solid #fde68a' : '1px solid #bfdbfe'
                      }}>
                        <Calendar size={13} /> {exam.examType.replace('_', ' ')}
                      </span>

                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#f1f5f9', color: 'var(--text-muted)', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                          {exam.academicYear}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: exam.stream === 'ALL' ? '#dcfce7' : '#fef9e7', color: exam.stream === 'ALL' ? '#166534' : '#b8860b', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                          {exam.stream} STREAM
                        </span>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '0.6rem', lineHeight: '1.3' }}>
                      {exam.examName}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '0.9rem' }}>
                      <span><strong>Starts:</strong> {new Date(exam.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span>•</span>
                      <span><strong>Concludes:</strong> {new Date(exam.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>

                    {exam.instructions && (
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.55', marginBottom: '1.25rem' }}>
                        {exam.instructions}
                      </p>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
                        <CheckCircle2 size={14} /> Official Board Approved
                      </div>
                      <Link
                        to="/admin/examinations"
                        title="Authorized faculty can manage examinations and upload PDFs"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.75rem',
                          color: 'var(--primary-700)',
                          backgroundColor: '#eff6ff',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          fontWeight: 600,
                          textDecoration: 'none',
                          border: '1px solid #bfdbfe'
                        }}
                      >
                        <Edit2 size={12} /> {isAuthenticated ? 'Edit in Admin' : 'Admin Portal'}
                      </Link>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {exam.timeTableUrl && (
                        <a
                          href={exam.timeTableUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
                          title={`View or Download ${exam.examName} Timetable PDF`}
                        >
                          <Download size={14} /> Timetable PDF
                        </a>
                      )}
                      {exam.modelQuestionPaperUrl && (
                        <a
                          href={exam.modelQuestionPaperUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-gold btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
                          title={`View or Download ${exam.examName} Model Question Paper PDF`}
                        >
                          <Download size={14} /> Model Question Paper
                        </a>
                      )}
                      {!exam.timeTableUrl && !exam.modelQuestionPaperUrl && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Timetable distribution via campus noticeboard
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <style>{`
            .exam-highlight-active {
              outline: 3px solid #d4af37 !important;
              box-shadow: 0 0 0 6px rgba(212, 175, 55, 0.25), 0 16px 36px rgba(11, 37, 69, 0.16) !important;
              animation: examCardPulse 1.2s ease-in-out infinite alternate;
            }
            @keyframes examCardPulse {
              from { transform: translateY(-3px) scale(1.005); }
              to { transform: translateY(-3px) scale(1.018); }
            }
          `}</style>
        </div>
      </section>

      {/* ── 6. Practical Examination Schedules & Laboratory Regulations ───── */}
      <section className="section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="section-subtitle">Laboratory Assessments</span>
              <h2 className="section-title">Annual Practical Examination Schedules</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.65', marginBottom: '1rem' }}>
                Practical examinations for Physics, Chemistry, Biology, and Computer Science carry 20 marks each in the State Board evaluation scheme. Practical batches are grouped in lots of 24 candidates.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary-700)', minWidth: '85px', fontSize: '0.85rem' }}>Batch 1 & 2:</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>Morning Session (9:30 AM to 12:30 PM) • Physics & Biology</div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary-700)', minWidth: '85px', fontSize: '0.85rem' }}>Batch 3 & 4:</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>Afternoon Session (1:30 PM to 4:30 PM) • Chemistry & Computer Science</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '1rem', fontSize: '0.85rem', color: 'var(--primary-900)' }}>
                <strong>Mandatory Requirements for Practicals:</strong>
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.4rem', lineHeight: '1.5' }}>
                  <li>Certified laboratory journal/record book signed by faculty in-charge.</li>
                  <li>Clean white laboratory coat and safety goggles (Chemistry lab).</li>
                  <li>Practical examination admission slip and college identity card.</li>
                </ul>
              </div>
            </div>

            <div>
              <img
                src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
                alt="Science Practical Examination"
                style={{ width: '100%', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Previous Year Question Papers & Blueprints ─────────────────── */}
      <section className="section" style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div className="section-title-wrap" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="section-subtitle">Academic Preparation Vault</span>
            <h2 className="section-title">Previous Year Question Papers & Model Blueprints</h2>
            <p className="section-desc" style={{ maxWidth: '640px', margin: '0.5rem auto 0' }}>
              Official Karnataka KSEAB model question papers, blueprint schemes, and solved answer keys prepared by senior faculty members.
            </p>
          </div>

          {/* Active Model Papers from Published Examinations */}
          {examinations.some(e => e.modelQuestionPaperUrl) && (
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gold-700)', backgroundColor: 'var(--gold-100)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                  Latest Releases
                </span>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)', fontWeight: 700, margin: 0 }}>
                  Active Examination Model Question Papers & Blueprints
                </h3>
              </div>
              <div className="grid-3" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                {examinations.filter(e => e.modelQuestionPaperUrl).map((exam) => (
                  <div key={`model-${exam.id}`} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1.5px solid rgba(212, 175, 55, 0.4)', borderRadius: '12px', backgroundColor: '#fffdf5' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', backgroundColor: '#fef3c7', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          {exam.stream} STREAM
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{exam.academicYear}</span>
                      </div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                        {exam.examName} Model Paper
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                        Official institutional question paper format and blueprint guidelines for {exam.examName}.
                      </p>
                    </div>

                    <a
                      href={exam.modelQuestionPaperUrl}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="btn btn-gold btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '100%' }}
                    >
                      <Download size={14} /> Download Model Question Paper
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {previousPapers.map((paper, i) => (
              <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-700)', backgroundColor: '#eff6ff', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {paper.code}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{paper.year}</span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                    {paper.title}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    Standard state board blueprint with chapter-wise weightage and evaluation breakdown.
                  </p>
                </div>

                <a
                  href={paper.url}
                  download
                  className="btn btn-outline-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '100%' }}
                >
                  <Download size={14} /> Download Model Paper PDF
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Examination Rules & Code of Conduct ─────────────────────────── */}
      <section id="rules" className="section" style={{ backgroundColor: 'var(--primary-950)', color: '#ffffff', padding: '5rem 0' }}>
        <div className="container">
          <div className="section-title-wrap" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-subtitle" style={{ color: 'var(--gold-400)', backgroundColor: 'rgba(212, 175, 55, 0.15)', borderColor: 'rgba(212, 175, 55, 0.4)' }}>
              Strict Discipline Mandate
            </span>
            <h2 className="section-title" style={{ color: '#ffffff' }}>
              Examination Rules & Student Code of Conduct
            </h2>
            <p className="section-desc" style={{ color: '#94a3b8', maxWidth: '640px', margin: '0.5rem auto 0' }}>
              All students appearing for internal tests and board examinations must strictly adhere to the examination decorum.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px', padding: '1.75rem' }}>
              <Clock size={28} style={{ color: 'var(--gold-400)', marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>Reporting & Entry Time</h4>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                Students must occupy their allotted seats at least <strong>30 minutes</strong> before the scheduled commencement of the test. No student will be admitted after the final warning bell.
              </p>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px', padding: '1.75rem' }}>
              <ShieldCheck size={28} style={{ color: '#38bdf8', marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>Hall Ticket & ID Card</h4>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                Wearing the official college uniform along with valid <strong>College ID card</strong> and the printed <strong>Examination Hall Ticket</strong> is compulsory on all examination days.
              </p>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px', padding: '1.75rem' }}>
              <AlertTriangle size={28} style={{ color: '#f87171', marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>Zero-Tolerance for Malpractice</h4>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                Possession of mobile phones, smartwatches, chits, or unauthorized notes leads to immediate debarment under Karnataka Education Act Malpractice Rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. Examination Calendar Timeline ─────────────────────────────────── */}
      <section className="section" style={{ backgroundColor: '#ffffff', padding: '4.5rem 0' }}>
        <div className="container">
          <div className="section-title-wrap" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="section-subtitle">Academic Year Milestones</span>
            <h2 className="section-title">Annual Examination Roadmap 2026-27</h2>
          </div>

          <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { month: 'AUGUST 2026', title: 'First Unit Test Series', desc: 'Portions: Chapters 1 & 2 in all core subjects (25 Marks per subject).' },
              { month: 'OCTOBER 2026', title: 'Mid-Term Examinations', desc: 'Comprehensive mid-year board assessment covering 50% state board curriculum.' },
              { month: 'DECEMBER 2026', title: 'Second Unit Test Assessment', desc: 'Focus on advanced chapter mechanics and numerical problem sets.' },
              { month: 'JANUARY 2027', title: 'Preparatory Mock Board Exams', desc: 'Statewide simulation matching exact Karnataka Board duration, format, and evaluation.' },
              { month: 'FEBRUARY 2027', title: 'Annual Practical Lab Examinations', desc: 'External examiner evaluations for Science labs and viva-voce assessments.' },
              { month: 'MARCH 2027', title: 'Karnataka State PUC Board Final Exams', desc: 'Official 2nd PUC state board examinations conducted by KSEAB.' }
            ].map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', padding: '1.1rem', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ backgroundColor: 'var(--primary-800)', color: '#ffffff', padding: '0.5rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, minWidth: '125px', textAlign: 'center' }}>
                  {step.month}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-900)', marginBottom: '0.2rem' }}>{step.title}</h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. Examination Results Announcements ──────────────────────────── */}
      <section className="section" style={{ padding: '4rem 0', backgroundColor: '#eff6ff' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <Award size={40} style={{ color: 'var(--primary-700)', margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2rem', color: 'var(--primary-900)', marginBottom: '0.75rem' }}>
              Examination Results Announcements & Portals
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
              Annual 2nd PUC State Board examination results are declared simultaneously on the Karnataka Examination Board portal and our college intranet noticeboard.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href="https://karresults.nic.in"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Official KSEAB Results Portal <ExternalLink size={15} />
              </a>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="btn btn-outline-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <UserCheck size={16} /> Check College Internal Marks
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 11. Frequently Asked Questions (FAQs) ───────────────────────────── */}
      <section className="section" style={{ backgroundColor: '#ffffff', padding: '4.5rem 0' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <div className="section-title-wrap" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="section-subtitle">Got Questions?</span>
            <h2 className="section-title">Examination Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  backgroundColor: openFaq === i ? '#f8fafc' : '#ffffff',
                  transition: 'all 0.2s ease'
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%',
                    padding: '1.15rem 1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: 'var(--primary-900)'
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, marginLeft: '0.75rem', color: 'var(--primary-700)' }} />
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', borderTop: '1px solid #e2e8f0' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. Examination Department Contact Info ────────────────────────── */}
      <section className="section" style={{ padding: '4rem 0', backgroundColor: '#f8fafc', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="card" style={{ padding: '2.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
            <div className="grid-2" style={{ gap: '2rem', alignItems: 'center' }}>
              <div>
                <span className="section-subtitle" style={{ display: 'inline-block', marginBottom: '0.4rem' }}>
                  Student Support & Queries
                </span>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--primary-900)', marginBottom: '0.75rem' }}>
                  Examination Cell & Grievance Desk
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                  For queries regarding hall ticket errors, name correction in marks cards, exam re-evaluation, or special medical accommodations, reach out to the Examination Department.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <MapPin size={18} color="var(--primary-700)" />
                    <span><strong>Location:</strong> Room 104, Administrative Block (Ground Floor), Main Campus</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Phone size={18} color="var(--primary-700)" />
                    <span><strong>Direct Phone:</strong> +91 80 2345 6795 (Exam Cell Ext. 14)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Mail size={18} color="var(--primary-700)" />
                    <span><strong>Email:</strong> examinations@svcpuc.edu.in</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Clock size={18} color="var(--primary-700)" />
                    <span><strong>Counter Hours:</strong> Monday – Saturday: 9:30 AM to 4:00 PM</span>
                  </div>
                </div>
                <div style={{ marginTop: '1.25rem' }}>
                  <WhatsAppButton
                    text="Enquire Exam Timetable on WhatsApp"
                    message="Hello MPUC Examination Cell, I would like to enquire about upcoming PU Board examinations, time tables, and model question papers."
                  />
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
                  Controller of Examinations
                </h4>
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-700)', marginBottom: '0.2rem' }}>
                  Dr. S. N. Deshpande, M.Sc., Ph.D.
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Senior Professor of Physics & Institutional Exam Superintendent
                </p>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                >
                  <Lock size={14} /> Open Student Authentication Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 13. Student Hall Ticket & Authentication Verification Modal ────── */}
      {authModalOpen && (
        <div className="modal-backdrop" onClick={() => setAuthModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setAuthModalOpen(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div style={{ backgroundColor: '#eff6ff', padding: '0.45rem', borderRadius: '8px', color: 'var(--primary-700)' }}>
                <Lock size={20} />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-900)', margin: 0 }}>
                Student Examination Portal
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Confidential student marks and individual hall tickets require candidate verification.
            </p>

            <form onSubmit={handleAuthSubmit}>
              <div className="form-group">
                <label className="form-label">Student Register / Admission No. *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 2026S1042 or 2026C2018"
                  value={authForm.registerNo}
                  onChange={(e) => setAuthForm({ ...authForm, registerNo: e.target.value })}
                  required
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Found on your identity card or fee receipt.
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth *</label>
                <input
                  type="date"
                  className="form-control"
                  value={authForm.dob}
                  onChange={(e) => setAuthForm({ ...authForm, dob: e.target.value })}
                  required
                />
              </div>

              {authError && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1rem' }}>
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="btn btn-primary"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              >
                {authLoading ? 'Verifying Student Credentials...' : 'Authenticate & Access Records'}
              </button>
            </form>

            {/* Authenticated Verification Card */}
            {authResult && (
              <div style={{ marginTop: '1.5rem', padding: '1.25rem', backgroundColor: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803d', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.6rem' }}>
                  <CheckCircle2 size={18} /> Credentials Verified Successfully
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.82rem', marginBottom: '1rem' }}>
                  <div><strong>Register No:</strong> {authResult.registerNo}</div>
                  <div><strong>Class:</strong> {authResult.pucClass}</div>
                  <div><strong>Stream:</strong> {authResult.stream}</div>
                  <div><strong>Attendance:</strong> <span style={{ color: '#166534', fontWeight: 700 }}>{authResult.attendancePercentage}</span></div>
                  <div style={{ gridColumn: '1 / -1' }}><strong>Exam Center:</strong> {authResult.examCenter}</div>
                  <div style={{ gridColumn: '1 / -1' }}><strong>Status:</strong> <span style={{ color: '#15803d', fontWeight: 700 }}>{authResult.hallTicketStatus}</span></div>
                </div>
                <a
                  href={authResult.hallTicketDownloadUrl}
                  download
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <Download size={14} /> Download Verified Hall Ticket
                </a>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

