import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export const CATEGORIES = [
  { id: 'kicks',    label: 'kicks.' },
  { id: 'threads',  label: 'threads.' },
  { id: 'rigs',     label: 'rigs.' },
  { id: 'grails',   label: 'grails.' },
  { id: 'mobile',   label: 'mobile.' },
  { id: 'drip',     label: 'drip.' },
  { id: 'audio',    label: 'audio.' },
  { id: 'pixels',   label: 'pixels.' },
  { id: 'studio',   label: 'studio.' },
  { id: 'archive',  label: 'archive.' },
  { id: 'spaces',   label: 'spaces.' },
  { id: 'face',     label: 'face.' },
  { id: 'objects',  label: 'objects.' },
  { id: 'wellness', label: 'wellness.' },
  { id: 'kitchen',  label: 'kitchen.' },
];

const CreateProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', startingBid: '', category: 'kicks' });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('startingBid', form.startingBid);
      fd.append('category', form.category);
      images.forEach(img => fd.append('images', img));
      const { data } = await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate(`/product/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Create Listing</h1>
      <div className="card" style={{ maxWidth: 600 }}>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Starting Bid ($)</label>
            <input type="number" min="0" step="0.01" value={form.startingBid} onChange={e => setForm({ ...form, startingBid: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Images (up to 5)</label>
            <input type="file" accept="image/*" multiple onChange={e => setImages(Array.from(e.target.files).slice(0, 5))} />
          </div>
          <button className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Listing'}</button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
