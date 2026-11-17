import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { WhatsAppIcon } from '../components/FloatingWhatsApp';

export const Contact = () => {
  const { collegeName, settings } = useSettings();
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmitContact = async (data) => {
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg(false);
    try {
      const res = await api.post('/contact-enquiries', data);
      if (res.success) {
        setSuccessMsg(true);
        reset();
      } else {
        setErrorMsg(res.message || 'Submission failed');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Could not send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Banner */}
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
            Get in Touch
          </span>
          <h1 style={{ fontSize: '2.75rem', color: '#ffffff', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Contact Sri Vidyodaya Composite Pre-University College
          </h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', color: '#cbd5e1', fontSize: '1.05rem' }}>
            We are here to answer all your academic inquiries, admission procedures, campus tours, and transportation details.
          </p>
        </div>
      </section>

      {/* Contact Cards & Form */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: '3.5rem', alignItems: 'flex-start' }}>
            {/* Campus Info & Map */}
            <div>
              <span className="section-subtitle">Reach Us</span>
              <h2 className="section-title">Campus Contact Information</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', padding: '0.75rem', borderRadius: '10px' }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>Campus Address</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                      #45, Vidya Soudha Campus, 18th Cross, Malleshwaram, Bengaluru, Karnataka - 560003
                    </p>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', padding: '0.75rem', borderRadius: '10px' }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>Phone Helplines</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      Main Campus: <a href="tel:+918023456789" style={{ color: 'var(--primary-700)', fontWeight: '600' }}>+91 80 2345 6789</a><br />
                      Admissions Desk: <a href="tel:+918023456790" style={{ color: 'var(--primary-700)', fontWeight: '600' }}>+91 80 2345 6790</a>
                    </p>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', padding: '0.75rem', borderRadius: '10px' }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>Email Support</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      General: <a href="mailto:info@svcpuc.edu.in" style={{ color: 'var(--primary-700)', fontWeight: '600' }}>info@svcpuc.edu.in</a><br />
                      Admissions: <a href="mailto:admissions@svcpuc.edu.in" style={{ color: 'var(--primary-700)', fontWeight: '600' }}>admissions@svcpuc.edu.in</a>
                    </p>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', padding: '0.75rem', borderRadius: '10px' }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>Office Timings</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      Monday – Friday: 8:30 AM – 4:30 PM<br />
                      Saturday: 8:30 AM – 1:30 PM (Sundays Closed)
                    </p>
                  </div>
                </div>

                {/* WhatsApp Business Official Helpdesk Card */}
                <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: '#f0fdf4', border: '1.5px solid #86efac' }}>
                  <div style={{ backgroundColor: '#25D366', color: '#ffffff', padding: '0.75rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <WhatsAppIcon size={26} color="#ffffff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.05rem', color: '#065f46', marginBottom: '0.2rem', fontWeight: '700' }}>Official WhatsApp Business Helpdesk</h4>
                    <p style={{ fontSize: '0.82rem', color: '#047857', marginBottom: '0.6rem' }}>
                      Fast-track chat with admissions coordinators and college counselors.
                    </p>
                    <WhatsAppButton
                      text="Chat on WhatsApp (+91 97439 88354)"
                      message="Hello MPUC College, I have a general enquiry regarding admissions, campus visits, or college timings."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="card" style={{ padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.45rem', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
                  Send an Enquiry Message
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Have questions about courses, combinations, or hostel facilities? Drop us a message.
                </p>

                {successMsg ? (
                  <div style={{
                    backgroundColor: '#ecfdf5',
                    border: '1.5px solid #059669',
                    borderRadius: 'var(--radius-md)',
                    padding: '2rem',
                    textAlign: 'center'
                  }}>
                    <CheckCircle2 size={42} color="#059669" style={{ margin: '0 auto 0.75rem auto' }} />
                    <h4 style={{ color: '#065f46', fontSize: '1.2rem' }}>Message Sent Successfully!</h4>
                    <p style={{ color: '#047857', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                      Thank you for contacting us. A college representative will respond to your query shortly.
                    </p>
                    <button
                      onClick={() => setSuccessMsg(false)}
                      className="btn btn-primary btn-sm"
                      style={{ marginTop: '1.25rem' }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmitContact)}>
                    {errorMsg && (
                      <div style={{ backgroundColor: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        {errorMsg}
                      </div>
                    )}

                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Your Name"
                        {...register('fullName', { required: 'Name is required' })}
                      />
                      {errors.fullName && <span className="form-error">{errors.fullName.message}</span>}
                    </div>

                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="your.email@example.com"
                          {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && <span className="form-error">{errors.email.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="Contact phone"
                          {...register('phone')}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Subject *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Inquiry regarding Bus Route from Hebbal"
                        {...register('subject', { required: 'Subject is required' })}
                      />
                      {errors.subject && <span className="form-error">{errors.subject.message}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Message *</label>
                      <textarea
                        rows="4"
                        className="form-control"
                        placeholder="Type your question or query here..."
                        {...register('message', { required: 'Message is required' })}
                      ></textarea>
                      {errors.message && <span className="form-error">{errors.message.message}</span>}
                    </div>

                    <button type="submit" disabled={submitting} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                      <Send size={18} /> {submitting ? 'Sending Message...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div style={{ marginTop: '4rem' }}>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', marginBottom: '1rem' }}>
              Campus Location Map
            </h3>
            <div style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-subtle)',
              height: '380px'
            }}>
              <iframe
                title="College Campus Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.6534578964344!2d77.5684!3d13.0033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae164627d3b9e5%3A0x6b8015792d770515!2sMalleshwaram%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1620000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
