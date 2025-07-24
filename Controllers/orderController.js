const asyncWrapper = require('../Middleware/async');
const Order = require('../Models/orderModel');
const NotFound = require('../Error/NotFound');
const {createNotification}=require('../Controllers/notificationController');
const BadRequest = require('../Error/BadRequest');

const orderController = {
  // Get all orders
  getAllOrders: asyncWrapper(async (req, res, next) => {
    const orders = await Order.find()
      .populate('user', 'firstName lastName email')
      .populate('restaurant', 'name address phone')
      .populate('items.menuItem', 'name price');
    res.status(200).json({ orders });
  }),

  // Get order by ID
  getOrderById: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('user', 'firstName lastName email')
      .populate('restaurant', 'name address phone')
      .populate('items.menuItem', 'name price');
    if (!order) {
      return next(new NotFound('Order not found'));
    }
    res.status(200).json({ order });
  }),
getOrdersByRestaurantId: asyncWrapper(async (req, res, next) => {
  const { restaurantId } = req.params;
  const orders = await Order.find({ restaurant: restaurantId })
    .populate('user', 'firstName lastName email')
    .populate('items.menuItem', 'name price');
  if (!orders.length) {
    return res.status(404).json({ message: 'No orders found for this restaurant' });
  }
  res.status(200).json({ orders });
}),
  // Get orders by user ID
  getOrdersByUserId: asyncWrapper(async (req, res, next) => {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId })
      .populate('restaurant', 'name address phone')
      .populate('items.menuItem', 'name price');
    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }
    res.status(200).json({ orders });
  }),

  // Create new order
  createOrder: asyncWrapper(async (req, res, next) => {
    const {
      user,
      restaurant,
      items,
      totalPrice,
      paymentMethod,
      deliveryAddress,
    } = req.body;

    if (!items || !items.length) {
      return next(new BadRequest('Order must contain at least one item'));
    }

    const newOrder = await Order.create({
      user,
      restaurant,
      items,
      totalPrice,
      paymentMethod,
      deliveryAddress,
    });
    const order = await Order.findById(newOrder._id).populate('items.menuItem');
    const itemNames = order.items.map(item => item.menuItem.name).join(', ');
  // --- Create a notification for the owner ---
    await createNotification({
      user: user, // The ID of the user to notify
      message: `New Order, "${itemNames}" has been made.`,
      type: 'Order', // As defined in your Notification schema
    });
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  }),
getOrdersByRestaurantId: asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const orders = await Order.find({ restaurant: id })
    .populate('user', 'firstName lastName email')
    .populate('items.menuItem', 'name price');
   if (!orders || orders.length === 0) { // Also a good practice to check for !orders
    return res.status(404).json({ message: 'No orders found for this restaurant' });
  }
  res.status(200).json({ orders });
}),
  // Update order status, payment, delivery etc.
  updateOrder: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true })
      .populate('user', 'firstName lastName email')
      .populate('restaurant', 'name address phone')
      .populate('items.menuItem', 'name price');

    if (!updatedOrder) {
      return next(new NotFound('Order not found'));
    }

    res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
  }),

  // Delete order
  deleteOrder: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return next(new NotFound('Order not found'));
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  }),

  // Mark order as paid
  markAsPaid: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return next(new NotFound('Order not found'));
    }
    order.isPaid = true;
    order.paidAt = new Date();

    await order.save();

    res.status(200).json({ message: 'Order marked as paid', order });
  }),

  // Mark order as delivered
  markAsDelivered: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return next(new NotFound('Order not found'));
    }
    order.isDelivered = true;
    order.deliveredAt = new Date();

    await order.save();

    res.status(200).json({ message: 'Order marked as delivered', order });
  }),
};

module.exports = orderController;
