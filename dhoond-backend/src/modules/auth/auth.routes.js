const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authValidation = require('./auth.validation');
const verifyToken = require('../../middleware/authMiddleware');

/**
 * @route POST /api/v1/auth/sync
 * @desc  Sync Firebase user with local PostgreSQL database
 * @access Private
 */
router.post('/sync', verifyToken, authValidation.validateSync, authController.syncPartner);

/**
 * @route GET /api/v1/auth/profile
 * @desc  Get current partner profile
 * @access Private
 */
router.get('/profile', verifyToken, authController.getProfile);

module.exports = router;
