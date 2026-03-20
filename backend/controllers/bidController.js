const Bid = require('../models/Bid');
const Product = require('../models/Product');

exports.placeBid = async (req, res) => {
  try {
    const { amount } = req.body;
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.status !== 'active') return res.status(400).json({ message: 'Bidding is closed' });
    if (product.owner.toString() === req.user._id.toString())
      return res.status(400).json({ message: 'Cannot bid on your own product' });
    if (amount <= product.currentBid)
      return res.status(400).json({ message: `Bid must be higher than current bid of $${product.currentBid}` });

    const bid = await Bid.create({ product: product._id, bidder: req.user._id, amount });
    product.currentBid = amount;
    product.highestBidder = req.user._id;
    await product.save();

    const populated = await bid.populate('bidder', 'name');

    // Emit real-time update to all clients watching this product
    req.io.to(product._id.toString()).emit('newBid', {
      productId: product._id,
      currentBid: amount,
      bidder: populated.bidder,
      bidId: bid._id,
      createdAt: bid.createdAt,
    });

    res.status(201).json({ bid: populated, currentBid: amount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBidHistory = async (req, res) => {
  try {
    const bids = await Bid.find({ product: req.params.productId })
      .populate('bidder', 'name email')
      .sort('-createdAt');
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllBids = async (req, res) => {
  try {
    const bids = await Bid.find().populate('bidder', 'name email').populate('product', 'title').sort('-createdAt');
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
