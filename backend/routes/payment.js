const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { processPayment, getPaymentStatus } = require('../controllers/paymentController');

router.post('/:productId', protect, processPayment);
router.get('/:productId', protect, getPaymentStatus);

module.exports = router;
