const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to User model

  fullName: {
    type: String,
    required: true,
  },

  contactNumber: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  restaurants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
    },
  ],

  businessName: {
    type: String,
  },

  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  licenseNumber: {
    type: String,
  }

}, { timestamps: true });

const ownerModel = mongoose.model('Owner', ownerSchema);
module.exports = ownerModel;
