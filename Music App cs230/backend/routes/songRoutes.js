const express = require('express');
const { createSong, getSongs, deleteSong } = require('../controllers/songController');

const router = express.Router();

// Create a new song
router.post('/', createSong);

// Get all songs
router.get('/', getSongs);

// Delete a song by ID
router.delete('/:id', deleteSong);

module.exports = router;