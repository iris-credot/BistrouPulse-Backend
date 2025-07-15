const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true ,  unique: true}, // Link to User model



  restaurants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
    },
  ],

  businessName: {
    type: String,
  },

  


  

}, { timestamps: true });

const ownerModel = mongoose.model('Owner', ownerSchema);
module.exports = ownerModel;
