const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
   user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },

  phone: {
    type: String,
    required: true,
  },

  email: {
    type: String,
  },

  image: {
    type: String, // Cloudinary URL or image path
  },

  openingHours: {
    type: String, // Example: "9:00 AM - 10:00 PM"
  },

  categories: [
    {
      type: String, // Example: "Italian", "Fast Food", "Vegan"
    }
  ],

  menu: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
    }
  ],

  isActive: {
    type: Boolean,
    default: true,
  }

}, { timestamps: true });

const restaurantModel = mongoose.model('Restaurant', restaurantSchema);
module.exports = restaurantModel;
