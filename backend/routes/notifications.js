const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getNotifications, markRead } = require('../controllers/notificationController');

router.get('/', protect, getNotifications);
router.put('/read', protect, markRead);

module.exports = router;
