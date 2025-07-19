const asyncWrapper = require('../Middleware/async');
const MenuItem = require('../Models/menu');
const NotFound = require('../Error/NotFound');
const BadRequest = require('../Error/BadRequest');
const cloudinary =require('cloudinary');
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });

const menuItemController = {
  // Get all menu items
  getAllMenuItems: asyncWrapper(async (req, res, next) => {
    const menuItems = await MenuItem.find().populate('restaurant', 'name');
    res.status(200).json({ menuItems });
  }),

  // Get menu item by ID
  getMenuItemById: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const menuItem = await MenuItem.findById(id).populate('restaurant', 'name');
    if (!menuItem) {
      return next(new NotFound('Menu item not found'));
    }
    res.status(200).json({ menuItem });
  }),

  // Get menu items by restaurant ID
  getMenuItemsByRestaurant: asyncWrapper(async (req, res, next) => {
    const { restaurantId } = req.params;
    const menuItems = await MenuItem.find({ restaurant: restaurantId });
    if (!menuItems.length) {
      return res.status(404).json({ message: 'No menu items found for this restaurant' });
    }
    res.status(200).json({ menuItems });
  }),

  // Get menu items by category
  getMenuItemsByCategory: asyncWrapper(async (req, res, next) => {
    const { category } = req.params;
    if (!["Appetizer", "Main Course", "Dessert", "Drinks"].includes(category)) {
      return next(new BadRequest('Invalid category'));
    }
    const menuItems = await MenuItem.find({ category });
    if (!menuItems.length) {
      return res.status(404).json({ message: 'No menu items found in this category' });
    }
    res.status(200).json({ menuItems });
  }),

  // Create new menu item
  createMenuItem: asyncWrapper(async (req, res, next) => {
    const { restaurant, name, description, price, image, category, isAvailable } = req.body;

    if (!restaurant || !name || !price || !image) {
      return next(new BadRequest('Required fields: restaurant, name, price, image'));
    }

    if (!["Appetizer", "Main Course", "Dessert", "Drinks"].includes(category)) {
      return next(new BadRequest('Invalid category'));
    }
const images = `IMAGE_${Date.now()}`;
try{
   const ImageCloudinary = await cloudinary.v2.uploader.upload(req.file.path, {
              folder: 'Bistrou-Pulse',
              public_id: images
            });
 const newMenuItem = await MenuItem.create({
      restaurant,
      name,
      description,
      price,
      image:ImageCloudinary.secure_url,
      category,
      isAvailable,
    });

    res.status(201).json({ message: 'Menu item created successfully', menuItem: newMenuItem });
}
     catch (err) {
          console.error('Error uploading image to Cloudinary:', err);
          return next(new BadRequest('Error uploading image to Cloudinary.'));
        }
  }),

  // Update menu item by ID
  updateMenuItem: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    if (req.body.category && !["Appetizer", "Main Course", "Dessert", "Drinks"].includes(req.body.category)) {
      return next(new BadRequest('Invalid category'));
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedMenuItem) {
      return next(new NotFound('Menu item not found'));
    }

    res.status(200).json({ message: 'Menu item updated successfully', menuItem: updatedMenuItem });
  }),

  // Delete menu item by ID
  deleteMenuItem: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const deletedMenuItem = await MenuItem.findByIdAndDelete(id);
    if (!deletedMenuItem) {
      return next(new NotFound('Menu item not found'));
    }
    res.status(200).json({ message: 'Menu item deleted successfully' });
  }),

  // Toggle availability status
  toggleAvailability: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return next(new NotFound('Menu item not found'));
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    res.status(200).json({ message: `Menu item availability set to ${menuItem.isAvailable}`, menuItem });
  }),
};

module.exports = menuItemController;
