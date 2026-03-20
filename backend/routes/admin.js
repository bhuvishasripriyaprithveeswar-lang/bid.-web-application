const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Bid = require('../models/Bid');
const Payment = require('../models/Payment');

router.use(protect, adminOnly);

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().populate('owner', 'name email').sort('-createdAt');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/bids', async (req, res) => {
  try {
    const bids = await Bid.find().populate('bidder', 'name email').populate('product', 'title').sort('-createdAt');
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/sales', async (req, res) => {
  try {
    // Sold products with owner (seller) and highest bidder (buyer)
    const sold = await Product.find({ status: 'sold' })
      .populate('owner', 'name email')
      .populate('highestBidder', 'name email')
      .sort('-updatedAt');

    // Attach payment info (paid/pending) to each product
    const productIds = sold.map(p => p._id);
    const payments = await Payment.find({ product: { $in: productIds } });
    const paymentMap = {};
    payments.forEach(pay => { paymentMap[pay.product.toString()] = pay; });

    const sales = sold.map(p => ({
      _id: p._id,
      title: p.title,
      seller: p.owner,
      buyer: p.highestBidder,
      finalPrice: p.currentBid,
      soldAt: p.updatedAt,
      paymentStatus: paymentMap[p._id.toString()]?.status || 'pending',
    }));

    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
