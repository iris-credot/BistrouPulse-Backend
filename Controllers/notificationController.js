const Notification = require('../Models/notificationsModel');
const asyncWrapper = require('../Middleware/async');
const BadRequest = require('../Error/BadRequest');
const NotFound = require('../Error/NotFound');
const User = require('../Models/user'); // Assuming user has an email field
const sendEmail = require('../Middleware/sendMail'); // A utility to send email
const sendNotification = async ({ user, message, type }) => {
  if (!user || !message) {
    console.warn('Notification skipped: user or message missing.', { user, message });
    return; // Exit silently
  }

  let userData = null;

  // Try to find by _id
  if (typeof user === 'string' || typeof user === 'object') {
    try {
      userData = await User.findById(user);
    } catch (err) {
      console.warn('Invalid ObjectId format for user:', user);
    }
  }

 

  // If still not found, skip notification
  if (!userData || !userData.email) {
    console.warn('Notification skipped: user or email not found.', { input: user });
    return;
  }

  const notification = new Notification({
    user: userData._id,
    message,
    type,
  });

  try {
    await sendEmail(
      userData.email,
      `New ${type} notification`,
      `<p>${message}</p>`
    );
   
  } catch (error) {
    
    console.error('Email sending failed:', error);
  }

  await notification.save();
  return notification;
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

 getNotificationsByUser: asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const notifications = await Notification.find({ user: id });

  // Return 200 OK with empty array if no notifications
  res.status(200).json({ notifications });
})
 
};

module.exports = {
  sendNotification,
  notificationController
};
