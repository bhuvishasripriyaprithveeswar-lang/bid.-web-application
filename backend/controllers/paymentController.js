const Payment = require('../models/Payment');
const Product = require('../models/Product');

exports.processPayment = async (req, res) => {
  try {
    const { cardNumber, expiry, cvv } = req.body;

    if (!cardNumber || !expiry || !cvv)
      return res.status(400).json({ message: 'All card fields required' });
    if (!/^\d{16}$/.test(cardNumber))
      return res.status(400).json({ message: 'Card number must be exactly 16 digits' });
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry))
      return res.status(400).json({ message: 'Expiry must be in MM/YY format' });
    if (!/^\d{3}$/.test(cvv))
      return res.status(400).json({ message: 'CVV must be exactly 3 digits' });

    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.highestBidder?.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'You are not the winner' });

    const existing = await Payment.findOne({ product: product._id, status: 'completed' });
    if (existing) return res.status(400).json({ message: 'Already paid' });

    const SITE_FEE = 2;
    const payment = await Payment.create({
      product: product._id,
      buyer: req.user._id,
      amount: product.currentBid + SITE_FEE,
      status: 'completed',
      cardLast4: cardNumber.slice(-4),
    });

    res.json({ message: 'Payment successful', payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findOne({ product: req.params.productId }).populate('product', 'title');
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
