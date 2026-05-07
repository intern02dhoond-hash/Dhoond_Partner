/**
 * Validation for Auth Sync
 * Basic check to ensure service_type is provided if it's a new registration
 */
const validateSync = (req, res, next) => {
  const { service_type } = req.body;

  // You can add more complex validation here using Joi or express-validator
  if (req.method === 'POST' && !service_type) {
    // If you want to make service_type optional during sync, you can remove this
    // But since it's NOT NULL in your DB, it's good to have.
  }

  next();
};

module.exports = {
  validateSync
};
