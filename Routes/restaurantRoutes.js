const express = require('express');
const restaurantController = require('../Controllers/restaurentsController');
const auth = require('../Middleware/authentication'); // if you have auth middleware

const restaurantRouter = express.Router();


restaurantRouter .get('/',auth.AuthJWT, restaurantController.getAllRestaurants);
restaurantRouter .get('/:id',auth.AuthJWT, restaurantController.getRestaurantById);
restaurantRouter .get('/owner/:ownerId', auth.adminJWT,restaurantController.getRestaurantsByOwner);
restaurantRouter .post('/', auth.BothJWT,restaurantController.createRestaurant);
restaurantRouter .put('/:id', auth.BothJWT, restaurantController.updateRestaurant);
restaurantRouter .delete('/:id', auth.BothJWT, restaurantController.deleteRestaurant);
restaurantRouter .patch('/:id/toggle-status', auth.AuthJWT, restaurantController.toggleRestaurantStatus);

module.exports = restaurantRouter ;
