const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', watchlistController.getWatchlist);
router.post('/', watchlistController.addToWatchlist);
router.delete('/:symbol', watchlistController.removeFromWatchlist);

module.exports = router;
