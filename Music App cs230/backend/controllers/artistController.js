const connection = require('../db');

// Create a new artist
const createArtist = (req, res) => {
  const { artistName, monthlyListeners, genre } = req.body;

  // Insert the artist into the artists table
  const query = 'INSERT INTO artists (artistName, monthlyListeners, genre, songs, albums) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [artistName, monthlyListeners, genre, JSON.stringify([]), JSON.stringify([])], (err, result) => {
    if (err) {
      console.error('Error creating artist:', err);
      return res.status(500).json({ error: 'Error creating artist' });
    }

    const artistId = result.insertId; // Get the artist ID
    res.status(201).json({
      message: 'Artist created successfully',
      artist: { id: artistId, artistName, monthlyListeners, genre, songs: [], albums: [] }
    });
  });
};

// Get all artists with their songs and albums
const getArtists = (req, res) => {
  const query = 'SELECT * FROM artists';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching artists:', err);
      return res.status(500).json({ error: 'Error fetching artists' });
    }

    // For each artist, fetch their songs and albums from the JSON columns
    const artistsWithDetailsPromises = results.map((artist) => {
      return new Promise((resolve, reject) => {
        // Directly retrieve songs and albums from JSON columns
        const songs = artist.songs ? JSON.parse(artist.songs) : [];  // Parse the JSON to get the song names
        const albums = artist.albums ? JSON.parse(artist.albums) : [];  // Parse the JSON to get the album names

        // Add songs and albums to the artist object
        artist.songs = songs;
        artist.albums = albums;

        resolve(artist);
      });
    });

    // After all artist details are fetched, send the response
    Promise.all(artistsWithDetailsPromises)
      .then((artists) => {
        res.status(200).json(artists);
      })
      .catch((error) => {
        console.error('Error processing artist details:', error);
        res.status(500).json({ error: 'Error processing artist details' });
      });
  });
};

// Delete an artist
const deleteArtist = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM artists WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting artist:', err);
      return res.status(500).json({ error: 'Error deleting artist' });
    }
    res.status(200).json({ message: 'Artist deleted successfully' });
  });
};

module.exports = { createArtist, getArtists, deleteArtist };