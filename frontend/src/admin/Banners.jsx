import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Edit2, Trash2, X, CheckCircle2, XCircle, Copy, Check, ExternalLink, Sparkles, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

/**
 * Admin Banner & Hero Photo Management
 * Pure Photo Manager – all text, subtitle, and color fields removed.
 * Gives admin full access to:
 *  - Upload new photos
 *  - Replace existing photos
 *  - Edit photo order & status
 *  - Delete / remove photos
 */
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

  // Upload file inside modal
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
        if (!watchBanner('title')) {
          setBannerValue('title', file.name ? file.name.replace(/\.[^/.]+$/, '') : `Campus Photo`);
        }
      }
    } catch (err) {
      alert(err.message || 'File upload failed');
    } finally {
      setUploadingBanner(false);
      e.target.value = '';
    }
  };

  // Quick 1-click photo upload from top header
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
          title: file.name ? file.name.replace(/\.[^/.]+$/, '') : `Campus Photo ${banners.length + 1}`,
          subtitle: '',
          titleColor: '#FFFFFF',
          highlightText: '',
          highlightColor: '#E6CA65',
          subtitleColor: '#CBD5E1',
          displayOrder: banners.length + 1,
          active: true
        };
        await api.post('/admin/banners', newBanner);
        fetchBanners();
        alert('Photo uploaded and added to the carousel successfully!');
      }
    } catch (err) {
      alert(err.message || 'Failed to upload photo');
    } finally {
      setUploadingBanner(false);
      e.target.value = '';
    }
  };

  // Quick 1-click photo replacement on row
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
        alert('Carousel photo replaced successfully!');
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
      title: `Campus Photo ${banners.length + 1}`,
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80',
      displayOrder: banners.length + 1,
      active: true
    });
    setBannerModalOpen(true);
  };

  const openEditBanner = (b) => {
    setEditingBanner(b);
    resetBanner({
      title: b?.title || `Campus Photo #${b?.displayOrder || 1}`,
      imageUrl: b?.imageUrl || '',
      displayOrder: b?.displayOrder || 1,
      active: b?.active ?? true
    });
    setBannerModalOpen(true);
  };

  const onBannerSubmit = async (data) => {
    try {
      const payload = {
        id: editingBanner ? editingBanner.id : null,
        title: data.title || `Campus Photo ${data.displayOrder || banners.length + 1}`,
        subtitle: '',
        titleColor: '#FFFFFF',
        highlightText: '',
        highlightColor: '#E6CA65',
        subtitleColor: '#CBD5E1',
        imageUrl: data.imageUrl,
        displayOrder: parseInt(data.displayOrder, 10) || 1,
        active: Boolean(data.active)
      };
      const res = await api.post('/admin/banners', payload);
      if (res.success) {
        setBannerModalOpen(false);
        fetchBanners();
      }
    } catch (err) {
      alert(err.message || 'Failed to save photo');
    }
  };

  const handleDeleteBanner = async (id, title) => {
    if (window.confirm(`Are you sure you want to remove this photo from the carousel?`)) {
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
      alert(err.message || 'Failed to update photo status');
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
      {/* Page Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Hero Carousel Photo Management</h1>
          <p className="admin-header-subtitle">
            Manage full-screen homepage hero photographs (auto-advancing every 5 seconds). Upload, replace, edit order, or remove photos.
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
            title="Upload a photo directly from your computer"
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
            <button
              onClick={openAddBanner}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}
            >
              <Plus size={18} /> Add Photo via URL
            </button>
          ) : (
            <button
              onClick={() => { resetMedia({ title: '', imageUrl: '', description: '' }); setMediaModalOpen(true); }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}
            >
              <Plus size={18} /> Add Media Asset
            </button>
          )}
        </div>
      </div>

      {/* Info Notice */}
      <div style={{
        backgroundColor: '#f0fdf4',
        border: '1.5px solid #bbf7d0',
        borderRadius: '12px',
        padding: '0.9rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <Sparkles size={20} color="#15803d" />
        <div>
          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#166534' }}>
            Pure Photo Hero Carousel Active (5-Second Auto-Transition)
          </div>
          <div style={{ fontSize: '0.8rem', color: '#15803d' }}>
            The homepage hero displays pure high-resolution photographs with NO text or overlay, advancing smoothly every 5 seconds. Use the controls below to upload new photos, replace images, edit order, or delete photos.
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
          Carousel Photos ({banners.length})
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`btn ${activeTab === 'media' ? 'btn-primary' : 'btn-outline-primary'}`}
          style={{ borderRadius: '8px', fontSize: '0.88rem', padding: '0.5rem 1.1rem' }}
        >
          Media Library ({mediaList.length})
        </button>
      </div>

      {/* Hero Banners / Photos View */}
      {activeTab === 'banners' && (
        <div className="admin-table-card">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '180px' }}>Photo Preview</th>
                <th>Photo Source / Information</th>
                <th style={{ width: '100px' }}>Order</th>
                <th style={{ width: '130px' }}>Status</th>
                <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
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
                    No photos added yet. Click <strong>"Upload New Photo"</strong> to add campus images.
                  </td>
                </tr>
              ) : (
                banners.map((b, idx) => (
                  <tr key={b.id || idx}>
                    {/* Photo Preview & Quick Replace */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        <img
                          src={b.imageUrl}
                          alt={b.title || `Campus Photo #${b.displayOrder}`}
                          style={{
                            width: '160px',
                            height: '92px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1.5px solid #cbd5e1',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                          }}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80';
                          }}
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
                            padding: '0.24rem 0.5rem',
                            borderRadius: '4px',
                            fontWeight: 600
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

                    {/* Photo Source / Info (Pure Photo info, no Title/Subtitle clutter) */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{
                          backgroundColor: '#e0e7ff',
                          color: '#3730a3',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '12px'
                        }}>
                          Slide #{b.displayOrder}
                        </span>
                        <span style={{
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          padding: '0.18rem 0.5rem',
                          borderRadius: '6px'
                        }}>
                          16:9 Landscape Photo
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: '#64748b',
                          wordBreak: 'break-all',
                          maxWidth: '480px',
                          lineHeight: '1.35',
                          marginTop: '0.25rem'
                        }}
                        title={b.imageUrl}
                      >
                        {b.imageUrl?.length > 70 ? `${b.imageUrl.substring(0, 70)}...` : b.imageUrl}
                      </div>
                    </td>

                    {/* Order */}
                    <td style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--primary-700)' }}>
                      #{b.displayOrder}
                    </td>

                    {/* Status */}
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
                          padding: '0.25rem 0.65rem',
                          borderRadius: '12px',
                          fontWeight: '600',
                          backgroundColor: b.active ? '#dcfce7' : '#fee2e2',
                          color: b.active ? '#166534' : '#991b1b',
                          transition: 'all 0.15s ease'
                        }}
                        title="Click to toggle Active / Inactive"
                      >
                        {b.active ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        {b.active ? 'Active' : 'Hidden'}
                      </button>
                    </td>

                    {/* Actions: Edit & Remove */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => openEditBanner(b)}
                          className="btn-icon"
                          title="Edit Photo Details"
                          style={{
                            color: 'var(--primary-700)',
                            backgroundColor: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            padding: '0.35rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(b.id, b.title)}
                          className="btn-icon"
                          title="Delete / Remove Photo"
                          style={{
                            color: '#ef4444',
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '6px',
                            padding: '0.35rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
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

      {/* ── Photo Add / Edit Modal (Clean: No Title, No Subtitle, Pure Photo Controls) ── */}
      {bannerModalOpen && (
        <div className="modal-backdrop" onClick={() => setBannerModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setBannerModalOpen(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-900)', marginBottom: '0.25rem', fontWeight: 700 }}>
              {editingBanner ? 'Edit Carousel Photo' : 'Add New Carousel Photo'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Upload or link a high-resolution photo. Changes appear immediately on the homepage slider.
            </p>

            {/* Clean Pure Photo Preview (No Text Overlays) */}
            <div style={{
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '1.25rem',
              backgroundColor: '#0a192f',
              height: '240px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #cbd5e1',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)'
            }}>
              <img
                src={watchBanner('imageUrl') || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80'}
                alt="Slide Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '0.75rem',
                left: '0.75rem',
                backgroundColor: 'rgba(10, 37, 64, 0.85)',
                color: '#fef08a',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                backdropFilter: 'blur(6px)'
              }}>
                📷 Live Photo Preview
              </div>
            </div>

            <form onSubmit={handleBannerSubmit(onBannerSubmit)}>
              {/* Image Upload & URL (Primary) */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                  Photo File or Direct Image URL *
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.6rem' }}>
                  <input
                    type="file"
                    accept="image/*"
                    id="bannerModalFileInput"
                    style={{ display: 'none' }}
                    onChange={handleBannerFileUpload}
                  />
                  <label
                    htmlFor="bannerModalFileInput"
                    className="btn btn-outline-primary btn-sm"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      cursor: 'pointer',
                      margin: 0,
                      fontWeight: 600,
                      backgroundColor: '#eff6ff'
                    }}
                  >
                    <Upload size={14} /> {uploadingBanner ? 'Uploading file...' : 'Choose File from Computer'}
                  </label>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    or paste direct Image URL below
                  </span>
                </div>

                <input
                  type="text"
                  className="form-control"
                  placeholder="https://images.unsplash.com/... or /uploads/..."
                  {...registerBanner('imageUrl', { required: true })}
                />

                {watchBanner('imageUrl')?.includes('photos.google.com') && (
                  <div style={{ color: '#b45309', backgroundColor: '#fef3c7', padding: '0.45rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', marginTop: '0.4rem' }}>
                    ⚠️ <strong>Google Photos Link Detected</strong>: Google Photos links cannot be embedded directly on websites. Click <strong>"Choose File from Computer"</strong> above to upload the actual image file directly!
                  </div>
                )}
                <small style={{ color: 'var(--text-muted)', fontSize: '0.74rem', display: 'block', marginTop: '0.35rem' }}>
                  Recommended: High-resolution landscape photo (1920x800 or 16:9 ratio).
                </small>
              </div>

              {/* Order & Active Status */}
              <div className="grid-2" style={{ gap: '1rem', marginTop: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.84rem' }}>
                    Display Order (1 = First Slide)
                  </label>
                  <input
                    type="number"
                    min={1}
                    className="form-control"
                    {...registerBanner('displayOrder')}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', paddingTop: '1.65rem', marginBottom: 0 }}>
                  <input
                    type="checkbox"
                    id="bannerActiveCheck"
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    {...registerBanner('active')}
                  />
                  <label htmlFor="bannerActiveCheck" style={{ margin: 0, fontSize: '0.88rem', cursor: 'pointer', fontWeight: 600 }}>
                    Active in Homepage Carousel
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={() => setBannerModalOpen(false)}
                  className="btn btn-outline-primary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ fontWeight: 600, padding: '0.5rem 1.25rem' }}
                >
                  {editingBanner ? 'Update Photo' : 'Save Photo'}
                </button>
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
