const router = require('express').Router();
const ClickEvent = require('../models/ClickEvent');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/track — called from frontend on every tracked click (no auth required)
router.post('/', async (req, res) => {
  try {
    const { page, element, meta, userId } = req.body;
    if (!page || !element) return res.status(400).json({ message: 'page and element required' });
    await ClickEvent.create({
      user: userId || null,
      page,
      element,
      meta: meta || {},
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    });
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/track — admin: full raw log
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 200;
    const events = await ClickEvent.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(limit);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/track/summary — admin: aggregated stats
router.get('/summary', protect, adminOnly, async (req, res) => {
  try {
    const [byElement, byPage, byUser, total] = await Promise.all([
      // Top clicked elements
      ClickEvent.aggregate([
        { $group: { _id: '$element', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      // Top visited pages
      ClickEvent.aggregate([
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      // Most active users
      ClickEvent.aggregate([
        { $match: { user: { $ne: null } } },
        { $group: { _id: '$user', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'userInfo' } },
        { $unwind: '$userInfo' },
        { $project: { count: 1, name: '$userInfo.name', email: '$userInfo.email' } },
      ]),
      ClickEvent.countDocuments(),
    ]);

    res.json({ total, byElement, byPage, byUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
