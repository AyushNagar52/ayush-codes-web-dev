const Transaction = require('../models/Transaction');
const { successResponse } = require('../utils/apiResponse');

const getTransactions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = { userId: req.user._id };
    if (req.query.type) {
      filter.type = req.query.type;
    }

    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return successResponse(
      res,
      {
        transactions,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      },
      'Transactions retrieved'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
};
