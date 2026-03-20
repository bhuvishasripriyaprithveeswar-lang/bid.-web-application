const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { placeBid, getBidHistory, getAllBids } = require('../controllers/bidController');

router.post('/:productId', protect, placeBid);
router.get('/:productId/history', getBidHistory);
router.get('/', protect, getAllBids); // admin use

module.exports = router;
