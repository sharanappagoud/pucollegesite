import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Edit2, Trash2, X, Eye, CheckCircle2, XCircle, Copy, Check, ExternalLink, Sparkles, Palette, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export const Banners = () => {
  const [activeTab, setActiveTab] = useState('banners'); // 'banners' | 'media'
  const [banners, setBanners] = useState([]);
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Modals
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);

  const { register: registerBanner, handleSubmit: handleBannerSubmit, reset: resetBanner, watch: watchBanner, setValue: setBannerValue } = useForm();
  const { register: registerMedia, handleSubmit: handleMediaSubmit, reset: resetMedia } = useForm();

  const handleBannerFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploadingBanner(true);
    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.success && res.data?.url) {
        setBannerValue('imageUrl', res.data.url);
      }
    } catch (err) {
      alert(err.message || 'File upload failed');
    } finally {
      setUploadingBanner(false);
      e.target.value = '';
    }
  };

  const handleQuickAddPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploadingBanner(true);
    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.success && res.data?.url) {
        const newBanner = {
          imageUrl: res.data.url,
          title: file.name ? file.name.replace(/\.[^/.]+$/, "") : `Campus Banner ${banners.length + 1}`,
          displayOrder: banners.length + 1,
          active: true
        };
        await api.post('/admin/banners', newBanner);
        fetchBanners();
        alert('Photo uploaded and added to Carousel successfully!');
      }
    } catch (err) {
      alert(err.message || 'Failed to upload photo');
    } finally {
      setUploadingBanner(false);
      e.target.value = '';
    }
  };

  const handleQuickReplacePhoto = async (banner, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.success && res.data?.url) {
        const updated = {
          ...banner,
          imageUrl: res.data.url
        };
        await api.post('/admin/banners', updated);
        fetchBanners();
        alert('Banner photo replaced successfully!');
      }
    } catch (err) {
      alert('Photo replacement failed: ' + (err.message || 'Error'));
    }
  };

  const fetchBanners = () => {
    setLoading(true);
    api.get('/admin/banners')
      .then(res => {
        if (res.success) setBanners(res.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const fetchMedia = () => {
    setLoading(true);
    api.get('/admin/banners/media')
      .then(res => {
        if (res.success) setMediaList(res.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (activeTab === 'banners') {
      fetchBanners();
    } else {
      fetchMedia();
    }
  }, [activeTab]);

  const openAddBanner = () => {
    setEditingBanner(null);
    resetBanner({
      title: '',
      subtitle: '',
      titleColor: '#FFFFFF',
      highlightText: '',
      highlightColor: '#E6CA65',
      subtitleColor: '#CBD5E1',
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
      displayOrder: banners.length + 1,
      active: true
    });
    setBannerModalOpen(true);
  };

  const openEditBanner = (b) => {
    setEditingBanner(b);
    resetBanner({
      ...b,
      titleColor: b?.titleColor || '#FFFFFF',
      highlightText: b?.highlightText || '',
      highlightColor: b?.highlightColor || '#E6CA65',
      subtitleColor: b?.subtitleColor || '#CBD5E1'
    });
    setBannerModalOpen(true);
  };

  // Helper for live preview of title with highlighted keywords and accent color
  const renderPreviewTitle = (title, highlightText, titleColor, highlightColor) => {
    if (!title) return <span style={{ color: titleColor || '#FFFFFF' }}>Your Slide Headline Appears Here</span>;
    const trimmedHl = highlightText ? highlightText.trim() : '';
    if (trimmedHl && title.includes(trimmedHl)) {
      const parts = title.split(trimmedHl);
      return (
        <span style={{ color: titleColor || '#FFFFFF' }}>
          {parts[0]}
          <span style={{ color: highlightColor || '#E6CA65', fontWeight: '800' }}>
            {trimmedHl}
          </span>
          {parts.slice(1).join(trimmedHl)}
        </span>
      );
    }
    return <span style={{ color: titleColor || '#FFFFFF' }}>{title}</span>;
  };

  const onBannerSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        id: editingBanner ? editingBanner.id : null,
        displayOrder: parseInt(data.displayOrder) || 0
      };
      const res = await api.post('/admin/banners', payload);
      if (res.success) {
        setBannerModalOpen(false);
        fetchBanners();
      }
    } catch (err) {
      alert(err.message || 'Failed to save banner');
    }
  };

  const handleDeleteBanner = async (id, title) => {
    if (window.confirm(`Delete banner "${title}"?`)) {
      try {
        await api.delete(`/admin/banners/${id}`);
        fetchBanners();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  const toggleBannerActive = async (id, currentStatus) => {
    try {
      await api.patch(`/admin/banners/${id}/active?active=${!currentStatus}`);
      fetchBanners();
    } catch (err) {
      alert(err.message || 'Failed to update banner status');
    }
  };

  const onMediaSubmit = async (data) => {
    try {
      const res = await api.post('/admin/banners/media', data);
      if (res.success) {
        setMediaModalOpen(false);
        fetchMedia();
      }
    } catch (err) {
      alert(err.message || 'Failed to add media asset');
    }
  };

  const handleDeleteMedia = async (id) => {
    if (window.confirm('Delete this media asset?')) {
      try {
        await api.delete(`/admin/banners/media/${id}`);
        fetchMedia();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Hero Banner Carousel & Photo Management</h1>
          <p className="admin-header-subtitle">
            Manage full-screen homepage hero photographs (auto-advancing every 5 seconds). Upload, replace, and reorder campus photos.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ExternalLink size={15} /> View Live Carousel
          </a>
          <label
            className="btn btn-gold"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
              margin: 0,
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
            }}
            title="Upload a photo from your computer to add to the carousel"
          >
            <Upload size={16} /> {uploadingBanner ? 'Uploading...' : 'Upload New Photo'}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleQuickAddPhoto}
              disabled={uploadingBanner}
            />
          </label>
          {activeTab === 'banners' ? (
            <button onClick={openAddBanner} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}>
              <Plus size={18} /> Add Slide URL
            </button>
          ) : (
            <button onClick={() => { resetMedia({ title: '', imageUrl: '', description: '' }); setMediaModalOpen(true); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}>
              <Plus size={18} /> Add Media Asset
            </button>
          )}
        </div>
      </div>

      {/* Info Callout */}
      <div style={{
        backgroundColor: '#f0fdf4',
        border: '1.5px solid #bbf7d0',
        borderRadius: '12px',
        padding: '0.9rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Sparkles size={20} color="#15803d" />
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#166534' }}>
              Pure Photo Hero Carousel Active (5-Second Auto-Transition)
            </div>
            <div style={{ fontSize: '0.8rem', color: '#15803d' }}>
              The homepage hero shows pure high-resolution photographs with NO text or color overlay, moving every 5 seconds. Click "Replace Photo" on any slide to update pictures instantly.
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('banners')}
          className={`btn ${activeTab === 'banners' ? 'btn-primary' : 'btn-outline-primary'}`}
          style={{ borderRadius: '8px', fontSize: '0.88rem', padding: '0.5rem 1.1rem' }}
        >
          Hero Banners ({banners.length})
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`btn ${activeTab === 'media' ? 'btn-primary' : 'btn-outline-primary'}`}
          style={{ borderRadius: '8px', fontSize: '0.88rem', padding: '0.5rem 1.1rem' }}
        >
          Media Library ({mediaList.length})
        </button>
      </div>

      {/* Hero Banners View */}
      {activeTab === 'banners' && (
        <div className="admin-table-card">
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Title & Subtitle</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                      <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
                    </td>
                  </tr>
                ) : banners.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No hero banners registered.
                    </td>
                  </tr>
                ) : (
                  banners.map((b) => (
                    <tr key={b.id}>
                      <td style={{ width: '160px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <img
                            src={b.imageUrl}
                            alt={b.title}
                            style={{ width: '145px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80'; }}
                          />
                          <label
                            className="btn btn-outline-primary btn-xs"
                            style={{
                              cursor: 'pointer',
                              margin: 0,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.35rem',
                              fontSize: '0.73rem',
                              padding: '0.22rem 0.5rem',
                              borderRadius: '4px'
                            }}
                            title="Replace this slide's photo directly from your computer"
                          >
                            <Upload size={12} /> Replace Photo
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => handleQuickReplacePhoto(b, e.target.files?.[0])}
                            />
                          </label>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: b.titleColor || 'var(--primary-900)' }}>{b.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.subtitle}</div>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.65rem', marginTop: '0.35rem', fontSize: '0.72rem' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: b.titleColor || '#FFFFFF', border: '1px solid #cbd5e1', display: 'inline-block' }}></span>
                            Title: <code style={{ fontSize: '0.7rem' }}>{b.titleColor || '#FFFFFF'}</code>
                          </span>
                          {b.highlightText && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: b.highlightColor || '#E6CA65', border: '1px solid #cbd5e1', display: 'inline-block' }}></span>
                              Highlight: <code style={{ fontSize: '0.7rem', color: b.highlightColor || '#E6CA65', fontWeight: 'bold' }}>{b.highlightText}</code>
                            </span>
                          )}
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: b.subtitleColor || '#CBD5E1', border: '1px solid #cbd5e1', display: 'inline-block' }}></span>
                            Subtitle: <code style={{ fontSize: '0.7rem' }}>{b.subtitleColor || '#CBD5E1'}</code>
                          </span>
                        </div>
                      </td>
                      <td style={{ fontWeight: '600', color: 'var(--primary-700)' }}>#{b.displayOrder}</td>
                      <td>
                        <button
                          onClick={() => toggleBannerActive(b.id, b.active)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.8rem',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '12px',
                            fontWeight: '600',
                            backgroundColor: b.active ? '#dcfce7' : '#fee2e2',
                            color: b.active ? '#166534' : '#991b1b'
                          }}
                        >
                          {b.active ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                          {b.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button onClick={() => openEditBanner(b)} className="btn-icon" title="Edit Banner" style={{ color: 'var(--primary-700)' }}>
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDeleteBanner(b.id, b.title)} className="btn-icon" title="Delete Banner" style={{ color: '#ef4444' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Media Library View */}
      {activeTab === 'media' && (
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
            </div>
          ) : mediaList.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No media assets found in library. Click "Add Media Asset" to store photos.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {mediaList.map((m) => (
                <div key={m.id} className="card" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <img
                    src={m.imageUrl}
                    alt={m.title}
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80'; }}
                  />
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--primary-900)' }}>{m.title}</div>
                    {m.description && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.description}</div>}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                    <button
                      onClick={() => copyToClipboard(m.imageUrl)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        color: copiedUrl === m.imageUrl ? '#16a34a' : 'var(--primary-700)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      {copiedUrl === m.imageUrl ? <Check size={14} /> : <Copy size={14} />}
                      {copiedUrl === m.imageUrl ? 'Copied' : 'Copy URL'}
                    </button>
                    <button
                      onClick={() => handleDeleteMedia(m.id)}
                      className="btn-icon"
                      title="Delete Media"
                      style={{ color: '#ef4444' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Banner Modal */}
      {bannerModalOpen && (
        <div className="modal-backdrop" onClick={() => setBannerModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setBannerModalOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>
              {editingBanner ? `Edit Carousel Slide: ${editingBanner.title}` : 'Add New Hero Carousel Slide'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Changes made here are immediately rendered in the public Homepage Owl Carousel slider.
            </p>

            {/* Live Visual Slide Preview */}
            <div style={{
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '1.25rem',
              background: `linear-gradient(rgba(7, 23, 44, 0.84), rgba(11, 37, 69, 0.90)), url("${watchBanner('imageUrl') || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80'}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: '1.5rem',
              color: '#ffffff',
              border: '1px solid #0b2545',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                padding: '0.25rem 0.65rem',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontWeight: '700',
                color: 'var(--gold-400)',
                marginBottom: '0.75rem',
                textTransform: 'uppercase'
              }}>
                <Sparkles size={12} /> Admissions Open 2026-27
              </div>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '800', lineHeight: '1.25', marginBottom: '0.5rem' }}>
                {renderPreviewTitle(
                  watchBanner('title'),
                  watchBanner('highlightText'),
                  watchBanner('titleColor'),
                  watchBanner('highlightColor')
                )}
              </h4>
              <p style={{
                fontSize: '0.84rem',
                color: watchBanner('subtitleColor') || '#cbd5e1',
                lineHeight: '1.45',
                marginBottom: 0,
                maxWidth: '540px'
              }}>
                {watchBanner('subtitle') || 'Detailed description of academic programs, entrance coaching, and campus opportunities.'}
              </p>
            </div>

            <form onSubmit={handleBannerSubmit(onBannerSubmit)}>
              <div className="form-group">
                <label className="form-label">Slide Headline / Main Title *</label>
                <input type="text" className="form-control" placeholder="e.g. Building Strong Foundations for Engineering, Medicine & Corporate Leadership" {...registerBanner('title', { required: true })} />
              </div>

              {/* Text Colors & Highlight Styling Section */}
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1rem 1.15rem',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem', fontWeight: '700', fontSize: '0.88rem', color: 'var(--primary-900)' }}>
                  <Palette size={16} style={{ color: 'var(--primary-600)' }} /> Text Color & Keyword Highlight Customization
                </div>

                <div className="grid-2" style={{ gap: '0.85rem' }}>
                  {/* Title Base Color */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                      Headline Base Color
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="color"
                        value={watchBanner('titleColor') || '#FFFFFF'}
                        onChange={(e) => setBannerValue('titleColor', e.target.value)}
                        style={{ width: '38px', height: '38px', padding: '2px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="#FFFFFF"
                        style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                        {...registerBanner('titleColor')}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Presets:</span>
                      {['#FFFFFF', '#F8FAFC', '#E2E8F0', '#FEF08A', '#93C5FD'].map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setBannerValue('titleColor', c)}
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: c,
                            border: '1px solid #94a3b8',
                            cursor: 'pointer'
                          }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Highlight Color */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                      Highlight Accent Color
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="color"
                        value={watchBanner('highlightColor') || '#E6CA65'}
                        onChange={(e) => setBannerValue('highlightColor', e.target.value)}
                        style={{ width: '38px', height: '38px', padding: '2px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="#E6CA65"
                        style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                        {...registerBanner('highlightColor')}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Presets:</span>
                      {['#E6CA65', '#F59E0B', '#FBBF24', '#38BDF8', '#34D399', '#F43F5E'].map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setBannerValue('highlightColor', c)}
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: c,
                            border: '1px solid #94a3b8',
                            cursor: 'pointer'
                          }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '0.85rem', marginTop: '0.85rem' }}>
                  {/* Highlight Phrase */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                      Headline Highlight Phrase / Words
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Engineering, Medicine & Corporate"
                      {...registerBanner('highlightText')}
                    />
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block', marginTop: '0.2rem' }}>
                      Exact phrase in headline to paint with the highlight accent color.
                    </small>
                  </div>

                  {/* Subtitle Color */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                      Sub-headline Text Color
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="color"
                        value={watchBanner('subtitleColor') || '#CBD5E1'}
                        onChange={(e) => setBannerValue('subtitleColor', e.target.value)}
                        style={{ width: '38px', height: '38px', padding: '2px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="#CBD5E1"
                        style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                        {...registerBanner('subtitleColor')}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Presets:</span>
                      {['#CBD5E1', '#E2E8F0', '#94A3B8', '#FFFFFF', '#FEF9E7'].map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setBannerValue('subtitleColor', c)}
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: c,
                            border: '1px solid #94a3b8',
                            cursor: 'pointer'
                          }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Sub-headline / Description</label>
                <textarea rows={2} className="form-control" placeholder="e.g. Rigorous Karnataka State Pre-University board education integrated with premier coaching..." {...registerBanner('subtitle')} />
              </div>
              <div className="form-group">
                <label className="form-label">Background Image File or Direct URL *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                  <input
                    type="file"
                    accept="image/*"
                    id="bannerImageFileInput"
                    style={{ display: 'none' }}
                    onChange={handleBannerFileUpload}
                  />
                  <label
                    htmlFor="bannerImageFileInput"
                    className="btn btn-outline-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', margin: 0 }}
                  >
                    <Upload size={14} /> {uploadingBanner ? 'Uploading file...' : 'Choose File from Computer'}
                  </label>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>or enter direct URL below</span>
                </div>
                <input type="text" className="form-control" placeholder="https://images.unsplash.com/photo-... or /uploads/..." {...registerBanner('imageUrl', { required: true })} />
                {watchBanner('imageUrl')?.includes('photos.google.com') && (
                  <div style={{ color: '#b45309', backgroundColor: '#fef3c7', padding: '0.45rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', marginTop: '0.4rem' }}>
                    ⚠️ <strong>Google Photos Link Detected</strong>: Google Photos links cannot be embedded directly on websites. Click <strong>"Choose File from Computer"</strong> above to upload the actual image file directly!
                  </div>
                )}
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
                  Use high-resolution 1920x800+ landscape images. Direct URLs or files uploaded from your computer.
                </small>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Display Order (1 = First Slide)</label>
                  <input type="number" min={1} className="form-control" {...registerBanner('displayOrder')} />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.75rem' }}>
                  <input type="checkbox" id="bannerActiveCheck" {...registerBanner('active')} />
                  <label htmlFor="bannerActiveCheck" style={{ margin: 0, fontSize: '0.88rem', cursor: 'pointer', fontWeight: '600' }}>
                    Active in Owl Carousel
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setBannerModalOpen(false)} className="btn btn-outline-primary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Carousel Slide</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Modal */}
      {mediaModalOpen && (
        <div className="modal-backdrop" onClick={() => setMediaModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '550px' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setMediaModalOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
              Add Image to Media Library
            </h3>
            <form onSubmit={handleMediaSubmit(onMediaSubmit)}>
              <div className="form-group">
                <label className="form-label">Asset Title / Caption *</label>
                <input type="text" className="form-control" {...registerMedia('title', { required: true })} />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL *</label>
                <input type="text" className="form-control" placeholder="https://images.unsplash.com/..." {...registerMedia('imageUrl', { required: true })} />
              </div>
              <div className="form-group">
                <label className="form-label">Description / Tags</label>
                <input type="text" className="form-control" placeholder="e.g. Science Laboratory, Campus Front" {...registerMedia('description')} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setMediaModalOpen(false)} className="btn btn-outline-primary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
