const express = require('express');
const orderController = require('../Controllers/orderController');
const auth = require('../Middleware/authentication'); // Adjust if you have auth middleware

const orderRouter = express.Router();

// Get all orders
orderRouter.get('/', orderController.getAllOrders);

// Get order by ID
orderRouter.get('/:id', orderController.getOrderById);

// Get orders by user ID
orderRouter.get('/user/:userId', orderController.getOrdersByUserId);

// Create new order
orderRouter.post('/', orderController.createOrder);

// Update order by ID
orderRouter.put('/:id', orderController.updateOrder);

// Delete order by ID
orderRouter.delete('/:id', orderController.deleteOrder);

// Mark order as paid
orderRouter.patch('/:id/pay', orderController.markAsPaid);

// Mark order as delivered
orderRouter.patch('/:id/deliver', orderController.markAsDelivered);

module.exports = orderRouter;
