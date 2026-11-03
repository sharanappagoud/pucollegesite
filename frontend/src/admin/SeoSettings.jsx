import React, { useState, useEffect } from 'react';
import { Globe, Save, Search, Share2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export const SeoSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm();
  const watchedTitle = watch('seo_meta_title', 'Masters Pre-University College Bengaluru | Top PU College for Science & Commerce');
  const watchedDesc = watch('seo_meta_description', 'Masters PU College (MPUC) offers integrated KCET, NEET, and JEE coaching alongside Karnataka Pre-University Board curriculum with modern laboratories and hostel facilities.');

  const fetchSettings = () => {
    setLoading(true);
    api.get('/admin/seo')
      .then(res => {
        if (res.success && res.data) {
          reset(res.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await api.post('/admin/seo', data);
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      alert(err.message || 'Failed to update SEO and social settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Loading SEO settings...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">SEO & Social Media Management</h1>
          <p className="admin-header-subtitle">
            Optimize search engine visibility, OpenGraph social cards, and official digital channels
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#dcfce7', color: '#15803d', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: '500' }}>
          <CheckCircle2 size={18} /> SEO & Social Media settings saved and updated successfully!
        </div>
      )}

      {/* Google Search Live Preview Card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid #2563eb' }}>
        <h4 style={{ fontSize: '0.92rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          Google Search Live Snippet Preview
        </h4>
        <div style={{ maxWidth: '600px', backgroundColor: '#ffffff', padding: '1rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.8rem', color: '#202124' }}>https://mpucollege.edu.in</div>
          <div style={{ fontSize: '1.15rem', color: '#1a0dab', fontWeight: '500', textDecoration: 'underline', marginTop: '0.15rem', cursor: 'pointer' }}>
            {watchedTitle || 'Website Title Not Configured'}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#4d5156', marginTop: '0.25rem', lineHeight: '1.4' }}>
            {watchedDesc || 'No search meta description added yet.'}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* SEO Meta Tags Section */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={20} style={{ color: 'var(--primary-700)' }} /> Search Engine Optimization (SEO)
          </h3>

          <div className="form-group">
            <label className="form-label">Global Meta Title (recommended 50-60 characters)</label>
            <input type="text" className="form-control" {...register('seo_meta_title')} />
          </div>

          <div className="form-group">
            <label className="form-label">Global Meta Description (recommended 140-160 characters)</label>
            <textarea rows="3" className="form-control" {...register('seo_meta_description')}></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Meta Keywords (comma-separated)</label>
            <input type="text" className="form-control" placeholder="PU College Bengaluru, KCET coaching, NEET PU college, PCMB admissions" {...register('seo_keywords')} />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">OpenGraph Social Share Image URL</label>
              <input type="text" className="form-control" placeholder="https://.../og-banner.jpg" {...register('og_image_url')} />
            </div>
            <div className="form-group">
              <label className="form-label">Google Analytics Measurement ID</label>
              <input type="text" className="form-control" placeholder="G-XXXXXXXXXX" {...register('google_analytics_id')} />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">XML Sitemap Link</label>
              <input type="text" className="form-control" placeholder="/sitemap.xml" {...register('sitemap_url')} />
            </div>
            <div className="form-group">
              <label className="form-label">Robots.txt Directive</label>
              <input type="text" className="form-control" placeholder="User-agent: * Allow: /" {...register('robots_txt')} />
            </div>
          </div>
        </div>

        {/* Social Media Channels */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Share2 size={20} style={{ color: 'var(--primary-700)' }} /> Official Social Media Handles
          </h3>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Facebook Page URL</label>
              <input type="text" className="form-control" placeholder="https://facebook.com/mpucollege" {...register('social_facebook')} />
            </div>
            <div className="form-group">
              <label className="form-label">Instagram Profile URL</label>
              <input type="text" className="form-control" placeholder="https://instagram.com/mpucollege" {...register('social_instagram')} />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Twitter / X Handle URL</label>
              <input type="text" className="form-control" placeholder="https://x.com/mpucollege" {...register('social_twitter')} />
            </div>
            <div className="form-group">
              <label className="form-label">YouTube Channel URL</label>
              <input type="text" className="form-control" placeholder="https://youtube.com/@mpucollege" {...register('social_youtube')} />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">LinkedIn Institutional Page</label>
              <input type="text" className="form-control" placeholder="https://linkedin.com/school/mpucollege" {...register('social_linkedin')} />
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp Official Channel</label>
              <input type="text" className="form-control" placeholder="https://wa.me/918023456789" {...register('social_whatsapp')} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="submit" disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save SEO & Social Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
