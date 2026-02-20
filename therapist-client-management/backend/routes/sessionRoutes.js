// routes/sessionRoutes.js
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// Define routes for sessions
router.get('/', sessionController.getAllSessions);
router.post('/', sessionController.createSession);
router.put('/:id', sessionController.updateSession);
router.delete('/:id', sessionController.deleteSession);

// Other session-related routes here...

module.exports = router;