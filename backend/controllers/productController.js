const Product = require('../models/Product');
const Notification = require('../models/Notification');

exports.getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = { status: 'active' };
    if (search) filter.$text = { $search: search };
    if (category) filter.category = category;
    const products = await Product.find(filter).populate('owner', 'name email').sort('-createdAt');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('owner', 'name email').populate('highestBidder', 'name email');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, description, startingBid, category } = req.body;
    if (!title || !description || !startingBid)
      return res.status(400).json({ message: 'All fields required' });
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    const product = await Product.create({ title, description, startingBid, currentBid: startingBid, images, category: category || 'objects', owner: req.user._id });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.stopBidding = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('highestBidder', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    if (product.status !== 'active')
      return res.status(400).json({ message: 'Bidding already closed' });

    product.status = product.highestBidder ? 'sold' : 'closed';
    await product.save();

    if (product.highestBidder) {
      await Notification.create({
        user: product.highestBidder._id,
        message: `You won the product "${product.title}"! Proceed to payment.`,
        link: `/payment/${product._id}`,
      });
      req.io.to(product.highestBidder._id.toString()).emit('notification', {
        message: `You won the product "${product.title}"! Proceed to payment.`,
        link: `/payment/${product._id}`,
      });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user._id }).sort('-createdAt');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const isOwner = product.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
