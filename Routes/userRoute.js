const express = require('express');
const Userrouter= express.Router();

const auth = require('../Middleware/authentication');
const authController = require('../Controllers/userController');
const login = require('../Controllers/loginController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

Userrouter.post('/signup', upload.single('image'),authController.createUser);
Userrouter.post('/login', login.login_post);
Userrouter.post('/forgot', authController.ForgotPassword);
Userrouter.post('/verifyotp', authController.OTP);
Userrouter.post('/logout',auth.AuthJWT ,login.logout);
Userrouter.get('/all' ,auth.adminJWT,authController.getAllUsers);
Userrouter.get('/allClients' ,auth.adminJWT,authController.getAllClients);
Userrouter.get('/getOne/:id' ,auth.AuthJWT,authController.getUserById);
Userrouter.delete('/delete/:id',auth.BothJWT, authController.deleteUser);
Userrouter.put('/profile/:id', auth.AuthJWT,authController.updateUser);
Userrouter.put('/password', auth.AuthJWT,authController.UpdatePassword);
Userrouter.post('/resetpassword/:token', authController.ResetPassword);

module.exports = Userrouter;