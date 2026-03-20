const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const { getProducts, getProduct, createProduct, stopBidding, getMyProducts, deleteProduct } = require('../controllers/productController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', getProducts);
router.get('/mine', protect, getMyProducts);
router.get('/:id', getProduct);
router.post('/', protect, upload.array('images', 5), createProduct);
router.put('/:id/stop', protect, stopBidding);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
