const Notification = require('../Models/notificationsModel');
const asyncWrapper = require('../Middleware/async');
const BadRequest = require('../Error/BadRequest');
const NotFound = require('../Error/NotFound');
const User = require('../Models/user');

// ========== Helper to create a single user-based notification ==========
const createNotification = async ({ user, message, type }) => {
  if (!user || !message) {
    console.warn('Notification skipped: User ID or message is missing.');
    return;
  }

  try {
    const userExists = await User.findById(user);
    if (!userExists) {
      console.warn(`Notification skipped: User with ID "${user}" not found.`);
      return;
    }

    const newNotification = new Notification({
      user: userExists._id,
      message,
      type,
    });

    await newNotification.save();
    return newNotification;
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

// ========== Helper to create a system/global notification ==========
const createNotifications = async ({ message, type }) => {
  if (!message) {
    console.warn('Notification skipped: message is missing.');
    return;
  }

  try {
    const newNotification = new Notification({ message, type });
    await newNotification.save();
    return newNotification;
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

// ========== Controller: Get all notifications ==========
const getAllNotifications = asyncWrapper(async (req, res) => {
  const notifications = await Notification.find().populate('user');
  res.status(200).json({ notifications });
});

// ========== Controller: Get notifications for a specific user ==========
const getNotificationsByUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const notifications = await Notification.find({ user: id });
  res.status(200).json({ notifications });
});

// ========== Controller: Get order notifications ==========
const getOrderNotifications = asyncWrapper(async (req, res) => {
  const notifications = await Notification.find({ type: 'Order' })
    .populate('user', 'names email')
    .sort({ createdAt: -1 });

  if (!notifications.length) {
    return res.status(404).json({ message: 'No notifications found for orders' });
  }

  res.status(200).json({ notifications });
});

// ========== Controller: Get restaurant notifications ==========
const getRestaurantNot = asyncWrapper(async (req, res) => {
  const notifications = await Notification.find({ type: 'Restaurant' })
    .populate('user', 'names email')
    .sort({ createdAt: -1 });

  if (!notifications.length) {
    return res.status(404).json({ message: 'No notifications found for restaurants' });
  }

  res.status(200).json({ notifications });
});

// ========== Controller: Get menu notifications ==========
const getMenuNot = asyncWrapper(async (req, res) => {
  const notifications = await Notification.find({ type: 'Menu' })
    .populate('user', 'names email')
    .sort({ createdAt: -1 });

  if (!notifications.length) {
    return res.status(404).json({ message: 'No notifications found for menus' });
  }

  res.status(200).json({ notifications });
});

// ========== Controller: Delete a notification by ID ==========
const deleteNotification = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const deleted = await Notification.findByIdAndDelete(id);

  if (!deleted) {
    return next(new NotFound(`No notification found with ID ${id}`));
  }

  res.status(200).json({ message: 'Notification deleted successfully.' });
});

// ========== Export all ========== //
module.exports = {
  createNotification,
  createNotifications,
  getAllNotifications,
  getNotificationsByUser,
  getOrderNotifications,
  getRestaurantNot,
  getMenuNot,
  deleteNotification
};
