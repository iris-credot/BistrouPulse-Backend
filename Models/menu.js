const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  price: {
    type: Number,
    required: true,
  },

  image: {
    type: String, // Cloudinary URL or image path
  },

 category: {
  type: String,
  enum: ["Appetizer", "Main Course", "Dessert", "Drinks"],
  required: true
},

  isAvailable: {
    type: Boolean,
    default: true,
  }

}, { timestamps: true });

const menuItemModel = mongoose.model('MenuItem', menuItemSchema);
module.exports = menuItemModel;
