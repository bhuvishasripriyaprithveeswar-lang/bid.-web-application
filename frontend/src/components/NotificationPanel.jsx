import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const BellIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const NotificationPanel = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch {}
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  const handleOpen = async () => {
    setOpen(o => !o);
    if (!open && unread > 0) {
      await api.put('/notifications/read');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const handleClick = (notif) => {
    setOpen(false);
    if (notif.link) navigate(notif.link);
  };

  return (
    <div className="notif-wrapper" ref={ref}>
      <span onClick={handleOpen} style={{ color: 'var(--muted)' }}>
        <BellIcon />
        {unread > 0 && <span className="notif-badge">{unread}</span>}
      </span>
      {open && (
        <div className="notif-dropdown">
          {notifications.length === 0
            ? <div className="notif-item">No notifications</div>
            : notifications.map(n => (
              <div key={n._id} className={`notif-item ${!n.read ? 'unread' : ''}`} onClick={() => handleClick(n)}>
                {n.message}
                <div style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: '.2rem' }}>
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
