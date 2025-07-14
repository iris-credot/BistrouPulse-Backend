const asyncWrapper = require('../Middleware/async');
const Restaurant = require('../Models/restaurants');
const Owner = require('../Models/owners');
const NotFound = require('../Error/NotFound');
const BadRequest = require('../Error/BadRequest');

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
      owner,
      name,
      description,
      address,
      phone,
      email,
      image,
      openingHours,
      categories,
      menu,
    } = req.body;

    const foundOwner = await Owner.findById(owner);
    if (!foundOwner) {
      return next(new NotFound('Owner not found'));
    }

    const newRestaurant = await Restaurant.create({
      owner,
      name,
      description,
      address,
      phone,
      email,
      image,
      openingHours,
      categories,
      menu,
    });

    // Optionally add this restaurant to the owner's restaurants array
    foundOwner.restaurants.push(newRestaurant._id);
    await foundOwner.save();

    res.status(201).json({ message: 'Restaurant created successfully', restaurant: newRestaurant });
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
