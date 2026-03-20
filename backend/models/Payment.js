const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  buyer:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount:  { type: Number, required: true },
  status:  { type: String, enum: ['pending', 'completed'], default: 'pending' },
  cardLast4: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
