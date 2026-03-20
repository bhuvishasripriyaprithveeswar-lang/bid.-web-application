import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, products: 0, bids: 0, sales: 0, profit: 0, clicks: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/admin/users'),
      api.get('/admin/products'),
      api.get('/admin/bids'),
      api.get('/admin/sales'),
      api.get('/track/summary'),
      api.get('/track/summary'),
    ]).then(([u, p, b, s, t]) => {
      const sales = s.data.length;
      setStats({ users: u.data.length, products: p.data.length, bids: b.data.length, sales, profit: sales * 2, clicks: t.data.total });
    });
  }, []);

  const cards = [
    { label: 'Total Users',        value: stats.users,           link: '/admin/users',    color: '#2563eb' },
    { label: 'Total Products',     value: stats.products,        link: '/admin/products', color: '#16a34a' },
    { label: 'Total Bids',         value: stats.bids,            link: '/admin/bids',     color: '#9333ea' },
    { label: 'Total Transactions', value: stats.sales,             link: '/admin/sales',      color: '#ea580c' },
    { label: 'Your Profit',        value: `₹${stats.profit || 0}`, link: '/admin/sales',      color: '#0891b2' },
    { label: 'Total Clicks',       value: stats.clicks,            link: '/admin/analytics',  color: '#9333ea' },
  ];

  return (
    <div className="page">
      <h1 className="page-title">Admin Dashboard</h1>
      <div className="grid grid-3">
        {cards.map(c => (
          <Link to={c.link} key={c.label}>
            <div className="card" style={{ textAlign: 'center', borderTop: `4px solid ${c.color}` }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: c.color }}>{c.value}</div>
              <div style={{ color: 'var(--muted)', marginTop: '.3rem' }}>{c.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
