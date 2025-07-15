const mongoose = require('mongoose');
const asyncWrapper = require('../Middleware/async');
const Owner = require('../Models/owners');
const sendEmail = require('../Middleware/sendMail');
const User = require('../Models/user');
const NotFound = require('../Error/NotFound');
const BadRequest = require('../Error/BadRequest');

const ownerController = {
  // Get all owners
  getAllOwners: asyncWrapper(async (req, res, next) => {
    const owners = await Owner.find().populate('user').populate('restaurants');
    res.status(200).json({ owners });
  }),

  // Get owner by ID
  getOwnerById: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const owner = await Owner.findById(id).populate('user').populate('restaurants');
    if (!owner) {
      return next(new NotFound('Owner not found'));
    }
    res.status(200).json({ owner });
  }),

  // Get owner by logged-in user ID (req.user must be set via auth middleware)
  getMyOwnerProfile: asyncWrapper(async (req, res, next) => {
    const owner = await Owner.findOne({ user: req.user.id }).populate('user').populate('restaurants');
    if (!owner) {
      return res.status(404).json({ message: 'Owner profile not found' });
    }
    res.status(200).json({ owner });
  }),

  // Get owner by userId param
  getOwnerByUserId: asyncWrapper(async (req, res, next) => {
    const { userId } = req.params;
    const owner = await Owner.findOne({ user: userId }).populate('user').populate('restaurants');
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }
    res.status(200).json({ owner });
  }),

  // Create owner profile
createOwner: asyncWrapper(async (req, res, next) => {
  const { userId, businessName, restaurants, email, password } = req.body;

  if (!userId) {
    return next(new BadRequest('userId is required'));
  }

  let user = await User.findById(userId);

  if (user) {
    if (user.role !== 'owner') {
      user.role = 'owner';
    }

    await user.save();
  } else {
    if (!email || !password) {
      return next(new BadRequest('Email and password are required to create a new user'));
    }


  }

  const existingOwner = await Owner.findOne({ user: userId });
  if (existingOwner) {
    return next(new BadRequest('Owner profile already exists for this user'));
  }

  const newOwner = await Owner.create({
    user: userId,
    businessName,
    restaurants,
  });

  // Send email to the correct email address
  const targetEmail = user.email;

  const emailBody = `
    Welcome to Bistrou-Pulse!

    Your account has been created with the following credentials:

    Email: ${targetEmail}
    Password: ${password || 'your chosen password'}

    Please change your password after logging in.

    Best regards,
    Bistrou-Pulse Team
  `;

  try {
    await sendEmail(targetEmail, "Bistrou-Pulse System: Your Account Credentials", emailBody);
  } catch (error) {
    console.error("Failed to send email:", error.message);
    // Optional: log error or continue depending on your needs
  }

  res.status(201).json({
    message: 'Owner created successfully and email sent',
    owner: newOwner
  });
}),

  // Update owner profile
  updateOwner: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const updatedOwner = await Owner.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate('user').populate('restaurants');

    if (!updatedOwner) {
      return next(new NotFound('Owner not found'));
    }

    res.status(200).json({ message: 'Owner updated successfully', owner: updatedOwner });
  }),

  // Delete owner profile
  deleteOwner: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const deletedOwner = await Owner.findByIdAndDelete(id);
    if (!deletedOwner) {
      return next(new NotFound('Owner not found'));
    }

    res.status(200).json({ message: 'Owner deleted successfully' });
  })
};

module.exports = ownerController;
