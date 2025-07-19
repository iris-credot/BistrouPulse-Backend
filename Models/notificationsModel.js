const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
   
  },
 
  message: {
    type: String,
    required: [true, 'Notification message is required']
  },
 
  type: {
    type: String,
    enum: ['Notification','Restaurant', 'Order','Menu'],
     default:'Notification',
    required: true,
  },
 
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
