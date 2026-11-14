import React, { useState, useEffect } from 'react';
import { Mail, Phone, BookOpen, Award, GraduationCap } from 'lucide-react';
import api from '../services/api';

const defaultFaculty = [
  {
    id: 1,
    fullName: 'Dr. K. S. Venkatesh',
    department: 'Physics',
    designation: 'Principal & Senior Professor',
    qualification: 'M.Sc., M.Phil., Ph.D.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'Over 24 years of teaching excellence in Electrodynamics and Modern Physics. Recipient of the State Best Teacher Accolade.',
    subjectsTaught: 'Physics (PUC I & II), KCET & NEET Masterclasses',
    experienceYears: 24,
    email: 'principal@svcpuc.edu.in'
  },
  {
    id: 2,
    fullName: 'Prof. Meenakshi Sundaram',
    department: 'Chemistry',
    designation: 'Head of Department',
    qualification: 'M.Sc., B.Ed., NET',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    bio: 'Specialist in Organic Chemistry reaction mechanisms and physical equilibrium with 18 years of collegiate mentorship.',
    subjectsTaught: 'Organic Chemistry, Biomolecules, Competitive Test Series',
    experienceYears: 18,
    email: 'chemistry@svcpuc.edu.in'
  },
  {
    id: 3,
    fullName: 'Prof. Raghavendra Rao',
    department: 'Mathematics',
    designation: 'Senior Faculty & CET Coordinator',
    qualification: 'M.Sc. (Applied Mathematics)',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: 'Acclaimed mentor for Calculus and Coordinate Geometry with shortcut techniques for KCET and JEE Main aspirants.',
    subjectsTaught: 'Mathematics (Calculus, Vectors, Algebra)',
    experienceYears: 16,
    email: 'maths@svcpuc.edu.in'
  },
  {
    id: 4,
    fullName: 'Dr. Shalini Deshpande',
    department: 'Biology',
    designation: 'Senior Lecturer',
    qualification: 'M.Sc., Ph.D. in Botany',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    bio: 'Empathetic educator guiding NEET aspirants with diagrams, NCERT line-by-line analyses, and genetics workshops.',
    subjectsTaught: 'Botany, Zoology, NEET Biology Fast-Track',
    experienceYears: 14,
    email: 'biology@svcpuc.edu.in'
  },
  {
    id: 5,
    fullName: 'Prof. Rajeshwari Kulkarni',
    department: 'Commerce & Accountancy',
    designation: 'HOD Commerce',
    qualification: 'M.Com, M.Phil, UGC-NET',
    photoUrl: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=200&q=80',
    bio: 'Expert in Corporate Accounting and Financial Statements. Proven track record of 100% centum scores in state board exams.',
    subjectsTaught: 'Accountancy, Business Studies, CA Foundation Basics',
    experienceYears: 19,
    email: 'commerce@svcpuc.edu.in'
  },
  {
    id: 6,
    fullName: 'Prof. Anand Vardhan',
    department: 'Computer Science',
    designation: 'Lecturer in Computer Science',
    qualification: 'M.C.A., M.Tech (CSE)',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    bio: 'Passionately teaching Python, SQL, C++, and computational problem-solving with practical live-coding sessions.',
    subjectsTaught: 'Computer Science (Python & DBMS), Web Fundamentals',
    experienceYears: 11,
    email: 'cs@svcpuc.edu.in'
  }
];

export const Faculty = () => {
  const [faculty, setFaculty] = useState(defaultFaculty);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [departments, setDepartments] = useState([
    'ALL', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 
    'Computer Science', 'Commerce & Accountancy', 'Economics', 'Languages'
  ]);

  useEffect(() => {
    const deptParam = selectedDept === 'ALL' ? '' : `?department=${encodeURIComponent(selectedDept)}`;
    api.get(`/faculty${deptParam}`)
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setFaculty(res.data);
        } else {
          // Filter default faculty by department if selected
          if (selectedDept === 'ALL') {
            setFaculty(defaultFaculty);
          } else {
            setFaculty(defaultFaculty.filter(f => f.department.toLowerCase().includes(selectedDept.toLowerCase())));
          }
        }
      })
      .catch(() => {
        if (selectedDept === 'ALL') {
          setFaculty(defaultFaculty);
        } else {
          setFaculty(defaultFaculty.filter(f => f.department.toLowerCase().includes(selectedDept.toLowerCase())));
        }
      });
  }, [selectedDept]);

  return (
    <div>
      {/* Banner */}
      <section style={{
        background: 'linear-gradient(rgba(7, 23, 44, 0.9), rgba(11, 37, 69, 0.94)), url("https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        padding: '4.5rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <span className="section-subtitle" style={{ backgroundColor: 'rgba(212,175,55,0.2)', color: 'var(--gold-400)' }}>
            Academic Mentors
          </span>
          <h1 style={{ fontSize: '2.75rem', color: '#ffffff', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Our Distinguished Faculty
          </h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', color: '#cbd5e1', fontSize: '1.05rem' }}>
            Meet our team of passionate educators, researchers, and mentors committed to guiding every student toward scholastic excellence.
          </p>
        </div>
      </section>

      {/* Department Tabs & Cards */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`btn btn-sm ${selectedDept === dept ? 'btn-primary' : 'btn-outline-primary'}`}
              >
                {dept === 'ALL' ? 'All Departments' : dept}
              </button>
            ))}
          </div>

          <div className="grid-3" style={{ gap: '2rem' }}>
            {faculty.map(prof => (
              <div key={prof.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <img
                    src={prof.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                    alt={prof.fullName}
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                      border: '2px solid var(--border-subtle)',
                      flexShrink: 0
                    }}
                  />
                  <div>
                    <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', marginBottom: '0.35rem' }}>
                      {prof.department}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', lineHeight: '1.25' }}>
                      {prof.fullName}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--gold-600)', fontWeight: '600', marginTop: '2px' }}>
                      {prof.designation}
                    </p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {prof.qualification}
                    </p>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem', flexGrow: 1 }}>
                  {prof.bio}
                </div>

                <div style={{ backgroundColor: 'var(--bg-page)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.82rem' }}>
                  <strong style={{ color: 'var(--primary-900)' }}>Subjects: </strong>
                  <span style={{ color: 'var(--text-main)' }}>{prof.subjectsTaught || 'Core Subjects'}</span>
                  <div style={{ marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                    <strong>Experience: </strong> {prof.experienceYears}+ Years
                  </div>
                </div>

                {prof.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--primary-700)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                    <Mail size={14} />
                    <a href={`mailto:${prof.email}`} style={{ color: 'inherit' }}>{prof.email}</a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
