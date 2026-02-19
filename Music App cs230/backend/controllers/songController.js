const connection = require('../db');

// Create a new song
const createSong = (req, res) => {
  const { songName, albumId, releaseYear } = req.body;

  // Check if the album exists (to get artistId)
  const checkAlbumQuery = 'SELECT * FROM albums WHERE id = ?';
  connection.query(checkAlbumQuery, [albumId], (err, albumResult) => {
    if (err) {
      console.error('Error checking album:', err);
      return res.status(500).json({ error: 'Error checking album' });
    }

    if (albumResult.length === 0) {
      return res.status(400).json({ error: 'Album not found' });
    }

    const artistId = albumResult[0].artistId;

    // Insert the song into the songs table
    const insertSongQuery = 'INSERT INTO songs (songName, releaseYear, albumId) VALUES (?, ?, ?)';
    connection.query(insertSongQuery, [songName, releaseYear, albumId], (err, result) => {
      if (err) {
        console.error('Error creating song:', err);
        return res.status(500).json({ error: 'Error creating song' });
      }

      const songId = result.insertId;

      // Retrieve the artist's current songs (we're updating the songs array)
      const getArtistQuery = 'SELECT * FROM artists WHERE id = ?';
      connection.query(getArtistQuery, [artistId], (err, artistResult) => {
        if (err) {
          console.error('Error fetching artist:', err);
          return res.status(500).json({ error: 'Error fetching artist' });
        }

        if (artistResult.length === 0) {
          return res.status(400).json({ error: 'Artist not found' });
        }

        // Parse the existing songs array (if any)
        let currentSongs = artistResult[0].songs ? JSON.parse(artistResult[0].songs) : [];

        // Add the new song to the current list
        const newSong = { songId, songName, albumId, releaseYear };
        currentSongs.push(newSong);

        // Update the artist's songs column with the new list
        const updateArtistSongsQuery = `
          UPDATE artists
          SET songs = ?
          WHERE id = ?
        `;

        connection.query(updateArtistSongsQuery, [JSON.stringify(currentSongs), artistId], (err, updateResult) => {
          if (err) {
            console.error('Error updating artist songs:', err);
            return res.status(500).json({ error: 'Error updating artist songs' });
          }

          // Respond with success
          res.status(201).json({
            message: 'Song created and added to artist successfully',
            song: { songId, songName, albumId, releaseYear }
          });
        });
      });
    });
  });
};

module.exports = { createSong };