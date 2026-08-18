const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const AppError = require('../utils/customError');
const { INITIAL_CAPITAL } = require('../config/constants');
const mongoose = require('mongoose');

const registerUser = async ({ name, username, email, password }) => {
  // Check if email or username already taken
  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
  });

  if (existingUser) {
    if (existingUser.email.toLowerCase() === email.toLowerCase()) {
      throw new AppError('An account with this email address already exists', 409);
    }
    if (existingUser.username.toLowerCase() === username.toLowerCase()) {
      throw new AppError('This username is already taken', 409);
    }
  }

  // Create User and default Portfolio
  const user = await User.create({
    name,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
  });

  await Portfolio.create({
    userId: user._id,
    initialCapital: INITIAL_CAPITAL,
    cashBalance: INITIAL_CAPITAL,
  });

  const token = user.getSignedJwtToken();

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = user.getSignedJwtToken();

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const portfolio = await Portfolio.findOne({ userId });

  return {
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    initialCapital: portfolio ? portfolio.initialCapital : INITIAL_CAPITAL,
    cashBalance: portfolio ? portfolio.cashBalance : INITIAL_CAPITAL,
  };
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
