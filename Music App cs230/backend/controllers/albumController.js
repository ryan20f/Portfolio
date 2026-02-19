const connection = require('../db');

// Create a new album
const createAlbum = (req, res) => {
  const { albumName, artistId, releaseYear, numListens } = req.body;

  // Check if the artist exists
  const checkArtistQuery = 'SELECT * FROM artists WHERE id = ?';
  connection.query(checkArtistQuery, [artistId], (err, artistResult) => {
    if (err) {
      console.error('Error checking artist:', err);
      return res.status(500).json({ error: 'Error checking artist' });
    }

    if (artistResult.length === 0) {
      return res.status(400).json({ error: 'Artist not found' });
    }

    // Insert the album into the albums table
    const insertAlbumQuery = 'INSERT INTO albums (albumName, artistId, releaseYear, numListens) VALUES (?, ?, ?, ?)';
    connection.query(insertAlbumQuery, [albumName, artistId, releaseYear, numListens], (err, result) => {
      if (err) {
        console.error('Error creating album:', err);
        return res.status(500).json({ error: 'Error creating album' });
      }

      const albumId = result.insertId;

      // Retrieve the artist's current albums (we're updating the albums array)
      const getArtistQuery = 'SELECT * FROM artists WHERE id = ?';
      connection.query(getArtistQuery, [artistId], (err, artistResult) => {
        if (err) {
          console.error('Error fetching artist:', err);
          return res.status(500).json({ error: 'Error fetching artist' });
        }

        if (artistResult.length === 0) {
          return res.status(400).json({ error: 'Artist not found' });
        }

        // Log the current albums field (For debugging purposes)
        console.log('Current albums (before update):', artistResult[0].albums);

        // Parse the existing albums array (if any)
        let currentAlbums = artistResult[0].albums ? JSON.parse(artistResult[0].albums) : [];

        // Add the new album to the current list
        const newAlbum = { albumId, albumName, releaseYear, numListens };
        currentAlbums.push(newAlbum);

        // Log the updated albums array
        console.log('Updated albums (after addition):', currentAlbums);

        // Update the artist's albums column with the new list
        const updateArtistAlbumsQuery = `
          UPDATE artists
          SET albums = ?
          WHERE id = ?
        `;

        connection.query(updateArtistAlbumsQuery, [JSON.stringify(currentAlbums), artistId], (err, updateResult) => {
          if (err) {
            console.error('Error updating artist albums:', err);
            return res.status(500).json({ error: 'Error updating artist albums' });
          }

          // Respond with success
          res.status(201).json({
            message: 'Album created and added to artist successfully',
            album: { albumId, albumName, releaseYear, numListens }
          });
        });
      });
    });
  });
};

module.exports = { createAlbum };