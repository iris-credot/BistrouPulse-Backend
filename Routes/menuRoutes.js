const express = require('express');
const menuItemController = require('../Controllers/menuController');
const menuRouter = express.Router();
const auth = require('../Middleware/authentication');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// Get all menu items
menuRouter.get('/',auth.AuthJWT, menuItemController.getAllMenuItems);
menuRouter.get('/:id',auth.AuthJWT, menuItemController.getMenuItemById);
menuRouter.get('/restaurant/:restaurantId',auth.AuthJWT, menuItemController.getMenuItemsByRestaurant);
menuRouter.get('/category/:category',auth.AuthJWT, menuItemController.getMenuItemsByCategory);
menuRouter.post('/',auth.BothJWT, upload.single('image'), menuItemController.createMenuItem);
menuRouter.put('/:id',auth.ownerJWT, menuItemController.updateMenuItem);
menuRouter.delete('/:id',auth.ownerJWT, menuItemController.deleteMenuItem);
menuRouter.patch('/:id/toggle-availability',auth.AuthJWT, menuItemController.toggleAvailability);

module.exports = menuRouter;
