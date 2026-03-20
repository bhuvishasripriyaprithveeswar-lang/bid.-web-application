import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/wishlist').then(({ data }) => {
      setProducts(data);
      setWishlistIds(new Set(data.map(p => p._id)));
    }).finally(() => setLoading(false));
  }, []);

  const handleWishlistChange = (productId, isNowWishlisted) => {
    if (!isNowWishlisted) {
      // Removed from wishlist — take it off this page immediately
      setProducts(prev => prev.filter(p => p._id !== productId));
      setWishlistIds(prev => { const n = new Set(prev); n.delete(productId); return n; });
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="page">
      <h1 className="page-title">My Wishlist</h1>
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤍</div>
          <p>No items in your wishlist yet.</p>
          <p style={{ fontSize: '.9rem', marginTop: '.4rem' }}>Hit the ♥ on any auction to save it here.</p>
        </div>
      ) : (
        <>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '.9rem' }}>
            {products.length} active {products.length === 1 ? 'auction' : 'auctions'} saved —
            ended auctions are removed automatically.
          </p>
          <div className="grid grid-3">
            {products.map(p => (
              <ProductCard
                key={p._id}
                product={p}
                wishlisted={wishlistIds.has(p._id)}
                onWishlistChange={handleWishlistChange}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;
