const express = require('express');
const menuItemController = require('../Controllers/menuController');
const menuRouter = express.Router();
const auth = require('../Middleware/authentication');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// Get all menu items
menuRouter.get('/',auth.AuthJWT, menuItemController.getAllMenuItems);

// Get menu item by ID
menuRouter.get('/:id',auth.AuthJWT, menuItemController.getMenuItemById);

// Get menu items by restaurant ID
menuRouter.get('/restaurant/:restaurantId',auth.AuthJWT, menuItemController.getMenuItemsByRestaurant);

// Get menu items by category
menuRouter.get('/category/:category',auth.AuthJWT, menuItemController.getMenuItemsByCategory);

// Create new menu item
menuRouter.post('/',auth.ownerJWT, upload.single('image'), menuItemController.createMenuItem);

// Update menu item by ID
menuRouter.put('/:id',auth.ownerJWT, menuItemController.updateMenuItem);

// Delete menu item by ID
menuRouter.delete('/:id',auth.ownerJWT, menuItemController.deleteMenuItem);

// Toggle availability status by ID
menuRouter.patch('/:id/toggle-availability',auth.AuthJWT, menuItemController.toggleAvailability);

module.exports = menuRouter;
