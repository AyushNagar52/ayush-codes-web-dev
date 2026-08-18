const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

router.get('/overview', marketController.getOverview);
router.get('/search', marketController.search);
router.get('/quote/:symbol', marketController.getQuote);
router.get('/profile/:symbol', marketController.getProfile);
router.get('/history/:symbol', marketController.getHistory);

module.exports = router;
