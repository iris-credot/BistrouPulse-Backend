const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Linked user account

  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  phone: {
    type: String,
    required: true,
  },

  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },

  favoriteRestaurants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
    },
  ],

  orderHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],

  isVerified: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

const clientModel = mongoose.model('Client', clientSchema);
module.exports = clientModel;
