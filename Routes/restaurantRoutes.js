const express = require('express');
const restaurantController = require('../Controllers/restaurentsController');
const auth = require('../Middleware/authentication'); // if you have auth middleware
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const restaurantRouter = express.Router();


restaurantRouter .get('/', restaurantController.getAllRestaurants);
restaurantRouter .get('/:id',auth.AuthJWT, restaurantController.getRestaurantById);
restaurantRouter .get('/owner/:ownerId', auth.adminJWT,restaurantController.getRestaurantsByOwner);
restaurantRouter .post('/', auth.BothJWT, upload.single('image'),restaurantController.createRestaurant);
restaurantRouter .put('/:id', auth.BothJWT,upload.single('image'), restaurantController.updateRestaurant);
restaurantRouter .delete('/:id', auth.BothJWT, restaurantController.deleteRestaurant);
restaurantRouter .patch('/:id/toggle-status', auth.AuthJWT, restaurantController.toggleRestaurantStatus);

module.exports = restaurantRouter ;
