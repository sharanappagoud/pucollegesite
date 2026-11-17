import React, { useState } from 'react';
import { 
  FileCheck, Shield, HelpCircle, CheckCircle2, 
  Search, ArrowRight, AlertCircle, Award, Phone, Mail, Clock 
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { WhatsAppButton } from '../components/WhatsAppButton';

export const Admissions = () => {
  const [enquirySuccess, setEnquirySuccess] = useState(null);
  const [enquiryError, setEnquiryError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Track Application State
  const [trackRef, setTrackRef] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmitEnquiry = async (data) => {
    setSubmitting(true);
    setEnquiryError('');
    setEnquirySuccess(null);
    try {
      const res = await api.post('/admission-enquiries', {
        ...data,
        academicYear: '2026-27',
        consentGiven: true
      });
      if (res.success) {
        setEnquirySuccess(res.data);
        reset();
      } else {
        setEnquiryError(res.message || 'Submission failed');
      }
    } catch (err) {
      setEnquiryError(err.message || 'Submission failed. Please check your network and details.');
    } finally {
      setSubmitting(false);
    }
  };

  const onTrackEnquiry = async (e) => {
    e.preventDefault();
    if (!trackRef.trim()) return;
    setTrackLoading(true);
    setTrackError('');
    setTrackResult(null);
    try {
      const res = await api.get(`/admission-enquiries/track/${encodeURIComponent(trackRef.trim().toUpperCase())}`);
      if (res.success) {
        setTrackResult(res.data);
      } else {
        setTrackError(res.message || 'Reference number not found');
      }
    } catch (err) {
      setTrackError('No enquiry found with reference number: ' + trackRef);
    } finally {
      setTrackLoading(false);
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <section style={{
        background: 'linear-gradient(rgba(7, 23, 44, 0.9), rgba(11, 37, 69, 0.94)), url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        padding: '4.5rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <span className="section-subtitle" style={{ backgroundColor: 'rgba(212,175,55,0.2)', color: 'var(--gold-400)' }}>
            Academic Year 2026-27
          </span>
          <h1 style={{ fontSize: '2.75rem', color: '#ffffff', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Admissions & Enquiries
          </h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', color: '#cbd5e1', fontSize: '1.05rem' }}>
            Join a vibrant community of high-achieving students. Follow our transparent, merit-focused admission workflow.
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <WhatsAppButton
              text="Chat with Admissions on WhatsApp"
              message="Hello MPUC Admissions, I would like to enquire about PU 1st Year admission eligibility, application dates, and fee structure."
            />
          </div>
        </div>
      </section>

      {/* Admission Procedure & Steps */}
      <section id="guidelines" className="section">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle">Workflow & Eligibility</span>
            <h2 className="section-title">Admission Guidelines & Eligibility Criteria</h2>
            <p className="section-desc">
              Admission to 1st Year Pre-University (11th Grade) is open to eligible candidates based on merit in the qualifying Class 10 examination.
            </p>
          </div>

          <div className="grid-4" style={{ marginBottom: '3rem' }}>
            <div className="card" style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                backgroundColor: 'var(--primary-800)', color: '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem auto', fontWeight: '800', fontSize: '1.1rem'
              }}>
                1
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary-900)' }}>Online Enquiry</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Submit the online enquiry form with 10th standard marks and preferred combination to receive a reference number.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                backgroundColor: 'var(--primary-800)', color: '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem auto', fontWeight: '800', fontSize: '1.1rem'
              }}>
                2
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary-900)' }}>Counselling Slot</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Admissions desk schedules a personal campus visit and stream guidance session with senior faculty mentors.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                backgroundColor: 'var(--primary-800)', color: '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem auto', fontWeight: '800', fontSize: '1.1rem'
              }}>
                3
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary-900)' }}>Document Verification</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Verification of original 10th / SSLC marks cards, transfer certificate, conduct certificate, and ID proof.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                backgroundColor: 'var(--gold-600)', color: '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem auto', fontWeight: '800', fontSize: '1.1rem'
              }}>
                4
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary-900)' }}>Seat Confirmation</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Payment of prescribed college fee, allotment of section and roll number, and issuance of student ID card.
              </p>
            </div>
          </div>

          {/* Eligibility Requirements & Documentation */}
          <div className="grid-2" style={{ gap: '2rem' }}>
            <div className="card" style={{ borderLeft: '4px solid var(--primary-700)', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckCircle2 size={22} color="var(--primary-700)" />
                Stream Eligibility Requirements
              </h3>
              <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Science Stream (PCMB, PCMC):</strong> Pass in Karnataka SSLC / CBSE / ICSE or equivalent with minimum 60% aggregate and strong foundation in Mathematics & Science.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Commerce Stream (CEBA, MEBA, SEBA, MSBA):</strong> Pass in 10th standard board with minimum 50% aggregate. No prior commerce knowledge required.
                </li>
                <li>
                  <strong>Direct Merit Admissions:</strong> Students scoring 90%+ in 10th boards receive immediate on-the-spot seat confirmation with merit concessions.
                </li>
              </ul>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--gold-500)', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FileCheck size={22} color="var(--gold-600)" />
                Mandatory Enclosure Documents
              </h3>
              <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.8' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <CheckCircle2 size={16} color="var(--gold-600)" /> Original & 3 copies of 10th Standard / SSLC Marks Card
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <CheckCircle2 size={16} color="var(--gold-600)" /> Transfer Certificate (TC) & Conduct Certificate from previous school
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <CheckCircle2 size={16} color="var(--gold-600)" /> Migration Certificate (for CBSE, ICSE, and Non-Karnataka State Boards)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--gold-600)" /> 5 Passport-size color photos + Copy of Student & Parent Aadhaar cards
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Online Enquiry Form & Application Status Tracker */}
      <section id="enquiry-form" className="section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '3rem', alignItems: 'flex-start' }}>
            {/* Form Column */}
            <div>
              <span className="section-subtitle">Direct Application</span>
              <h2 className="section-title">Online Admission Enquiry</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                Please provide accurate student and parent information. A unique reference number will be generated immediately for your records.
              </p>

              {enquirySuccess ? (
                <div style={{
                  backgroundColor: '#ecfdf5',
                  border: '1.5px solid #059669',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  textAlign: 'center'
                }}>
                  <CheckCircle2 size={48} color="#059669" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ color: '#065f46', fontSize: '1.35rem', marginBottom: '0.5rem' }}>
                    Admission Enquiry Recorded!
                  </h3>
                  <p style={{ color: '#047857', fontSize: '0.95rem', marginBottom: '1rem' }}>
                    Your official reference number is:
                  </p>
                  <div style={{
                    fontSize: '1.6rem',
                    fontWeight: '800',
                    color: '#065f46',
                    backgroundColor: '#d1fae5',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    display: 'inline-block',
                    marginBottom: '1rem'
                  }}>
                    {enquirySuccess.referenceNo}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#065f46', lineHeight: '1.6' }}>
                    Dear {enquirySuccess.studentName}, your enquiry for <strong>{enquirySuccess.preferredCombination}</strong> ({enquirySuccess.preferredStream}) has been lodged with the admissions office. Our counselling coordinator will get in touch at <strong>{enquirySuccess.parentPhone}</strong>.
                  </p>
                  <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                    <WhatsAppButton
                      text="Continue Admission Enquiry on WhatsApp"
                      message={`Hello MPUC Admissions, I have submitted an online enquiry [Ref: ${enquirySuccess.referenceNo}] for ${enquirySuccess.studentName}. Stream: ${enquirySuccess.preferredStream} (${enquirySuccess.preferredCombination}). Please guide me on next steps.`}
                    />
                    <button
                      onClick={() => setEnquirySuccess(null)}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmitEnquiry)} className="card" style={{ padding: '2rem' }}>
                  {enquiryError && (
                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                      {enquiryError}
                    </div>
                  )}

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Student Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Candidate's legal name"
                        {...register('studentName', { required: 'Student full name is required' })}
                      />
                      {errors.studentName && <span className="form-error">{errors.studentName.message}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Parent / Guardian Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Father / Mother / Guardian"
                        {...register('parentName', { required: 'Parent name is required' })}
                      />
                      {errors.parentName && <span className="form-error">{errors.parentName.message}</span>}
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Student Mobile Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="10-digit mobile"
                        {...register('studentPhone', { 
                          required: 'Student mobile is required',
                          pattern: { value: /^[+0-9\s-]{10,15}$/, message: 'Valid 10-digit mobile required' }
                        })}
                      />
                      {errors.studentPhone && <span className="form-error">{errors.studentPhone.message}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Parent Mobile Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="10-digit mobile"
                        {...register('parentPhone', { 
                          required: 'Parent mobile is required',
                          pattern: { value: /^[+0-9\s-]{10,15}$/, message: 'Valid 10-digit mobile required' }
                        })}
                      />
                      {errors.parentPhone && <span className="form-error">{errors.parentPhone.message}</span>}
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Student Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="student@example.com"
                        {...register('email', { 
                          required: 'Student email is required',
                          pattern: { value: /\S+@\S+\.\S+/, message: 'Valid email required' }
                        })}
                      />
                      {errors.email && <span className="form-error">{errors.email.message}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Parent Email Address (Optional)</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="parent@example.com"
                        {...register('parentEmail')}
                      />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">10th / SSLC Board *</label>
                      <select className="form-select" {...register('board', { required: 'Please select board' })}>
                        <option value="Karnataka State Board">Karnataka State Board (SSLC)</option>
                        <option value="CBSE">CBSE (Central Board)</option>
                        <option value="ICSE">ICSE</option>
                        <option value="Other">Other State Board / IGCSE</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Preferred PUC Stream *</label>
                      <select className="form-select" {...register('preferredStream', { required: 'Select stream' })}>
                        <option value="SCIENCE">Science Stream</option>
                        <option value="COMMERCE">Commerce Stream</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject Combination *</label>
                    <select className="form-select" {...register('preferredCombination', { required: 'Select combination' })}>
                      <option value="PCMB">PCMB (Physics, Chem, Maths, Biology)</option>
                      <option value="PCMC">PCMC (Physics, Chem, Maths, Computer Sci)</option>
                      <option value="CEBA">CEBA (Comp Sci, Econ, Business, Accounts)</option>
                      <option value="MEBA">MEBA (Basic Maths, Econ, Business, Accounts)</option>
                      <option value="SEBA">SEBA (Stats, Econ, Business, Accounts)</option>
                      <option value="MSBA">MSBA (Basic Maths, Stats, Business, Accounts)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Residential Address</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      placeholder="Door / Flat No, Street, Village or Area, City, District"
                      {...register('address')}
                    ></textarea>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Pincode</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="6-digit Pincode"
                        maxLength="10"
                        {...register('pincode')}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Referred By / Reference</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Friend, Teacher, Social Media, Walk-in, etc."
                        {...register('referredBy')}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message / Queries</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      placeholder="Any specific questions regarding hostel, coaching, or transportation..."
                      {...register('message')}
                    ></textarea>
                  </div>

                  <input type="hidden" value="10th Standard" {...register('lastCompletedClass')} />

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '0.5rem' }}>
                      <input
                        type="checkbox"
                        defaultChecked
                        style={{ marginTop: '3px' }}
                        {...register('consentGiven', { required: 'Consent is required' })}
                      />
                      <span>I confirm the above details are authentic and consent to college contacting me regarding admissions.</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        defaultChecked
                        style={{ marginTop: '3px' }}
                        {...register('whatsappConsent')}
                      />
                      <span>Send official admission updates, counselling schedule, and alerts to my mobile on WhatsApp.</span>
                    </label>
                  </div>

                  <button type="submit" disabled={submitting} className="btn btn-gold btn-lg" style={{ width: '100%' }}>
                    {submitting ? 'Submitting Form...' : 'Submit Admission Enquiry'}
                  </button>
                </form>
              )}
            </div>

            {/* Application Tracker & Required Documents */}
            <div>
              {/* Tracker Widget */}
              <div id="track" className="card" style={{ padding: '2rem', marginBottom: '2rem', borderTop: '4px solid var(--primary-700)' }}>
                <span className="section-subtitle">Live Status</span>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--primary-900)' }}>
                  Track Admission Enquiry Status
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Enter your reference number (e.g. <code>ADM-2026-1001</code>) to check the progress of your application.
                </p>

                <form onSubmit={onTrackEnquiry} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter ADM-2026-XXXX"
                    value={trackRef}
                    onChange={(e) => setTrackRef(e.target.value)}
                  />
                  <button type="submit" disabled={trackLoading} className="btn btn-primary" style={{ flexShrink: 0 }}>
                    <Search size={16} /> {trackLoading ? 'Searching...' : 'Track'}
                  </button>
                </form>

                {trackError && (
                  <div style={{ color: '#b91c1c', fontSize: '0.85rem', backgroundColor: '#fef2f2', padding: '0.5rem 0.75rem', borderRadius: '4px' }}>
                    {trackError}
                  </div>
                )}

                {trackResult && (
                  <div style={{ backgroundColor: 'var(--bg-page)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '700', color: 'var(--primary-900)' }}>{trackResult.referenceNo}</span>
                      <span className="badge" style={{
                        backgroundColor: trackResult.status === 'ADMITTED' ? '#d1fae5' : trackResult.status === 'NEW' ? '#dbeafe' : '#fef3c7',
                        color: trackResult.status === 'ADMITTED' ? '#065f46' : trackResult.status === 'NEW' ? '#1e40af' : '#b45309'
                      }}>
                        {trackResult.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                      <strong>Candidate:</strong> {trackResult.studentName}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      <strong>Stream:</strong> {trackResult.preferredStream} ({trackResult.preferredCombination})
                    </div>
                    {trackResult.followUpNotes && (
                      <div style={{ fontSize: '0.8rem', backgroundColor: '#ffffff', padding: '0.6rem', borderRadius: '4px', border: '1px dashed var(--border-subtle)' }}>
                        <strong>Office Note:</strong> {trackResult.followUpNotes}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Required Documents Checklist */}
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-900)' }}>
                  Required Documents for Admission
                </h3>
                <ul style={{ listStyle: 'none', fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.8' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '4px' }} />
                    Original 10th Standard / SSLC / CBSE / ICSE marks statement with 3 photocopies.
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '4px' }} />
                    Transfer Certificate (TC) issued by the last attended school.
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '4px' }} />
                    Conduct / Character Certificate from the head of the previous school.
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '4px' }} />
                    Migration Certificate (only for non-Karnataka state board students).
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '4px' }} />
                    Caste and Income Certificate (for SC / ST / OBC / EWS fee concession).
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '4px' }} />
                    6 passport-size photographs of the student and 2 of each parent.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scholarships & Fee Info */}
      <section id="scholarships" className="section">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle">Financial Support</span>
            <h2 className="section-title">Scholarships & Fee Concessions</h2>
            <p className="section-desc">
              We believe financial constraints should never halt talented learners from achieving their academic zenith.
            </p>
          </div>

          <div className="grid-3">
            <div className="card">
              <div style={{ width: '42px', height: '42px', backgroundColor: 'var(--gold-100)', color: 'var(--gold-600)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Award size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--primary-900)' }}>
                Merit Excellence Scholarship
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Up to 50% tuition fee waiver for students securing &gt; 95% aggregate in 10th / SSLC, and 25% waiver for students securing between 90% and 94.9%.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '42px', height: '42px', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Shield size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--primary-900)' }}>
                Government Post-Matric Welfare
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Facilitation of Karnataka State Scholarship Portal (SSP) post-matric applications for SC, ST, and Category-1 students conforming to govt mandates.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '42px', height: '42px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <FileCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--primary-900)' }}>
                Sports & Talent Concessions
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Special fee sponsorships for students who have represented district, state, or national tournaments in athletics, badminton, basketball, or chess.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
