import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon, Plus, Trash2, Edit3, FolderPlus, Folder,
  X, Save, Eye, ArrowUpDown, RefreshCw, Camera, Link2, Tag,
  CheckCircle2, AlertCircle, Grid3X3, List, Upload
} from 'lucide-react';
import api from '../services/api';

export const GalleryManagement = () => {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [toast, setToast] = useState(null);

  // ─── Add/Edit Image Modal ─────────────────────────────────────────────────
  const [imageModal, setImageModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [imageForm, setImageForm] = useState({
    title: '', description: '', imageUrl: '', categoryId: '', displayOrder: 0
  });
  const [imageFormError, setImageFormError] = useState('');
  const [savingImage, setSavingImage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  // ─── Add Category Modal ───────────────────────────────────────────────────
  const [catModal, setCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [savingCat, setSavingCat] = useState(false);

  // ─── Preview Lightbox ─────────────────────────────────────────────────────
  const [preview, setPreview] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploadingFile(true);
    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.success && res.data?.url) {
        setImageForm(p => ({ ...p, imageUrl: res.data.url }));
        showToast('Image file uploaded successfully from computer!');
      }
    } catch (err) {
      showToast(err.message || 'File upload failed', 'error');
    } finally {
      setUploadingFile(false);
      e.target.value = '';
    }
  };

  const resolveImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80';
    if (url.includes('photos.google.com/photo/')) {
      return 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80';
    }
    return url;
  };

  // ─── Fetch data ───────────────────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, imgRes] = await Promise.allSettled([
        api.get('/admin/gallery/categories'),
        api.get('/admin/gallery/images' + (filterCat ? `?categoryId=${filterCat}` : ''))
      ]);
      if (catRes.status === 'fulfilled' && catRes.value?.success) {
        setCategories(catRes.value.data || []);
      }
      if (imgRes.status === 'fulfilled' && imgRes.value?.success) {
        setImages(imgRes.value.data || []);
      }
    } catch (err) {
      showToast('Failed to load gallery data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filterCat]);

  // ─── Open Image Modal ─────────────────────────────────────────────────────
  const openAddImage = () => {
    setEditingImage(null);
    setImageForm({ title: '', description: '', imageUrl: '', categoryId: '', displayOrder: images.length + 1 });
    setImageFormError('');
    setImageModal(true);
  };

  const openEditImage = (img) => {
    setEditingImage(img);
    setImageForm({
      title: img.title || '',
      description: img.description || '',
      imageUrl: img.imageUrl || '',
      categoryId: img.categoryId || '',
      displayOrder: img.displayOrder || 0,
    });
    setImageFormError('');
    setImageModal(true);
  };

  // ─── Save Image ───────────────────────────────────────────────────────────
  const handleSaveImage = async (e) => {
    e.preventDefault();
    if (!imageForm.title.trim()) { setImageFormError('Image title is required.'); return; }
    if (!imageForm.imageUrl.trim()) { setImageFormError('Image URL is required.'); return; }

    setSavingImage(true);
    setImageFormError('');
    try {
      const payload = {
        ...imageForm,
        categoryId: imageForm.categoryId ? Number(imageForm.categoryId) : null,
        displayOrder: Number(imageForm.displayOrder || 0),
      };
      const res = editingImage
        ? await api.put(`/admin/gallery/images/${editingImage.id}`, payload)
        : await api.post('/admin/gallery/images', payload);

      if (res.success) {
        showToast(editingImage ? 'Image updated!' : 'Image added to gallery!');
        setImageModal(false);
        fetchData();
      } else {
        setImageFormError(res.message || 'Save failed');
      }
    } catch (err) {
      setImageFormError(err.message || 'Could not save image');
    } finally {
      setSavingImage(false);
    }
  };

  // ─── Delete Image ─────────────────────────────────────────────────────────
  const handleDeleteImage = async (id, title) => {
    if (!window.confirm(`Delete image "${title}"? This cannot be undone.`)) return;
    try {
      const res = await api.delete(`/admin/gallery/images/${id}`);
      if (res.success) {
        showToast('Image deleted');
        fetchData();
      }
    } catch (err) {
      showToast('Failed to delete image', 'error');
    }
  };

  // ─── Add Category ─────────────────────────────────────────────────────────
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setSavingCat(true);
    try {
      const res = await api.post('/admin/gallery/categories', { name: newCatName.trim() });
      if (res.success) {
        showToast('Category created!');
        setCatModal(false);
        setNewCatName('');
        fetchData();
      }
    } catch (err) {
      showToast('Could not create category', 'error');
    } finally {
      setSavingCat(false);
    }
  };

  // ─── Delete Category ──────────────────────────────────────────────────────
  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? All images in this category will also be deleted.`)) return;
    try {
      const res = await api.delete(`/admin/gallery/categories/${id}`);
      if (res.success) {
        showToast('Category deleted');
        if (filterCat === id) setFilterCat(0);
        fetchData();
      }
    } catch (err) {
      showToast('Failed to delete category', 'error');
    }
  };

  const catName = (id) => categories.find(c => c.id === Number(id))?.name || 'Uncategorized';

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 9999,
          background: toast.type === 'error' ? '#fef2f2' : '#ecfdf5',
          border: `1.5px solid ${toast.type === 'error' ? '#fca5a5' : '#6ee7b7'}`,
          color: toast.type === 'error' ? '#991b1b' : '#065f46',
          padding: '0.85rem 1.25rem', borderRadius: '10px',
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: '0.9rem', fontWeight: 600,
          animation: 'slideInRight 0.3s ease',
        }}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          {toast.msg}
        </div>
      )}

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Camera size={26} color="var(--primary-700)" /> Campus Photo Gallery
          </h1>
          <p className="admin-header-subtitle">
            Manage carousel images and categories displayed on the public website
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => setCatModal(true)} className="btn btn-outline-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FolderPlus size={15} /> Add Category
          </button>
          <button onClick={openAddImage} className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10,37,64,0.15)' }}>
            <Plus size={16} /> Add Photo
          </button>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <div className="grid-4" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.2rem', borderLeft: '4px solid #1e40af' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>Total Photos</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-900)' }}>{images.length}</div>
        </div>
        <div className="card" style={{ padding: '1.2rem', borderLeft: '4px solid #d4af37' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>Categories</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#b8860b' }}>{categories.length}</div>
        </div>
        <div className="card" style={{ padding: '1.2rem', borderLeft: '4px solid #059669' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>Carousel Slides</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#065f46' }}>
            {Math.ceil(images.length / 3)}
          </div>
        </div>
        <div className="card" style={{ padding: '1.2rem', borderLeft: '4px solid #7c3aed' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>Viewing</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#7c3aed', paddingTop: '0.5rem' }}>
            {filterCat ? catName(filterCat) : 'All Photos'}
          </div>
        </div>
      </div>

      {/* ── Categories Chips + Filter ──────────────────────────────────────── */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '0.25rem' }}>
              <Folder size={14} style={{ verticalAlign: 'middle', marginRight: '0.2rem' }} />Category:
            </span>
            {[{ id: 0, name: 'All Photos' }, ...categories].map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCat(cat.id)}
                className={`btn btn-sm ${filterCat === cat.id ? 'btn-primary' : 'btn-outline-primary'}`}
                style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                {cat.name}
                {cat.id !== 0 && (
                  <span onClick={e => { e.stopPropagation(); handleDeleteCategory(cat.id, cat.name); }}
                    style={{ marginLeft: '0.25rem', opacity: 0.55, cursor: 'pointer', lineHeight: 1 }}>×</span>
                )}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setViewMode('grid')} className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}>
              <Grid3X3 size={14} />
            </button>
            <button onClick={() => setViewMode('list')} className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}>
              <List size={14} />
            </button>
            <button onClick={fetchData} className="btn btn-sm btn-outline-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ── Image Grid / List ─────────────────────────────────────────────── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <Camera size={32} style={{ display: 'block', margin: '0 auto 0.75rem', opacity: 0.4 }} />
          Loading gallery…
        </div>
      ) : images.length === 0 ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Camera size={40} style={{ display: 'block', margin: '0 auto 1rem', opacity: 0.3 }} />
          <p>No photos yet. Click <strong>Add Photo</strong> to upload your first image.</p>
        </div>
      ) : viewMode === 'grid' ? (
        // ─── Grid View ──────────────────────────────────────────────────────
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {images.map(img => (
            <div key={img.id} className="card" style={{ overflow: 'hidden', padding: 0, position: 'relative' }}>
              <div style={{ position: 'relative', height: '185px', overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => setPreview(img)}>
                <img
                  src={resolveImageUrl(img.imageUrl)}
                  alt={img.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  onError={e => {
                    e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  padding: '1.5rem 0.75rem 0.5rem',
                }}>
                  {img.categoryName && (
                    <span style={{
                      background: 'var(--gold-500)', color: '#07172C',
                      fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem',
                      borderRadius: '8px', textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>{img.categoryName}</span>
                  )}
                </div>
                <div style={{
                  position: 'absolute', top: '0.5rem', right: '0.5rem',
                  background: 'rgba(255,255,255,0.9)', borderRadius: '6px',
                  padding: '0.25rem 0.4rem', fontSize: '0.7rem', fontWeight: 700,
                  color: 'var(--text-muted)',
                }}>
                  #{img.displayOrder}
                </div>
              </div>
              <div style={{ padding: '0.85rem 1rem' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '0.2rem',
                  overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {img.title}
                </h4>
                {img.description && (
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4,
                    overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {img.description}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <button onClick={() => openEditImage(img)} className="btn btn-sm btn-outline-primary"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.78rem' }}>
                    <Edit3 size={13} /> Edit
                  </button>
                  <button onClick={() => handleDeleteImage(img.id, img.title)} className="btn btn-sm"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.78rem',
                      background: '#fef2f2', color: '#dc2626', border: '1.5px solid #fca5a5', borderRadius: 'var(--radius-sm)' }}>
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // ─── List View ──────────────────────────────────────────────────────
        <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border-subtle)' }}>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', width: 80 }}>Preview</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>Title & Description</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', width: 70 }}>Order</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {images.map((img, i) => (
                <tr key={img.id} style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <img
                      src={resolveImageUrl(img.imageUrl)}
                      alt={img.title}
                      loading="lazy"
                      style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                      onClick={() => setPreview(img)}
                      onError={e => {
                        e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary-900)', marginBottom: '0.15rem' }}>{img.title}</div>
                    {img.description && <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{img.description}</div>}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {img.categoryName
                      ? <span style={{ background: '#dbeafe', color: '#1e40af', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.76rem', fontWeight: 600 }}>{img.categoryName}</span>
                      : <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>—</span>}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {img.displayOrder}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                      <button onClick={() => openEditImage(img)} title="Edit" style={iconBtnStyle('#1e40af')}>
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => setPreview(img)} title="Preview" style={iconBtnStyle('#059669')}>
                        <Eye size={14} />
                      </button>
                      <button onClick={() => handleDeleteImage(img.id, img.title)} title="Delete" style={iconBtnStyle('#dc2626')}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Add/Edit Image Modal ───────────────────────────────────────────── */}
      {imageModal && (
        <div style={modalOverlayStyle} onClick={() => setImageModal(false)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ImageIcon size={20} color="var(--primary-700)" />
                {editingImage ? 'Edit Gallery Photo' : 'Add New Photo'}
              </h3>
              <button onClick={() => setImageModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Image Preview */}
            {imageForm.imageUrl && (
              <div style={{ marginBottom: '1rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: 160, background: '#f1f5f9' }}>
                <img src={imageForm.imageUrl} alt="preview" loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => e.currentTarget.style.display = 'none'} />
              </div>
            )}

            <form onSubmit={handleSaveImage}>
              {imageFormError && (
                <div style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  {imageFormError}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Photo Title *</label>
                  <input className="form-control" placeholder="e.g. Science Lab Practical Session"
                    value={imageForm.title}
                    onChange={e => setImageForm(p => ({ ...p, title: e.target.value }))} required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>
                    <Link2 size={13} style={{ verticalAlign: 'middle' }} /> Image File or Direct URL *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                    <input
                      type="file"
                      accept="image/*"
                      id="galleryImageFileInput"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />
                    <label
                      htmlFor="galleryImageFileInput"
                      className="btn btn-outline-primary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', margin: 0 }}
                    >
                      <Upload size={14} /> {uploadingFile ? 'Uploading file...' : 'Choose File from Computer'}
                    </label>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>or paste link below</span>
                  </div>
                  <input
                    className="form-control"
                    placeholder="https://images.unsplash.com/... or /uploads/..."
                    value={imageForm.imageUrl}
                    onChange={e => setImageForm(p => ({ ...p, imageUrl: e.target.value }))}
                    required
                  />
                  {imageForm.imageUrl?.includes('photos.google.com') && (
                    <div style={{ color: '#b45309', backgroundColor: '#fef3c7', padding: '0.45rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', marginTop: '0.4rem' }}>
                      ⚠️ <strong>Google Photos Link Detected</strong>: Google Photos links cannot be embedded directly on websites. Click <strong>"Choose File from Computer"</strong> above to upload the image file directly!
                    </div>
                  )}
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.76rem', display: 'block', marginTop: '0.25rem' }}>
                    Supports JPG, PNG, WEBP uploaded from device or direct web image links.
                  </small>
                </div>
                <div>
                  <label style={labelStyle}><Tag size={13} style={{ verticalAlign: 'middle' }} /> Category</label>
                  <select className="form-select"
                    value={imageForm.categoryId}
                    onChange={e => setImageForm(p => ({ ...p, categoryId: e.target.value }))}>
                    <option value="">— No Category —</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}><ArrowUpDown size={13} style={{ verticalAlign: 'middle' }} /> Display Order</label>
                  <input className="form-control" type="number" min={0} max={999}
                    value={imageForm.displayOrder}
                    onChange={e => setImageForm(p => ({ ...p, displayOrder: e.target.value }))} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Caption / Description</label>
                  <textarea className="form-control" rows={2}
                    placeholder="Brief description of what's shown in this photo…"
                    value={imageForm.description}
                    onChange={e => setImageForm(p => ({ ...p, description: e.target.value }))} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setImageModal(false)} className="btn btn-outline-primary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={savingImage}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {savingImage ? <><RefreshCw size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Saving…</> : <><Save size={14} /> {editingImage ? 'Update Photo' : 'Add to Gallery'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Add Category Modal ─────────────────────────────────────────────── */}
      {catModal && (
        <div style={modalOverlayStyle} onClick={() => setCatModal(false)}>
          <div style={{ ...modalStyle, maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FolderPlus size={18} color="var(--primary-700)" /> New Gallery Category
              </h3>
              <button onClick={() => setCatModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveCategory}>
              <label style={labelStyle}>Category Name *</label>
              <input className="form-control" placeholder="e.g. Cultural Events"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)} required autoFocus style={{ marginBottom: '1.25rem' }} />
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setCatModal(false)} className="btn btn-outline-primary">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={savingCat}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {savingCat ? 'Saving…' : <><Save size={14} /> Create Category</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Lightbox Preview ───────────────────────────────────────────────── */}
      {preview && (
        <div style={{ ...modalOverlayStyle, background: 'rgba(0,0,0,0.88)' }} onClick={() => setPreview(null)}>
          <div style={{ maxWidth: 800, width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: '#07172C' }}
            onClick={e => e.stopPropagation()}>
            <img src={preview.imageUrl} alt={preview.title} style={{ width: '100%', maxHeight: '60vh', objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: '1.25rem 1.5rem', color: '#f1f5f9' }}>
              {preview.categoryName && (
                <span style={{ background: 'var(--gold-500)', color: '#07172C', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '10px', marginBottom: '0.5rem', display: 'inline-block' }}>
                  {preview.categoryName}
                </span>
              )}
              <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, margin: '0.35rem 0 0.25rem' }}>{preview.title}</h3>
              {preview.description && <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{preview.description}</p>}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button onClick={() => { setPreview(null); openEditImage(preview); }} className="btn btn-sm btn-outline-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', color: '#e2e8f0' }}>
                  <Edit3 size={13} /> Edit This Photo
                </button>
                <button onClick={() => setPreview(null)} className="btn btn-sm"
                  style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <X size={13} /> Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideInRight { from { opacity:0; transform:translateX(24px); } to { opacity:1; transform:translateX(0); } }
      `}</style>
    </div>
  );
};

const labelStyle = {
  display: 'block', fontWeight: 600, fontSize: '0.82rem',
  color: 'var(--primary-900)', marginBottom: '0.35rem',
};

const modalOverlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
  zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '1rem', backdropFilter: 'blur(4px)',
};

const modalStyle = {
  background: '#fff', borderRadius: 'var(--radius-lg)',
  padding: '1.75rem', width: '100%', maxWidth: 600,
  boxShadow: '0 25px 60px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto',
};

const iconBtnStyle = (color) => ({
  background: 'none', border: `1.5px solid ${color}20`,
  color, borderRadius: '6px', padding: '0.3rem 0.5rem',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background 0.15s ease',
});

export default GalleryManagement;

