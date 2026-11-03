import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit2, Trash2, X, Search, Globe, CheckCircle2, XCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export const Pages = () => {
  const [pages, setPages] = useState([]);
  const [filteredPages, setFilteredPages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchPages = () => {
    setLoading(true);
    api.get('/admin/pages')
      .then(res => {
        if (res.success) {
          setPages(res.data || []);
          setFilteredPages(res.data || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredPages(pages);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredPages(
        pages.filter(
          p =>
            p.title?.toLowerCase().includes(q) ||
            p.slug?.toLowerCase().includes(q) ||
            p.subtitle?.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, pages]);

  const openAddModal = () => {
    setEditingPage(null);
    reset({
      slug: '',
      title: '',
      subtitle: '',
      content: '',
      metaDescription: '',
      published: true
    });
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingPage(p);
    reset(p);
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        id: editingPage ? editingPage.id : null
      };
      const res = await api.post('/admin/pages', payload);
      if (res.success) {
        setModalOpen(false);
        fetchPages();
      }
    } catch (err) {
      alert(err.message || 'Failed to save page');
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await api.delete(`/admin/pages/${id}`);
        fetchPages();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      await api.patch(`/admin/pages/${id}/publish?published=${!currentStatus}`);
      fetchPages();
    } catch (err) {
      alert(err.message || 'Failed to update publication status');
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Page Content Management</h1>
          <p className="admin-header-subtitle">
            Publish and manage dynamic landing pages, institutional policies, and static web pages
          </p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}>
          <Plus size={18} /> Add New Page
        </button>
      </div>

      {/* Search Bar */}
      <div className="admin-search-card">
        <div className="admin-search-bar">
          <Search size={18} style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search pages by title, slug, or subtitle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Pages Table */}
      <div className="admin-table-card">
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Page Title</th>
                <th>Slug URL</th>
                <th>Meta Description</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
                    <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Loading pages...</p>
                  </td>
                </tr>
              ) : filteredPages.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No pages found matching your search.
                  </td>
                </tr>
              ) : (
                filteredPages.map((page) => (
                  <tr key={page.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--primary-900)' }}>{page.title}</div>
                      {page.subtitle && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{page.subtitle}</div>
                      )}
                    </td>
                    <td>
                      <span style={{ 
                        fontFamily: 'monospace', 
                        fontSize: '0.82rem', 
                        backgroundColor: '#f1f5f9', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '4px',
                        color: 'var(--primary-700)'
                      }}>
                        /{page.slug}
                      </span>
                    </td>
                    <td style={{ maxWidth: '280px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {page.metaDescription ? (
                        <span>{page.metaDescription.length > 70 ? page.metaDescription.slice(0, 70) + '...' : page.metaDescription}</span>
                      ) : (
                        <em>Not set</em>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => togglePublish(page.id, page.published)}
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
                          backgroundColor: page.published ? '#dcfce7' : '#fee2e2',
                          color: page.published ? '#166534' : '#991b1b'
                        }}
                      >
                        {page.published ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        {page.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => openEditModal(page)}
                          className="btn-icon"
                          title="Edit Page"
                          style={{ color: 'var(--primary-700)' }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(page.id, page.title)}
                          className="btn-icon"
                          title="Delete Page"
                          style={{ color: '#ef4444' }}
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
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setModalOpen(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
              {editingPage ? `Edit Page: ${editingPage.title}` : 'Create New CMS Page'}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Page Title *</label>
                  <input type="text" className="form-control" {...register('title', { required: true })} />
                </div>
                <div className="form-group">
                  <label className="form-label">URL Slug (e.g. campus-tour) *</label>
                  <input type="text" className="form-control" {...register('slug', { required: true })} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subtitle / Tagline</label>
                <input type="text" className="form-control" {...register('subtitle')} />
              </div>

              <div className="form-group">
                <label className="form-label">Meta Description (for SEO)</label>
                <input type="text" className="form-control" placeholder="Search engine snippet summary" {...register('metaDescription')} />
              </div>

              <div className="form-group">
                <label className="form-label">Page Content (HTML or formatted text) *</label>
                <textarea rows="8" className="form-control" style={{ fontFamily: 'inherit' }} {...register('content', { required: true })}></textarea>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="publishedCheck" {...register('published')} />
                <label htmlFor="publishedCheck" style={{ margin: 0, fontSize: '0.9rem', cursor: 'pointer' }}>
                  Publish this page immediately to the public website
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline-primary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
