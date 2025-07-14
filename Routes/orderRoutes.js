const express = require('express');
const orderController = require('../Controllers/orderController');
const auth = require('../Middleware/authentication'); // Adjust if you have auth middleware

const orderRouter = express.Router();

// Get all orders
orderRouter.get('/',auth.ownerJWT, orderController.getAllOrders);

// Get order by ID
orderRouter.get('/:id',auth.AuthJWT, orderController.getOrderById);

// Get orders by user ID
orderRouter.get('/user/:userId', auth.ownerJWT,orderController.getOrdersByUserId);

// Create new order
orderRouter.post('/', auth.AuthJWT,orderController.createOrder);

// Update order by ID
orderRouter.put('/:id',auth.AuthJWT, orderController.updateOrder);

// Delete order by ID
orderRouter.delete('/:id',auth.AuthJWT, orderController.deleteOrder);

// Mark order as paid
orderRouter.patch('/:id/pay',auth.ownerJWT, orderController.markAsPaid);

// Mark order as delivered
orderRouter.patch('/:id/deliver',auth.ownerJWT, orderController.markAsDelivered);

module.exports = orderRouter;
