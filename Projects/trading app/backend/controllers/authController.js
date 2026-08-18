const authService = require('../services/authService');
const { successResponse } = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    const result = await authService.registerUser({ name, username, email, password });
    return successResponse(res, result, 'User registered successfully with $100,000 starting capital', 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    return successResponse(res, result, 'Logged in successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const userProfile = await authService.getUserProfile(req.user._id);
    return successResponse(res, { user: userProfile }, 'User profile retrieved', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
