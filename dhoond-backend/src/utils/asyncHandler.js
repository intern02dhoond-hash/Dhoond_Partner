/**
 * A wrapper to handle asynchronous routes and pass errors to the next middleware
 * This avoids the need for repetitive try-catch blocks in controllers.
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

module.exports = asyncHandler;
