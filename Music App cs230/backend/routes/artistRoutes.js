// routes/artistRoutes.js
const express = require('express');
const { createArtist, getArtists, deleteArtist } = require('../controllers/artistController');

const router = express.Router();

// Create a new artist
router.post('/', createArtist);

// Get all artists
router.get('/', getArtists);

// Delete an artist by ID
router.delete('/:id', deleteArtist);

module.exports = router;