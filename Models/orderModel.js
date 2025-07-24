const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Adjust based on your user model name
    required: true
  },

  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },

  items: [
    {
      menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],

  totalPrice: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ['Pending', 'Confirmed',  'Completed', 'Cancelled'],
    default: 'Pending'
  },

  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'Mobile Money'],
    required: true
  },

  isPaid: {
    type: Boolean,
    default: false
  },

  paidAt: {
    type: Date
  },

  deliveryAddress: {
    type: String // Optional if dine-in
  },

  isDelivered: {
    type: Boolean,
    default: false
  },

  deliveredAt: {
    type: Date
  }

}, { timestamps: true });

const orderModel = mongoose.model('Order', orderSchema);
module.exports = orderModel;
