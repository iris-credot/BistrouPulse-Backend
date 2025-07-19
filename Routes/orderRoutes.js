const express = require('express');
const orderController = require('../Controllers/orderController');
const auth = require('../Middleware/authentication'); // Adjust if you have auth middleware

const orderRouter = express.Router();

// Get all orders
orderRouter.get('/',auth.ownerJWT, orderController.getAllOrders);
orderRouter.get('/:id',auth.AuthJWT, orderController.getOrderById);
orderRouter.get('/user/:userId', auth.ownerJWT,orderController.getOrdersByUserId);
orderRouter.post('/', auth.AuthJWT,orderController.createOrder);
orderRouter.put('/:id',auth.AuthJWT, orderController.updateOrder);
orderRouter.delete('/:id',auth.AuthJWT, orderController.deleteOrder);
orderRouter.patch('/:id/pay',auth.ownerJWT, orderController.markAsPaid);
orderRouter.patch('/:id/deliver',auth.ownerJWT, orderController.markAsDelivered);

module.exports = orderRouter;
