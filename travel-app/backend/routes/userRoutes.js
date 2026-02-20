const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User registration and login routes
router.post('/', userController.register);
router.post('/login', userController.login);

module.exports = router;