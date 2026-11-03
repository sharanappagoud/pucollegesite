import React, { useState, useEffect } from 'react';
import { Newspaper, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchNews = () => {
    setLoading(true);
    api.get('/admin/news')
      .then(res => res.success && setNews(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openAddModal = () => {
    setEditingArticle(null);
    reset({
      title: '',
      category: 'Academics',
      excerpt: '',
      content: '',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      published: true
    });
    setModalOpen(true);
  };

  const openEditModal = (article) => {
    setEditingArticle(article);
    reset(article);
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        id: editingArticle ? editingArticle.id : null
      };
      const res = await api.post('/admin/news', payload);
      if (res.success) {
        setModalOpen(false);
        fetchNews();
      }
    } catch (err) {
      alert(err.message || 'Failed to save news article');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this news article?')) {
      try {
        await api.delete(`/admin/news/${id}`);
        fetchNews();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">News & Announcements</h1>
          <p className="admin-header-subtitle">
            Publish college announcements, examination results, and press releases
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(10, 37, 64, 0.15)' }}>
          <Plus size={16} /> Create News Article
        </button>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Published Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Loading news...
                </td>
              </tr>
            ) : news.map(item => (
              <tr key={item.id}>
                <td>
                  <strong>{item.title}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {item.excerpt?.substring(0, 80)}...
                  </div>
                </td>
                <td>
                  <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                    {item.category}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem' }}>{item.publishedAt}</td>
                <td>
                  <span className="badge" style={{
                    backgroundColor: item.published ? '#dcfce7' : '#fee2e2',
                    color: item.published ? '#15803d' : '#991b1b'
                  }}>
                    {item.published ? 'PUBLISHED' : 'DRAFT'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openEditModal(item)} className="btn btn-outline-primary btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="btn btn-sm" style={{ padding: '0.3rem 0.6rem', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', position: 'relative'
          }}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
              {editingArticle ? `Edit Article: ${editingArticle.title}` : 'Publish New Article'}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Article Title *</label>
                  <input type="text" className="form-control" {...register('title', { required: true })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" {...register('category')}>
                    <option value="Academics">Academics</option>
                    <option value="Admissions">Admissions</option>
                    <option value="Coaching">Coaching</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Banner Image URL</label>
                <input type="text" className="form-control" {...register('imageUrl')} />
              </div>

              <div className="form-group">
                <label className="form-label">Short Summary / Excerpt *</label>
                <textarea rows="2" className="form-control" {...register('excerpt', { required: true })}></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Full Article Content *</label>
                <textarea rows="6" className="form-control" {...register('content', { required: true })}></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline-primary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save & Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
