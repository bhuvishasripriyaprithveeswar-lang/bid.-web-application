import { useState, useEffect } from 'react';
import api from '../../api/axios';

const Bar = ({ label, count, max }) => (
  <div style={{ marginBottom: '.6rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.82rem', marginBottom: '.2rem' }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      <span style={{ color: 'var(--muted)' }}>{count}</span>
    </div>
    <div style={{ background: 'var(--border)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: 4,
        width: `${Math.round((count / max) * 100)}%`,
        background: 'var(--primary)',
        transition: 'width .4s ease',
      }} />
    </div>
  </div>
);

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [log, setLog] = useState([]);
  const [tab, setTab] = useState('summary');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/track/summary'),
      api.get('/track?limit=100'),
    ]).then(([s, l]) => {
      setSummary(s.data);
      setLog(l.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="page">
      <h1 className="page-title">User Click Analytics</h1>

      {/* Total clicks */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Clicks', value: summary.total, color: '#2563eb' },
          { label: 'Unique Elements', value: summary.byElement.length, color: '#9333ea' },
          { label: 'Pages Tracked', value: summary.byPage.length, color: '#16a34a' },
          { label: 'Active Users', value: summary.byUser.length, color: '#ea580c' },
        ].map(s => (
          <div key={s.label} className="card" style={{ flex: 1, minWidth: 140, textAlign: 'center', borderTop: `4px solid ${s.color}` }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ color: 'var(--muted)', fontSize: '.82rem', marginTop: '.2rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
        {['summary', 'log'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: 'none', border: 'none', borderBottom: tab === t ? '2px solid var(--primary)' : '2px solid transparent',
            color: tab === t ? 'var(--primary)' : 'var(--muted)', fontWeight: tab === t ? 700 : 500,
            fontSize: '.9rem', cursor: 'pointer', padding: '.4rem .1rem', transition: 'all .15s',
          }}>
            {t === 'summary' ? 'Summary' : 'Raw Log'}
          </button>
        ))}
      </div>

      {tab === 'summary' && (
        <div className="grid grid-3" style={{ alignItems: 'start' }}>
          {/* Top elements */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Top Clicked Elements</h3>
            {summary.byElement.map(e => (
              <Bar key={e._id} label={e._id} count={e.count} max={summary.byElement[0].count} />
            ))}
          </div>

          {/* Top pages */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Most Visited Pages</h3>
            {summary.byPage.map(p => (
              <Bar key={p._id} label={p._id} count={p.count} max={summary.byPage[0].count} />
            ))}
          </div>

          {/* Most active users */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Most Active Users</h3>
            {summary.byUser.length === 0
              ? <p style={{ color: 'var(--muted)', fontSize: '.85rem' }}>No logged-in user clicks yet.</p>
              : summary.byUser.map(u => (
                <Bar key={u._id} label={`${u.name} (${u.email})`} count={u.count} max={summary.byUser[0].count} />
              ))
            }
          </div>
        </div>
      )}

      {tab === 'log' && (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Element</th>
                <th>Page</th>
                <th>Meta</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {log.map(e => (
                <tr key={e._id}>
                  <td style={{ fontSize: '.82rem' }}>
                    {e.user ? <><div style={{ fontWeight: 600 }}>{e.user.name}</div><div style={{ color: 'var(--muted)' }}>{e.user.email}</div></> : <span style={{ color: 'var(--muted)' }}>Guest</span>}
                  </td>
                  <td><span style={{ background: 'var(--bg)', padding: '.15rem .5rem', borderRadius: 4, fontSize: '.8rem', fontWeight: 600 }}>{e.element}</span></td>
                  <td style={{ color: 'var(--muted)', fontSize: '.82rem' }}>{e.page}</td>
                  <td style={{ fontSize: '.78rem', color: 'var(--muted)', maxWidth: 160 }}>{Object.keys(e.meta || {}).length > 0 ? JSON.stringify(e.meta) : '—'}</td>
                  <td style={{ fontSize: '.78rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{new Date(e.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Analytics;
