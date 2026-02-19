const express = require('express');
const { createAlbum, getAlbums, deleteAlbum } = require('../controllers/albumController');

const router = express.Router();

// Create a new album
router.post('/', createAlbum);

// Get all albums
router.get('/', getAlbums);

// Delete an album by ID
router.delete('/:id', deleteAlbum);  // Fixed route path

module.exports = router;