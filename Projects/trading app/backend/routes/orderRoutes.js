const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { orderValidator } = require('../validators/orderValidator');
const { handleValidationErrors } = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { orderLimiter } = require('../middleware/rateLimitMiddleware');

router.use(protect);

router.post('/buy', orderLimiter, orderValidator, handleValidationErrors, orderController.buyStock);
router.post('/sell', orderLimiter, orderValidator, handleValidationErrors, orderController.sellStock);
router.get('/', orderController.getOrders);

module.exports = router;
