
const express = require('express');
const router = express.Router();
const auth = require('../Middleware/authentication');
const {
    notificationController
} = require('../Controllers/notificationController');


router.get('/getall', auth.adminJWT,notificationController.getAllNotifications);
router.get('/get/:id',auth.AuthJWT, notificationController.getNotificationsByUser);
router.get('/getByOrder',auth.AuthJWT, notificationController.getOrderNotifications);
router.get('/getByRest',auth.AuthJWT, notificationController.getRestaurantNot);
router.get('/getByMenu',auth.AuthJWT, notificationController.getMenuNot);
router.delete('/delete/:id',auth.AuthJWT, notificationController.deleteNotification);


module.exports = router;
