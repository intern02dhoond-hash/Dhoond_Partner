const express = require('express');
const router = express.Router();
const partnerController = require('./partner.controller');
const partnerValidation = require('./partner.validation');
const verifyFirebaseToken = require('../../middleware/authMiddleware');

/**
 * Partner Routes
 * All routes are prefixed with /api/partner (configured in app.js)
 */

// Register a new partner
router.post('/register', verifyFirebaseToken, partnerValidation.validateRegistration, partnerController.registerPartner);

// Get partner profile
router.get('/profile', verifyFirebaseToken, partnerController.getProfile);

// Update partner profile
router.put('/profile', verifyFirebaseToken, partnerController.updateProfile);

// Toggle duty status (Online/Offline)
router.patch('/duty', verifyFirebaseToken, partnerController.toggleDuty);

// Update live location
router.patch('/location', verifyFirebaseToken, partnerValidation.validateLocation, partnerController.updateLocation);

module.exports = router;
