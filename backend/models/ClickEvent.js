const mongoose = require('mongoose');

const clickEventSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  page:      { type: String, required: true },   // e.g. "/product/abc123"
  element:   { type: String, required: true },   // e.g. "place-bid-btn", "product-card"
  meta:      { type: Object, default: {} },       // extra context e.g. { productId, category }
  ip:        { type: String },
  userAgent: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ClickEvent', clickEventSchema);
