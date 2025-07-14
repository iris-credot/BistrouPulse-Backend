const express = require('express');
const clientController = require('../Controllers/clientController');
const clientRouter = express.Router();

// Get all clients
clientRouter.get('/', clientController.getAllClients);

// Get client by ID
clientRouter.get('/:id', clientController.getClientById);

// Get client by User ID
clientRouter.get('/user/:userId', clientController.getClientByUserId);

// Create a new client
clientRouter.post('/', clientController.createClient);

// Update client by ID
clientRouter.put('/:id', clientController.updateClient);

// Delete client by ID
clientRouter.delete('/:id', clientController.deleteClient);

module.exports = clientRouter;
