const express = require('express');
const router = express.Router();
const otpController = require('./otp.controller');
const verifyFirebaseToken = require('../../middleware/authMiddleware');

/**
 * OTP Routes
 * Prefix: /api/otp
 */

// Verify arrival OTP
router.post('/verify-arrival/:publicId', verifyFirebaseToken, otpController.verifyArrival);

// Verify completion OTP
router.post('/verify-completion/:publicId', verifyFirebaseToken, otpController.verifyCompletion);

module.exports = router;
