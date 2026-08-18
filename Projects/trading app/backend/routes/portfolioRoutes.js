const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', portfolioController.getSummary);
router.get('/holdings', portfolioController.getHoldings);
router.get('/performance', portfolioController.getPerformance);

module.exports = router;
