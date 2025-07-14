const express = require('express');
const ownerController = require('../Controllers/ownerController');
const auth = require('../Middleware/authentication'); // adjust based on your auth middleware

const ownerRouter = express.Router();

// Get all owners
ownerRouter.get('/', ownerController.getAllOwners);

// Get owner by ID
ownerRouter.get('/:id', ownerController.getOwnerById);

// Get owner profile of logged-in user
// Assumes auth middleware sets req.user
ownerRouter.get('/me/profile', auth.AuthJWT, ownerController.getMyOwnerProfile);

// Get owner by userId param
ownerRouter.get('/user/:userId', ownerController.getOwnerByUserId);

// Create owner profile
ownerRouter.post('/', ownerController.createOwner);

// Update owner by ID
ownerRouter.put('/:id', ownerController.updateOwner);

// Delete owner by ID
ownerRouter.delete('/:id', ownerController.deleteOwner);

module.exports =ownerRouter;
