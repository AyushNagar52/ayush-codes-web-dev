const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const { handleValidationErrors } = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');

router.post('/register', authLimiter, registerValidator, handleValidationErrors, authController.register);
router.post('/login', authLimiter, loginValidator, handleValidationErrors, authController.login);
router.get('/me', protect, authController.getMe);

module.exports = router;
