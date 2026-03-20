import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/sales').then(r => setSales(r.data)).finally(() => setLoading(false));
  }, []);

  const PROFIT_PER_TRANSACTION = 2;
  const totalTransactions = sales.length;
  const adminProfit = totalTransactions * PROFIT_PER_TRANSACTION;

  if (loading) return <div className="spinner" />;

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Sales Overview</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="card" style={{ padding: '.6rem 1.2rem', textAlign: 'center', minWidth: 160 }}>
            <div style={{ fontSize: '.78rem', color: 'var(--muted)', fontWeight: 600 }}>TOTAL TRANSACTIONS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{totalTransactions}</div>
          </div>
          <div className="card" style={{ padding: '.6rem 1.2rem', textAlign: 'center', minWidth: 160 }}>
            <div style={{ fontSize: '.78rem', color: 'var(--muted)', fontWeight: 600 }}>YOUR PROFIT (₹2 × {totalTransactions})</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>₹{adminProfit}</div>
          </div>
        </div>
      </div>

      {sales.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>No sold items yet.</p>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Seller</th>
                <th>Buyer (Winner)</th>
                <th>Final Price</th>
                <th>Payment</th>
                <th>Sold At</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(s => (
                <tr key={s._id}>
                  <td
                    style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                    onClick={() => navigate(`/product/${s._id}`)}
                  >
                    {s.title}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{s.seller?.name ?? '—'}</div>
                    <div style={{ fontSize: '.78rem', color: 'var(--muted)' }}>{s.seller?.email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{s.buyer?.name ?? '—'}</div>
                    <div style={{ fontSize: '.78rem', color: 'var(--muted)' }}>{s.buyer?.email}</div>
                  </td>
                  <td style={{ color: 'var(--success)', fontWeight: 800, fontSize: '1.05rem' }}>
                    ₹{s.finalPrice.toLocaleString()}
                  </td>
                  <td>
                    <span className={`badge ${s.paymentStatus === 'completed' ? 'badge-active' : 'badge-closed'}`}>
                      {s.paymentStatus}
                    </span>
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: '.82rem', whiteSpace: 'nowrap' }}>
                    {new Date(s.soldAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Sales;
