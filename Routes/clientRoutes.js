const express = require('express');
const clientController = require('../Controllers/clientController');
const clientRouter = express.Router();
const auth = require('../Middleware/authentication');

// Get all clients
clientRouter.get('/', auth.ownerJWT,clientController.getAllClients);
clientRouter.get('/:id',auth.ownerJWT, clientController.getClientById);
clientRouter.get('/user/:userId', auth.ownerJWT,clientController.getClientByUserId);
clientRouter.post('/', clientController.createClient);
clientRouter.put('/:id',auth.ownerJWT, clientController.updateClient);
clientRouter.delete('/:id',auth.ownerJWT, clientController.deleteClient);

module.exports = clientRouter;
