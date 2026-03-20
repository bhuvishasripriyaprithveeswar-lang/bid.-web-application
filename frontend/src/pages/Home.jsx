import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import CategoryGrid from '../components/CategoryGrid';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from './CreateProduct';

const Home = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  // category images can be overridden by admin uploads
  const [catImages, setCatImages] = useState({});

  const categories = CATEGORIES.map(c => ({ ...c, image: catImages[c.id] || null }));
  const activeCatLabel = CATEGORIES.find(c => c.id === activeCategory)?.label;

  const fetchProducts = async (q = '', cat = '') => {
    setLoading(true);
    try {
      const params = {};
      if (q)   params.search   = q;
      if (cat) params.category = cat;
      const { data } = await api.get('/products', { params });
      setProducts(data);
    } catch {}
    setLoading(false);
  };

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/wishlist');
      setWishlistIds(new Set(data.map(p => p._id)));
    } catch {}
  };

  const fetchCatImages = async () => {
    try {
      const { data } = await api.get('/categories');
      setCatImages(data);
    } catch {}
  };

  useEffect(() => { fetchProducts(); fetchCatImages(); }, []);
  useEffect(() => { fetchWishlist(); }, [user]);

  const selectCategory = (id) => {
    const next = activeCategory === id ? '' : id;
    setActiveCategory(next);
    fetchProducts(search, next);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search, activeCategory);
  };

  const handleWishlistChange = (productId, isNowWishlisted) => {
    setWishlistIds(prev => {
      const next = new Set(prev);
      isNowWishlisted ? next.add(productId) : next.delete(productId);
      return next;
    });
  };

  const handleImageUpdate = (catId, newUrl) => {
    setCatImages(prev => ({ ...prev, [catId]: newUrl }));
  };

  return (
    <div className="page">
      {/* Hero */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-.03em' }}>
          <span style={{ color: 'var(--danger)' }}>b</span>id.
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--muted)', marginTop: '.2rem' }}>the W is yours.</p>
        <p style={{ fontSize: '.9rem', color: 'var(--muted)', marginTop: '.1rem' }}>the essential move you didn't know you needed.</p>
      </div>

      {/* Category arch grid */}
      <div className="category-section">
        <div className="category-section-inner">
          <CategoryGrid
            categories={categories}
            activeCategory={activeCategory}
            onSelect={selectCategory}
            onImageUpdate={handleImageUpdate}
          />
        </div>
      </div>

      {/* Search */}
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          placeholder="Search items..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Search</button>
        {(search || activeCategory) && (
          <button className="btn btn-outline" type="button" onClick={() => {
            setSearch(''); setActiveCategory(''); fetchProducts();
          }}>Clear</button>
        )}
      </form>

      {activeCategory && (
        <p style={{ fontSize: '.85rem', color: 'var(--muted)', marginBottom: '1rem' }}>
          Showing <strong style={{ color: 'var(--primary)' }}>{activeCatLabel}</strong>
        </p>
      )}

      {loading ? <div className="spinner" /> : (
        products.length === 0
          ? <p style={{ color: 'var(--muted)' }}>No active auctions found.</p>
          : <div className="grid grid-3">
              {products.map(p => (
                <ProductCard
                  key={p._id}
                  product={p}
                  wishlisted={wishlistIds.has(p._id)}
                  onWishlistChange={handleWishlistChange}
                />
              ))}
            </div>
      )}
    </div>
  );
};

export default Home;
