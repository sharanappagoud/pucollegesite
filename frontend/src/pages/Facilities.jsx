import React, { useState, useEffect } from 'react';
import { 
  Building, Microscope, BookOpen, Monitor, 
  Trophy, Coffee, Music, CheckCircle2, Image as ImageIcon 
} from 'lucide-react';
import api from '../services/api';

const defaultFacilities = [
  {
    id: 1,
    title: 'Advanced Science & Research Laboratories',
    category: 'Laboratories',
    description: 'Fully equipped Physics, Chemistry, and Biology laboratories adhering strictly to Karnataka PU Board practical syllabus and safety regulations.',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    features: 'Individual experimental workstations, Modern digital apparatus & microscopes, Acid-resistant fume hoods, Certified laboratory safety protocol'
  },
  {
    id: 2,
    title: 'Central Digital Library & Reference Wing',
    category: 'Academic Resource',
    description: 'Quiet sanctuary housing over 15,000 reference volumes, standard state board textbooks, national entrance exam study material, and high-speed research terminals.',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    features: 'Delnet & Inflibnet e-journal access, Dedicated quiet study carrels, Automated barcode check-out system, Extensive entrance question bank archives'
  },
  {
    id: 3,
    title: 'High-Tech Computing & AI Hub',
    category: 'Technology',
    description: 'Contemporary computer centre with Gigabit fiber connectivity, modern workstations, and licensed development environments for Computer Science curriculum.',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    features: 'Intel Core i7 workstations, High-speed fiber internet, Dual-display projector seminar mode, Dedicated UPS power backup'
  },
  {
    id: 4,
    title: 'Sports Complex & Multi-Purpose Arena',
    category: 'Athletics & Fitness',
    description: 'Expansive outdoor and indoor sports facilities designed to foster sportsmanship, physical vigor, and team spirit among all collegiate students.',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    features: 'Standard basketball & volleyball courts, Indoor table tennis & chess pavilion, Qualified sports coaches, Annual inter-collegiate athletic meet'
  }
];

const defaultFacilityGallery = [
  {
    id: 'fac-gal-1',
    title: 'Physics Practical Lab',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'fac-gal-2',
    title: 'Central Reading Hall',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'fac-gal-3',
    title: 'Computer Lab Workstations',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'fac-gal-4',
    title: 'Campus Greenery & Walkways',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80'
  }
];

export const Facilities = () => {
  const [facilities, setFacilities] = useState(defaultFacilities);
  const [galleryImages, setGalleryImages] = useState(defaultFacilityGallery);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);

  useEffect(() => {
    api.get('/facilities')
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setFacilities(res.data);
        } else {
          setFacilities(defaultFacilities);
        }
      })
      .catch(() => setFacilities(defaultFacilities));

    api.get('/gallery/categories')
      .then(res => res.success && setCategories(res.data))
      .catch(() => {});

    fetchGallery(0);
  }, []);

  const fetchGallery = (catId) => {
    setSelectedCategory(catId);
    const param = catId > 0 ? `?categoryId=${catId}` : '';
    api.get(`/gallery${param}`)
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setGalleryImages(res.data);
        } else {
          setGalleryImages(defaultFacilityGallery);
        }
      })
      .catch(() => setGalleryImages(defaultFacilityGallery));
  };

  return (
    <div>
      {/* Banner */}
      <section style={{
        background: 'linear-gradient(rgba(7, 23, 44, 0.9), rgba(11, 37, 69, 0.94)), url("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        padding: '4.5rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <span className="section-subtitle" style={{ backgroundColor: 'rgba(212,175,55,0.2)', color: 'var(--gold-400)' }}>
            World-Class Infrastructure
          </span>
          <h1 style={{ fontSize: '2.75rem', color: '#ffffff', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Campus Facilities & Laboratories
          </h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', color: '#cbd5e1', fontSize: '1.05rem' }}>
            A serene, vibrant learning environment equipped with modern science labs, computer suites, digital library, and sports amenities.
          </p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle">Infrastructure</span>
            <h2 className="section-title">Designed for Holistic Learning</h2>
          </div>

          <div className="grid-2" style={{ gap: '2.5rem' }}>
            {facilities.map(item => (
              <div key={item.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{ width: '100%', height: '260px', objectFit: 'cover' }}
                />
                <div style={{ padding: '1.75rem' }}>
                  <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', marginBottom: '0.5rem' }}>
                    {item.category}
                  </span>
                  <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', margin: '0.35rem 0 0.75rem 0' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                    {item.description}
                  </p>

                  {item.features && (
                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                      <h5 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        Key Highlights:
                      </h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {item.features.split(',').map((feat, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                            <CheckCircle2 size={15} color="#059669" /> {feat.trim()}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Section with Category Filter */}
      <section className="section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle">Visual Tour</span>
            <h2 className="section-title">Campus Life Image Gallery</h2>
            <p className="section-desc">
              Glimpses into daily student life, practical laboratory workshops, cultural celebrations, and athletics meets.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <button
              onClick={() => fetchGallery(0)}
              className={`btn btn-sm ${selectedCategory === 0 ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              All Photos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => fetchGallery(cat.id)}
                className={`btn btn-sm ${selectedCategory === cat.id ? 'btn-primary' : 'btn-outline-primary'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid-4" style={{ gap: '1.25rem' }}>
            {galleryImages.map(img => (
              <div key={img.id} style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#ffffff'
              }}>
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  style={{ width: '100%', height: '190px', objectFit: 'cover', transition: 'transform 0.2s ease' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{ padding: '0.9rem' }}>
                  <h4 style={{ fontSize: '0.92rem', color: 'var(--primary-900)', marginBottom: '0.2rem' }}>
                    {img.title}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {img.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
