import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products/mine').then(r => setProducts(r.data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    await api.delete(`/products/${id}`);
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>My Listings</h1>
        <button className="btn btn-primary" onClick={() => navigate('/create-product')}>+ New Listing</button>
      </div>
      {products.length === 0
        ? <p style={{ color: 'var(--muted)' }}>No listings yet.</p>
        : (
          <div className="card">
            <table>
              <thead>
                <tr><th>Title</th><th>Starting Bid</th><th>Current Bid</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => navigate(`/product/${p._id}`)}>{p.title}</td>
                    <td>${p.startingBid}</td>
                    <td>${p.currentBid}</td>
                    <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                    <td style={{ display: 'flex', gap: '.5rem' }}>
                      <button className="btn btn-outline" onClick={() => navigate(`/product/${p._id}`)}>View</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(p._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  );
};

export default MyProducts;
