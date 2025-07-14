const express = require('express');
const clientController = require('../Controllers/clientController');
const clientRouter = express.Router();
const auth = require('../Middleware/authentication');

// Get all clients
clientRouter.get('/', auth.ownerJWT,clientController.getAllClients);

// Get client by ID
clientRouter.get('/:id',auth.ownerJWT, clientController.getClientById);

// Get client by User ID
clientRouter.get('/user/:userId', auth.ownerJWT,clientController.getClientByUserId);

// Create a new client
clientRouter.post('/', clientController.createClient);

// Update client by ID
clientRouter.put('/:id',auth.ownerJWT, clientController.updateClient);

// Delete client by ID
clientRouter.delete('/:id',auth.ownerJWT, clientController.deleteClient);

module.exports = clientRouter;
