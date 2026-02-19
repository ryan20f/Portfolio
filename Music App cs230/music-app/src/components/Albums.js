import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Albums = ({ albums = [], setAlbums }) => {
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumArtist, setNewAlbumArtist] = useState('');
  const [newAlbumYear, setNewAlbumYear] = useState('');
  const [newAlbumListeners, setNewAlbumListeners] = useState('');  // Add state for listeners
  const [artists, setArtists] = useState([]);

  // Fetch available artists
  useEffect(() => {
    axios.get('http://localhost:5000/api/artists')
      .then((response) => setArtists(response.data))
      .catch((error) => console.error('Error fetching artists:', error));
  }, []);

  const handleAddAlbum = () => {
    if (!newAlbumName || !newAlbumArtist || !newAlbumYear || !newAlbumListeners) return;

    const newAlbum = {
      name: newAlbumName,
      artistId: newAlbumArtist,  // This should be the artist's id (from artists table)
      releaseYear: newAlbumYear,
      numListens: newAlbumListeners, // Include the number of listeners
    };

    axios.post('http://localhost:5000/api/albums', newAlbum)
      .then(response => {
        setAlbums([...albums, response.data]);  // Add the new album to the state
        setNewAlbumName('');
        setNewAlbumArtist('');
        setNewAlbumYear('');
        setNewAlbumListeners('');  // Reset listeners input field
      })
      .catch(error => {
        console.error('Error adding album:', error.response ? error.response.data : error);
      });
  };

  const handleDeleteAlbum = (id) => {
    axios.delete(`http://localhost:5000/api/albums/${id}`)
      .then(() => {
        setAlbums(albums.filter(album => album.id !== id));  // Remove album from the state
      })
      .catch(error => {
        console.error('Error deleting album:', error);
      });
  };

  return (
    <div>
      <h2>Albums</h2>
      <div>
        <input
          type="text"
          placeholder="Album name"
          value={newAlbumName}
          onChange={(e) => setNewAlbumName(e.target.value)}
        />

        {/* Dropdown for selecting artist */}
        <select
          value={newAlbumArtist}
          onChange={(e) => setNewAlbumArtist(e.target.value)}
        >
          <option value="">Select Artist</option>
          {artists.map(artist => (
            <option key={artist.id} value={artist.id}> {/* Use artist.id */}
              {artist.artistName}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Release Year"
          value={newAlbumYear}
          onChange={(e) => setNewAlbumYear(e.target.value)}
        />

        <input
          type="number"
          placeholder="Number of Listeners"
          value={newAlbumListeners}
          onChange={(e) => setNewAlbumListeners(e.target.value)}
        />
        
        <button onClick={handleAddAlbum}>Add Album</button>
      </div>

      {/* Display the albums */}
      <ul>
        {Array.isArray(albums) && albums.map(album => (
          <li key={album.id}>
            {/* Display the album name, artist name, release year, and number of listeners */}
            {album.albumName} - {album.artistName} ({album.releaseYear}) - {album.numListens} listeners
            <button onClick={() => handleDeleteAlbum(album.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Albums;