const ApiError = require("../utils/apiError");

/**
 * Global Error Handling Middleware
 * Catches all errors passed via next(err) and formats them into a standard JSON response.
 */
const errorMiddleware = (err, req, res, next) => {
  let { statusCode, message, errors } = err;

  // If the error is not an instance of our custom ApiError, 
  // it might be a database error or a generic programmer error.
  if (!(err instanceof ApiError)) {
    statusCode = statusCode || 500;
    message = message || "Internal Server Error";
    errors = [];
    
    // Log unexpected errors for debugging
    console.error("UNEXPECTED ERROR:", err);
  }

  // Final structured response
  const response = {
    success: false,
    message,
    errors: errors || [],
    // Include stack trace only in development environment
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  return res.status(statusCode).json(response);
};

module.exports = errorMiddleware;
