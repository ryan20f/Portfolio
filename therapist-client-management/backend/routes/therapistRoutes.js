// routes/therapistRoutes.js
const express = require('express');
const therapistController = require('../controllers/therapistController');

const router = express.Router();

// Define routes for therapist CRUD operations
router.get('/', therapistController.getAllTherapists);
router.post('/', therapistController.createTherapist);
router.put('/:id', therapistController.updateTherapist);
router.delete('/:id', therapistController.deleteTherapist);

module.exports = router;