const Notification = require('../Models/notificationsModel');
const asyncWrapper = require('../Middleware/async');
const BadRequest = require('../Error/BadRequest');
const NotFound = require('../Error/NotFound');
const User = require('../Models/user'); // Assuming user has an email field
 // A utility to send email

const createNotification = async ({ user, message, type }) => {
  if (!user || !message) {
    console.warn('Notification skipped: User ID or message is missing.');
    return;
  }

  try {
    // Ensure the user exists before creating a notification
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
    return newNotification; // Return the created notification
  } catch (error) {
    console.error('Failed to create notification:', error);
    // Decide if you want to throw the error or just log it
    // For non-critical notifications, just logging is often sufficient
  }
};

const createNotifications = async ({ user, message, type }) => {
  if ( !message) {
    console.warn('Notification skipped:  message is missing.');
    return;
  }

  try {
    // Ensure the user exists before creating a notification
   
    const newNotification = new Notification({
     
      message,
      type,
    });

    await newNotification.save();
    return newNotification; // Return the created notification
  } catch (error) {
    console.error('Failed to create notification:', error);
    // Decide if you want to throw the error or just log it
    // For non-critical notifications, just logging is often sufficient
  }
};



// Other controller methods
const notificationController = {
  getAllNotifications: asyncWrapper(async (req, res) => {
    const notifications = await Notification.find().populate('user');
    res.status(200).json({ notifications });
  }),
    deleteNotification: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const deleted = await Notification.findByIdAndDelete(id);
    if (!deleted) {
      return next(new NotFound(`No notification found with ID ${id}`));
    }

    res.status(200).json({ message: 'Notification deleted successfully.' });
  }),
   getOrderNotifications: asyncWrapper(async (req, res, next) => {
    const notifications = await Notification.find({ type: 'Order' })
      .populate('user', 'names email')
      .sort({ createdAt: -1 });

    if (!notifications.length) {
      return res.status(404).json({ message: 'No notifications found for orders' });
    }

    res.status(200).json({ notifications });
  }),
   getRestaurantAndMenuNotifications: asyncWrapper(async (req, res, next) => {
    const notifications = await Notification.find({ type: { $in: ['Restaurant', 'Menu'] } })
    .populate('user', 'names email')
    .sort({ createdAt: -1 });
    if (!notifications.length) {
      return res.status(404).json({ message: 'No notifications found for restaurants' });
    }

    res.status(200).json({ notifications });
  }),

 getNotificationsByUser: asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const notifications = await Notification.find({ user: id });

  // Return 200 OK with empty array if no notifications
  res.status(200).json({ notifications });
})
 
};

module.exports = {
  createNotification,
  createNotifications,
  notificationController
};
