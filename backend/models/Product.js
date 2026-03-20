const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  description:  { type: String, required: true },
  images:       [{ type: String }],
  startingBid:  { type: Number, required: true, min: 0 },
  currentBid:   { type: Number, default: 0 },
  highestBidder:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  owner:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:       { type: String, enum: ['active', 'closed', 'sold'], default: 'active' },
  category:     { type: String, default: 'objects' },
}, { timestamps: true });

productSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
