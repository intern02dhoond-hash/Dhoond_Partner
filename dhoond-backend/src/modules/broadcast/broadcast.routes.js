const express = require('express');
const router = express.Router();
const broadcastController = require('./broadcast.controller');
const verifyFirebaseToken = require('../../middleware/authMiddleware');

/**
 * Broadcast Routes
 * Prefix: /api/broadcast
 */

// Get active broadcasts (new jobs) for the current partner
router.get('/active', verifyFirebaseToken, broadcastController.getMyBroadcasts);

// Explicitly reject a broadcast
router.post('/reject/:broadcastId', verifyFirebaseToken, broadcastController.rejectBroadcast);

module.exports = router;
