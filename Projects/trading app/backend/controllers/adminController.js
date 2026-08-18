const adminService = require('../services/adminService');
const { successResponse } = require('../utils/apiResponse');

const getStats = async (req, res, next) => {
  try {
    const stats = await adminService.getPlatformStats();
    return successResponse(res, stats, 'Platform statistics retrieved');
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const result = await adminService.getAdminUsersList(page, limit);
    return successResponse(res, result, 'Users list retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getUsers,
};
