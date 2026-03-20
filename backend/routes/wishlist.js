const router = require('express').Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');

// GET /api/wishlist — return user's wishlist, auto-remove closed/sold items
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    const active = user.wishlist.filter(p => p.status === 'active');

    // If any items were removed, persist the cleaned list
    if (active.length !== user.wishlist.length) {
      user.wishlist = active.map(p => p._id);
      await user.save();
    }

    res.json(active);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/wishlist/:productId — toggle add/remove
router.post('/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const idx = user.wishlist.indexOf(req.params.productId);
    if (idx === -1) {
      user.wishlist.push(req.params.productId);
    } else {
      user.wishlist.splice(idx, 1);
    }
    await user.save();

    res.json({ wishlisted: idx === -1, count: user.wishlist.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
