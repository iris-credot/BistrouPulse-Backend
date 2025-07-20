const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true ,unique: true }, // Linked user account
 favoriteCuisines: [String],
 
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


}, { timestamps: true });

const clientModel = mongoose.model('Client', clientSchema);
module.exports = clientModel;
