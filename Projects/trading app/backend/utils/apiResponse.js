/**
 * Standardized API Response Helpers
 */
const successResponse = (res, data = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, details = null) => {
  const payload = {
    success: false,
    message,
  };
  if (details) {
    payload.details = details;
  }
  return res.status(statusCode).json(payload);
};

module.exports = {
  successResponse,
  errorResponse,
};
