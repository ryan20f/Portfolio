// routes/clientRoutes.js
const express = require('express');
const clientController = require('../controllers/clientController');

const router = express.Router();

// Define routes for client CRUD operations
router.get('/', clientController.getAllClients);
router.post('/', clientController.createClient);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;