const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { protect, adminOnly } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `cat-${req.params.id}-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// In-memory store — replace with DB collection if you want persistence across restarts
const categoryImages = {};

router.patch('/:id', protect, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image provided' });
  const imageUrl = `/uploads/${req.file.filename}`;
  categoryImages[req.params.id] = imageUrl;
  res.json({ id: req.params.id, image: imageUrl });
});

router.get('/', (req, res) => {
  res.json(categoryImages);
});

module.exports = router;
