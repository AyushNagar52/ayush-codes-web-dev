const { errorResponse } = require('../utils/apiResponse');

const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || res.statusCode;
  if (statusCode === 200) statusCode = 500;

  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `A record with this ${field} already exists.`;
    statusCode = 409;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    statusCode = 400;
  }

  // Handle CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    message = `Resource not found with id of ${err.value}`;
    statusCode = 404;
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error ${statusCode}]`, err);
  }

  return errorResponse(res, message, statusCode, err.details || null);
};

module.exports = { notFound, errorHandler };
