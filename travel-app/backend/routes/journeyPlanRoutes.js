const express = require('express');
const router = express.Router();
const journeyPlanController = require('../controllers/journeyPlanController');
const authenticateUser = require('../authMiddleware');

router.get('/', authenticateUser, journeyPlanController.getAllForUser);
router.post('/', authenticateUser, journeyPlanController.create);
router.put('/:id', authenticateUser, journeyPlanController.update);
router.delete('/:id', authenticateUser, journeyPlanController.delete);

module.exports = router;