
const userRoute = require('./userRoute.js');



const express = require('express');

const Router= express.Router();

Router.use('/user',userRoute);



module.exports = Router;