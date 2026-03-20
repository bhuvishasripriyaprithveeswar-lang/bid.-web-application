import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

/* Pastel gradient per category */
const GRADIENTS = {
  kicks:   'linear-gradient(160deg,#fde8d8,#fbc4a0)',
  threads: 'linear-gradient(160deg,#d8f0fd,#a0d4fb)',
  rigs:    'linear-gradient(160deg,#ddfde8,#a0fbc4)',
  grails:  'linear-gradient(160deg,#fde8f8,#fba0e8)',
  mobile:  'linear-gradient(160deg,#fdfbd8,#fbf0a0)',
  drip:    'linear-gradient(160deg,#e8d8fd,#c4a0fb)',
  audio:   'linear-gradient(160deg,#d8fdfc,#a0f0fb)',
  pixels:  'linear-gradient(160deg,#fdd8d8,#fba0a0)',
  studio:  'linear-gradient(160deg,#d8e8fd,#a0c4fb)',
  archive: 'linear-gradient(160deg,#fdf5d8,#fbe4a0)',
  spaces:  'linear-gradient(160deg,#d8fde8,#a0fbb8)',
  face:    'linear-gradient(160deg,#fde8ee,#fba0b8)',
  objects: 'linear-gradient(160deg,#ede8fd,#c8a0fb)',
  wellness:'linear-gradient(160deg,#e8fdd8,#b8fba0)',
  kitchen: 'linear-gradient(160deg,#fdf0d8,#fbd8a0)',
};

/* Default placeholder images per category */
const DEFAULT_IMAGES = {
  kicks:   'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
  threads: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80',
  rigs:    '/OIP.jpg',
  grails:  'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&q=80',
  mobile:  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
  drip:    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
  audio:   'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
  pixels:  '/OIP (1).jpg',
  studio:  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80',
  archive: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  spaces:  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
  face:    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
  objects: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80',
  wellness:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
  kitchen: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
};

const CategoryCard = ({ cat, active, onSelect, isAdmin, onImageUpdate }) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [imgSrc, setImgSrc] = useState(cat.image || DEFAULT_IMAGES[cat.id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Instant preview
    const preview = URL.createObjectURL(file);
    setImgSrc(preview);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.patch(`/categories/${cat.id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImgSrc(data.image);
      onImageUpdate?.(cat.id, data.image);
    } catch {
      setImgSrc(cat.image || DEFAULT_IMAGES[cat.id]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={`cat-card${active ? ' cat-card--active' : ''}`}
      onClick={() => onSelect(cat.id)}
      title={cat.label}
    >
      {/* Arch / dome shape */}
      <div className="cat-arch" style={{ background: GRADIENTS[cat.id] }}>
        <img src={imgSrc} alt={cat.label} className="cat-arch-img" />

        {/* Admin upload overlay */}
        {isAdmin && (
          <button
            className="cat-upload-btn"
            onClick={(e) => { e.stopPropagation(); fileRef.current.click(); }}
            title="Change image"
          >
            {uploading ? '…' : '📷'}
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
      </div>

      {/* Label */}
      <span className="cat-label">{cat.label.replace('.', '').toUpperCase()}.</span>
    </div>
  );
};

const CategoryGrid = ({ categories, activeCategory, onSelect, onImageUpdate }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="cat-grid">
      {categories.map(cat => (
        <CategoryCard
          key={cat.id}
          cat={cat}
          active={activeCategory === cat.id}
          onSelect={onSelect}
          isAdmin={isAdmin}
          onImageUpdate={onImageUpdate}
        />
      ))}
    </div>
  );
};

export default CategoryGrid;
