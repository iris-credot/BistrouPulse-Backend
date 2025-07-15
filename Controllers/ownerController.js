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
  // Only get the userId and owner-specific info from the request.
  const { userId, businessName,plainTextPassword, restaurants } = req.body;

  // 1. Validate that you have the necessary ID
  if (!userId || !plainTextPassword) {
    return next(new BadRequest('userId is required'));
  }

  // 2. Find the user. This is the source of truth for email.
  const user = await User.findById(userId);
  if (!user) {
    return next(new BadRequest('User not found'));
  }

  // 3. Check if an owner profile already exists for this user.
  // This query is now on the `user` field in the owner schema.
  const existingOwner = await Owner.findOne({ user: userId });
  if (existingOwner) {
    return next(new BadRequest('Owner profile already exists for this user'));
  }

  // 4. Create the new owner profile.
  // Notice we are NOT passing email or password. They don't exist in the schema anymore.
  let newOwner;
  try {
    newOwner = await Owner.create({
      user: userId, // Link to the user document
      businessName,
      plainTextPassword,
      restaurants,
    });
  } catch (error) {
    // This will now catch other potential errors, like if the userId is invalid
    return next(new BadRequest(error.message));
  }
   user.role = 'owner';
   user.verified = true;
  await user.save();

  // 5. Send a welcome email using the RELIABLE email from the user object
  const targetEmail = user.email;
 // Get email from the user, NOT req.body
  const emailBody = `
    Welcome to Bistrou-Pulse!

    Your owner profile has been created. You can log in with your credentials for the email: ${targetEmail} and password: ${plainTextPassword} .

    Best regards,
    Bistrou-Pulse Team
  `;

  try {
    await sendEmail(targetEmail, "Bistrou-Pulse System: Your Owner Profile is Ready", emailBody);
  } catch (error) {
    console.error("Failed to send email:", error.message);
  }

  // 6. Send the successful response
  res.status(201).json({
    message: 'Owner created successfully and email sent',
    owner: newOwner
  });
}),


  // Update owner profile
 updateOwner: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    
    // 1. Separate the user data from the owner data
    const { user: userData, businessName } = req.body;

    // 2. Find the owner first to get their associated user ID
    const owner = await Owner.findById(id);
    if (!owner) {
      return next(new NotFound('Owner not found'));
    }

    // 3. Update the Owner model with owner-specific fields
    owner.businessName = businessName;
    await owner.save();

    // 4. Update the associated User model with user-specific fields
    if (userData && owner.user) {
        await User.findByIdAndUpdate(owner.user, {
            // Use the data from the nested 'user' object in the request
            names: userData.names,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            address: userData.address,
        }, { new: true, runValidators: true }); // 'runValidators' ensures your model rules are checked
    }
    
    // 5. Fetch the fully updated owner with the populated user to send back
    const updatedOwner = await Owner.findById(id).populate('user');

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
