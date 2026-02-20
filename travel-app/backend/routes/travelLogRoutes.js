const express = require('express');
const router = express.Router();
const travelLogController = require('../controllers/travelLogController');
const authenticateUser = require('../authMiddleware');

// Routes for travel logs
router.get('/', authenticateUser, travelLogController.getAllForUser); // Get all travel logs for the authenticated user
router.post('/', authenticateUser, travelLogController.create);      // Create a new travel log
router.put('/:id', authenticateUser, travelLogController.update);    // Update a travel log
router.delete('/:id', authenticateUser, travelLogController.delete); // Delete a travel log

module.exports = router;