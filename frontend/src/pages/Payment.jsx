import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Payment = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [form, setForm] = useState({ cardNumber: '', expiry: '', cvv: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};

    // Card number: must be exactly 16 digits, numbers only
    if (!/^\d{16}$/.test(form.cardNumber))
      errs.cardNumber = 'Card number must be exactly 16 digits (numbers only)';

    // Expiry: must match MM/YY, month 01–12, year >= current year
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) {
      errs.expiry = 'Expiry must be in MM/YY format';
    } else {
      const [mm, yy] = form.expiry.split('/');
      const now = new Date();
      const expDate = new Date(2000 + parseInt(yy), parseInt(mm) - 1, 1);
      if (expDate < new Date(now.getFullYear(), now.getMonth(), 1))
        errs.expiry = 'Card has expired';
    }

    // CVV: must be exactly 3 digits, numbers only
    if (!/^\d{3}$/.test(form.cvv))
      errs.cvv = 'CVV must be exactly 3 digits (numbers only)';

    return errs;
  };

  useEffect(() => {
    Promise.all([
      api.get(`/products/${productId}`),
      api.get(`/payment/${productId}`),
    ]).then(([pRes, payRes]) => {
      setProduct(pRes.data);
      setPaymentStatus(payRes.data);
    }).catch(() => navigate('/'));
  }, [productId]);

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setLoading(true);
    try {
      await api.post(`/payment/${productId}`, form);
      setSuccess('Payment successful! Thank you for your purchase.');
      setPaymentStatus({ status: 'completed' });
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <div className="spinner" />;

  const SITE_FEE = 2;
  const total = product.currentBid + SITE_FEE;

  return (
    <div className="page">
      <h1 className="page-title">Payment</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: 800 }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Order Summary</h3>
          <p><strong>Item:</strong> {product.title}</p>
          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Winning Bid</span>
              <span style={{ fontWeight: 600 }}>₹{product.currentBid}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Site Fee</span>
              <span style={{ fontWeight: 600, color: 'var(--danger)' }}>+₹2.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '.5rem' }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--primary)' }}>₹{total}</span>
            </div>
          </div>
        </div>
        <div className="card">
          {paymentStatus?.status === 'completed' || success ? (
            <div>
              <div className="alert alert-success">✅ {success || 'Payment already completed!'}</div>
              <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Home</button>
            </div>
          ) : (
            <>
              <h3 style={{ marginBottom: '1rem' }}>Card Details (Mock)</h3>
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handlePay}>
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    placeholder="1234567890123456"
                    maxLength={16}
                    value={form.cardNumber}
                    onChange={e => setForm({ ...form, cardNumber: e.target.value.replace(/\D/g, '') })}
                    style={fieldErrors.cardNumber ? { borderColor: 'var(--danger)' } : {}}
                  />
                  {fieldErrors.cardNumber && <span style={{ color: 'var(--danger)', fontSize: '.8rem' }}>{fieldErrors.cardNumber}</span>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Expiry</label>
                    <input
                      placeholder="MM/YY"
                      maxLength={5}
                      value={form.expiry}
                      onChange={e => {
                        let val = e.target.value.replace(/[^\d/]/g, '');
                        if (val.length === 2 && !val.includes('/')) val += '/';
                        setForm({ ...form, expiry: val });
                      }}
                      style={fieldErrors.expiry ? { borderColor: 'var(--danger)' } : {}}
                    />
                    {fieldErrors.expiry && <span style={{ color: 'var(--danger)', fontSize: '.8rem' }}>{fieldErrors.expiry}</span>}
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      placeholder="123"
                      maxLength={3}
                      value={form.cvv}
                      onChange={e => setForm({ ...form, cvv: e.target.value.replace(/\D/g, '') })}
                      style={fieldErrors.cvv ? { borderColor: 'var(--danger)' } : {}}
                    />
                    {fieldErrors.cvv && <span style={{ color: 'var(--danger)', fontSize: '.8rem' }}>{fieldErrors.cvv}</span>}
                  </div>
                </div>
                <button className="btn btn-success" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Processing...' : `Pay ₹${total}`}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
