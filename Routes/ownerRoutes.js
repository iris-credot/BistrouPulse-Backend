const express = require('express');
const ownerController = require('../Controllers/ownerController');
const auth = require('../Middleware/authentication'); // adjust based on your auth middleware

const ownerRouter = express.Router();

// Get all owners
ownerRouter.get('/', auth.adminJWT,ownerController.getAllOwners);
ownerRouter.get('/:id', auth.BothJWT,ownerController.getOwnerById);
ownerRouter.get('/me/profile', auth.BothJWT, ownerController.getMyOwnerProfile);
ownerRouter.get('/user/:userId',auth.BothJWT, ownerController.getOwnerByUserId);
ownerRouter.get('/:id/restaurants', auth.ownerJWT, ownerController.getOwnerRestaurants);
ownerRouter.post('/',auth.adminJWT, ownerController.createOwner);
ownerRouter.put('/:id',auth.BothJWT, ownerController.updateOwner);
ownerRouter.delete('/:id',auth.adminJWT, ownerController.deleteOwner);

module.exports =ownerRouter;
