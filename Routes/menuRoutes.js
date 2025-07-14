const express = require('express');
const menuItemController = require('../Controllers/menuController');
const menuRouter = express.Router();

// Get all menu items
menuRouter.get('/', menuItemController.getAllMenuItems);

// Get menu item by ID
menuRouter.get('/:id', menuItemController.getMenuItemById);

// Get menu items by restaurant ID
menuRouter.get('/restaurant/:restaurantId', menuItemController.getMenuItemsByRestaurant);

// Get menu items by category
menuRouter.get('/category/:category', menuItemController.getMenuItemsByCategory);

// Create new menu item
menuRouter.post('/', menuItemController.createMenuItem);

// Update menu item by ID
menuRouter.put('/:id', menuItemController.updateMenuItem);

// Delete menu item by ID
menuRouter.delete('/:id', menuItemController.deleteMenuItem);

// Toggle availability status by ID
menuRouter.patch('/:id/toggle-availability', menuItemController.toggleAvailability);

module.exports = menuRouter;
