const express = require('express');
const router = express.Router();
const orderController = require('./order.controller');
const verifyFirebaseToken = require('../../middleware/authMiddleware');

/**
 * Order Routes
 * Prefix: /api/order
 */

// Get current partner's orders
router.get('/my-orders', verifyFirebaseToken, orderController.getMyOrders);

// Get specific order details
router.get('/details/:publicId', verifyFirebaseToken, orderController.getOrderDetails);

// Accept a broadcasted order
router.post('/accept/:publicId', verifyFirebaseToken, orderController.acceptOrder);

// Update order status (arrived, progress, etc.)
router.patch('/status/:publicId', verifyFirebaseToken, orderController.updateStatus);

module.exports = router;
