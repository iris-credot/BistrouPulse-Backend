const mongoose = require('mongoose');
const asyncWrapper = require('../Middleware/async');
const clientModel = require('../Models/clients');
const userModel = require('../Models/user');
const NotFound = require('../Error/NotFound');
const BadRequest = require('../Error/BadRequest');

const clientController = {

  // ✅ Get all clients
  getAllClients: asyncWrapper(async (req, res, next) => {
    const clients = await clientModel.find()
      .populate('user')
      .populate('favoriteRestaurants')
      .populate('orderHistory');

    res.status(200).json({ clients });
  }),

  // ✅ Get a client by ID
  getClientById: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const client = await clientModel.findById(id)
      .populate('user')
      .populate('favoriteRestaurants')
      .populate('orderHistory');

    if (!client) {
      return next(new NotFound('Client not found'));
    }

    res.status(200).json({ client });
  }),

  // ✅ Create a new client (after user signs up)
  createClient: asyncWrapper(async (req, res, next) => {
    const { user, favoriteCuisines } = req.body;

    if (!mongoose.Types.ObjectId.isValid(user)) {
      return next(new BadRequest('Invalid user ID'));
    }

    const existingUser = await userModel.findById(user);
    if (!existingUser) {
      return next(new NotFound('User not found'));
    }

    const existingClient = await clientModel.findOne({ user });
    if (existingClient) {
      return next(new BadRequest('Client profile already exists for this user'));
    }

    const client = await clientModel.create({
      user,
      favoriteCuisines,
    });

    // Optionally update user role
    if (existingUser.role !== 'client') {
      existingUser.role = 'client';
      await existingUser.save();
    }

    res.status(201).json({ client });
  }),

  // ✅ Update client profile
  updateClient: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const updatedClient = await clientModel.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      .populate('user')
      .populate('favoriteRestaurants')
      .populate('orderHistory');

    if (!updatedClient) {
      return next(new NotFound('Client not found'));
    }

    res.status(200).json({ updatedClient });
  }),

  // ✅ Delete client by ID
  deleteClient: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const deletedClient = await clientModel.findByIdAndDelete(id);
    if (!deletedClient) {
      return next(new NotFound('Client not found'));
    }

    res.status(200).json({ message: 'Client deleted successfully', client: deletedClient });
  }),

  // ✅ Get client by User ID
  getClientByUserId: asyncWrapper(async (req, res, next) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(new BadRequest('Invalid userId format'));
    }

    const client = await clientModel.findOne({ user: userId })
      .populate('user')
      .populate('favoriteRestaurants')
      .populate('orderHistory');

    if (!client) {
      return next(new NotFound('No client found for the given user'));
    }

    res.status(200).json({ client });
  }),

};

module.exports = clientController;
