import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BidHistory from '../components/BidHistory';
import { io } from 'socket.io-client';
import useTrack from '../hooks/useTrack';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const track = useTrack();
  const [product, setProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, bRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/bids/${id}/history`),
        ]);
        setProduct(pRes.data);
        setBids(bRes.data);
      } catch { navigate('/'); }
      setLoading(false);
    };
    fetchData();

    // Socket.io for real-time bids
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    socketRef.current.emit('joinProduct', id);
    socketRef.current.on('newBid', (data) => {
      if (data.productId === id) {
        setProduct(prev => prev ? { ...prev, currentBid: data.currentBid, highestBidder: data.bidder } : prev);
        setBids(prev => [{ _id: data.bidId, bidder: data.bidder, amount: data.currentBid, createdAt: data.createdAt }, ...prev]);
      }
    });

    return () => {
      socketRef.current?.emit('leaveProduct', id);
      socketRef.current?.disconnect();
    };
  }, [id]);

  const handleBid = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    track('place-bid-btn', { productId: id, amount: Number(amount) });
    try {
      await api.post(`/bids/${id}`, { amount: Number(amount) });
      setSuccess('Bid placed successfully!');
      setAmount('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place bid');
    }
  };

  const handleStop = async () => {
    if (!window.confirm('Stop bidding and select winner?')) return;
    track('stop-bidding-btn', { productId: id });
    try {
      const { data } = await api.put(`/products/${id}/stop`);
      setProduct(data);
      setSuccess('Bidding stopped. Winner notified!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to stop bidding');
    }
  };

  if (loading) return <div className="spinner" />;
  if (!product) return null;

  const isOwner = user?._id === product.owner?._id;
  const isWinner = product.status === 'sold' && user?._id === product.highestBidder?._id;

  return (
    <div className="page">
      <div className="product-detail">
        <div className="product-images">
          {product.images?.length > 0
            ? product.images.map((img, i) => <img key={i} src={img} alt={`product-${i}`} />)
            : <img src="https://placehold.co/600x350?text=No+Image" alt="placeholder" />
          }
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '.5rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{product.title}</h1>
            <span className={`badge badge-${product.status}`}>{product.status}</span>
          </div>
          <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>{product.description}</p>
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '.85rem', color: 'var(--muted)' }}>Current Bid</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>₹{product.currentBid}</div>
            {product.highestBidder && (
              <div style={{ fontSize: '.85rem', color: 'var(--muted)' }}>
                Highest bidder: <strong>{product.highestBidder.name}</strong>
              </div>
            )}
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Bid form for non-owners */}
          {user && !isOwner && product.status === 'active' && (
            <form onSubmit={handleBid} style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem' }}>
              <input
                type="number" min={product.currentBid + 1} step="0.01"
                placeholder={`Min ₹${product.currentBid + 1}`}
                value={amount} onChange={e => setAmount(e.target.value)}
                style={{ flex: 1, padding: '.6rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                required
              />
              <button className="btn btn-primary" type="submit">Place Bid</button>
            </form>
          )}

          {/* Owner controls */}
          {isOwner && product.status === 'active' && (
            <button className="btn btn-danger" onClick={handleStop}>Stop Bidding</button>
          )}

          {/* Winner payment button */}
          {isWinner && (
            <button className="btn btn-success" onClick={() => navigate(`/payment/${product._id}`)}>
              🎉 You Won! Proceed to Payment
            </button>
          )}

          {!user && (
            <p style={{ color: 'var(--muted)' }}>
              <a href="/login" style={{ color: 'var(--primary)' }}>Login</a> to place a bid.
            </p>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Bid History</h3>
        <BidHistory bids={bids} />
      </div>
    </div>
  );
};

export default ProductDetail;
