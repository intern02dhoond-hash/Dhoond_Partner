/**
 * Validators
 * Input validation functions for forms
 */

/**
 * Validate Indian phone number (10 digits)
 * @param {string} phone - Phone number
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate email address
 * @param {string} email - Email string
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate OTP (6 digits)
 * @param {string} otp - OTP string
 * @returns {boolean}
 */
export const isValidOTP = (otp) => {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

/**
 * Check if a string is not empty
 * @param {string} value - Input value
 * @returns {boolean}
 */
export const isNotEmpty = (value) => {
  return value && value.trim().length > 0;
};
