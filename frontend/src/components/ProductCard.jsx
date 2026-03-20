import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import useTrack from '../hooks/useTrack';

const HeartIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? '#dc2626' : 'none'}
    stroke={filled ? '#dc2626' : '#94a3b8'} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ProductCard = ({ product, wishlisted = false, onWishlistChange }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const track = useTrack();

  const handleClick = () => {
    track('product-card', { productId: product._id, title: product.title, category: product.category });
    navigate(`/product/${product._id}`);
  };

  const handleHeart = async (e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    track('wishlist-toggle', { productId: product._id, action: wishlisted ? 'remove' : 'add' });
    try {
      const { data } = await api.post(`/wishlist/${product._id}`);
      onWishlistChange?.(product._id, data.wishlisted);
    } catch {}
  };

  const img = product.images?.[0] || 'https://placehold.co/400x200?text=No+Image';

  return (
    <div className="product-card" onClick={handleClick}>
      <div style={{ position: 'relative' }}>
        <img src={img} alt={product.title} />
        <button
          onClick={handleHeart}
          style={{
            position: 'absolute', top: '8px', right: '8px',
            background: 'none', border: 'none',
            padding: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform .15s',
          }}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <HeartIcon filled={wishlisted} />
        </button>
      </div>
      <div className="product-card-body">
        <div className="product-card-title">{product.title}</div>
        <div style={{ fontSize: '.82rem', color: 'var(--muted)', margin: '.3rem 0 .6rem' }}>
          {product.description.slice(0, 80)}...
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="product-card-bid">₹{product.currentBid}</span>
          <span className={`badge badge-${product.status}`}>{product.status}</span>
        </div>
        <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: '.4rem' }}>
          Seller: {product.owner?.name}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
