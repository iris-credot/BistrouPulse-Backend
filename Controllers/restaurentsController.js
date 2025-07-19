const asyncWrapper = require('../Middleware/async');
const Restaurant = require('../Models/restaurants');
const Owner = require('../Models/owners');
const {createNotification}=require('../Controllers/notificationController');
const NotFound = require('../Error/NotFound');
const cloudinary =require('cloudinary');
const BadRequest = require('../Error/BadRequest');
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });
const restaurantController = {
  // Get all restaurants
  getAllRestaurants: asyncWrapper(async (req, res, next) => {
    const restaurants = await Restaurant.find()
      .populate('owner', 'businessName')
      .populate('menu');
    res.status(200).json({ restaurants });
  }),

  // Get a single restaurant by ID
  getRestaurantById: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id)
      .populate('owner')
      .populate('menu');
    if (!restaurant) {
      return next(new NotFound('Restaurant not found'));
    }
    res.status(200).json({ restaurant });
  }),

  // Get all restaurants for a specific owner
  getRestaurantsByOwner: asyncWrapper(async (req, res, next) => {
    const { ownerId } = req.params;
    const restaurants = await Restaurant.find({ owner: ownerId })
      .populate('menu');
    res.status(200).json({ restaurants });
  }),

  // Create a new restaurant
 createRestaurant: asyncWrapper(async (req, res, next) => {
  const {
    user,
    owner,
    name,
    description,
    address,
    image,
    phone,
    email,
    openingHours,
    categories,
    menu,
  } = req.body;

  // Validate that an owner is provided
  if (!owner) {
    return next(new BadRequest('Owner ID is required to create a restaurant.'));
  }

  // Find the owner to associate the restaurant with
  const foundOwner = await User.findById(owner); // Assuming Owner is part of your User model
  if (!foundOwner) {
    return next(new NotFound('Owner not found'));
  }

  // Check if an image file was uploaded
  if (!req.file) {
    return next(new BadRequest('A restaurant image is required.'));
  }

  const images = `IMAGE_${Date.now()}`;
  try {
    // Upload image to Cloudinary
    const ImageCloudinary = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: 'Bistrou-Pulse',
      public_id: images
    });

    // Create the new restaurant
    const newRestaurant = await Restaurant.create({
      user,
      owner,
      name,
      description,
      address,
      phone,
      email,
      image: ImageCloudinary.secure_url,
      openingHours,
      categories,
      menu,
    });

    // Add this restaurant to the owner's list of restaurants
    foundOwner.restaurants.push(newRestaurant._id);
    await foundOwner.save();

    // --- Create a notification for the owner ---
    await createNotification({
      user: user, // The ID of the user to notify
      message: `New restaurant, "${name}", has been created.`,
      type: 'Restaurant', // As defined in your Notification schema
    });

    res.status(201).json({ message: 'Restaurant created successfully', restaurant: newRestaurant });

  } catch (err) {
    console.error('Error during restaurant creation:', err);
    // Check if the error is from Cloudinary or the database
    if (err.http_code && err.http_code === 400) {
       return next(new BadRequest('Error uploading image to Cloudinary.'));
    }
    return next(new BadRequest('An error occurred while creating the restaurant.'));
  }
}),

  // Update a restaurant
  updateRestaurant: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate('owner').populate('menu');

    if (!updatedRestaurant) {
      return next(new NotFound('Restaurant not found'));
    }

    res.status(200).json({ message: 'Restaurant updated successfully', restaurant: updatedRestaurant });
  }),

  // Delete a restaurant
  deleteRestaurant: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const deletedRestaurant = await Restaurant.findByIdAndDelete(id);
    if (!deletedRestaurant) {
      return next(new NotFound('Restaurant not found'));
    }

    // Remove from owner's list
    await Owner.findByIdAndUpdate(deletedRestaurant.owner, {
      $pull: { restaurants: deletedRestaurant._id },
    });

    res.status(200).json({ message: 'Restaurant deleted successfully' });
  }),

  // Toggle restaurant active status
  toggleRestaurantStatus: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return next(new NotFound('Restaurant not found'));
    }
    restaurant.isActive = !restaurant.isActive;
    await restaurant.save();

    res.status(200).json({ message: `Restaurant ${restaurant.isActive ? 'activated' : 'deactivated'}`, restaurant });
  }),
};

module.exports = restaurantController;
