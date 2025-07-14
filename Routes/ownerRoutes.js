const express = require('express');
const ownerController = require('../Controllers/ownerController');
const auth = require('../Middleware/authentication'); // adjust based on your auth middleware

const ownerRouter = express.Router();

// Get all owners
ownerRouter.get('/', auth.adminJWT,ownerController.getAllOwners);

// Get owner by ID
ownerRouter.get('/:id', auth.BothJWT,ownerController.getOwnerById);

// Get owner profile of logged-in user
// Assumes auth middleware sets req.user
ownerRouter.get('/me/profile', auth.BothJWT, ownerController.getMyOwnerProfile);

// Get owner by userId param
ownerRouter.get('/user/:userId',auth.BothJWT, ownerController.getOwnerByUserId);

// Create owner profile
ownerRouter.post('/',auth.adminJWT, ownerController.createOwner);

// Update owner by ID
ownerRouter.put('/:id',auth.BothJWT, ownerController.updateOwner);

// Delete owner by ID
ownerRouter.delete('/:id',auth.adminJWT, ownerController.deleteOwner);

module.exports =ownerRouter;
