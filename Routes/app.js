const userRoute = require('./userRoute.js');
const clientRoutes = require('./clientRoutes.js');
const menuRoutes = require('./menuRoutes.js');
const orderRoutes = require('./orderRoutes.js');
const ownerRoutes = require('./ownerRoutes.js');
const restaurantRoutes = require('./restaurantRoutes.js');
const express = require('express');

const Router= express.Router();

Router.use('/user',userRoute);
Router.use('/client',clientRoutes);
Router.use('/menu',menuRoutes);
Router.use('/order',orderRoutes);
Router.use('/owner',ownerRoutes);
Router.use('/restaurant',restaurantRoutes);



module.exports = Router;