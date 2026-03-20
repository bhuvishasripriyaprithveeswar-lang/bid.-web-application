import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const AllBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/bids').then(r => setBids(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="page">
      <h1 className="page-title">All Bids</h1>
      <div className="card">
        <table>
          <thead>
            <tr><th>Product</th><th>Bidder</th><th>Amount</th><th>Time</th></tr>
          </thead>
          <tbody>
            {bids.map(b => (
              <tr key={b._id}>
                <td style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => navigate(`/product/${b.product?._id}`)}>
                  {b.product?.title}
                </td>
                <td>{b.bidder?.name} <span style={{ color: 'var(--muted)', fontSize: '.8rem' }}>({b.bidder?.email})</span></td>
                <td style={{ color: 'var(--primary)', fontWeight: 700 }}>${b.amount}</td>
                <td style={{ color: 'var(--muted)', fontSize: '.82rem' }}>{new Date(b.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllBids;
