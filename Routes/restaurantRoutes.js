const express = require('express');
const restaurantController = require('../Controllers/restaurentsController');
const auth = require('../Middleware/authentication'); // if you have auth middleware

const restaurantRouter = express.Router();

// Get all restaurants
restaurantRouter .get('/',auth.AuthJWT, restaurantController.getAllRestaurants);

// Get a restaurant by ID
restaurantRouter .get('/:id',auth.AuthJWT, restaurantController.getRestaurantById);

// Get all restaurants for a specific owner
restaurantRouter .get('/owner/:ownerId', auth.adminJWT,restaurantController.getRestaurantsByOwner);

// Create a new restaurant
// Add authentication if needed, e.g., auth.AuthJWT
restaurantRouter .post('/', auth.BothJWT,restaurantController.createRestaurant);

// Update a restaurant by ID
restaurantRouter .put('/:id', auth.BothJWT, restaurantController.updateRestaurant);

// Delete a restaurant by ID
restaurantRouter .delete('/:id', auth.BothJWT, restaurantController.deleteRestaurant);

// Toggle restaurant active status
restaurantRouter .patch('/:id/toggle-status', auth.AuthJWT, restaurantController.toggleRestaurantStatus);

module.exports = restaurantRouter ;
