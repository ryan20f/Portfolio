import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Songs = ({ songs = [], setSongs }) => {
  const [newSongName, setNewSongName] = useState('');
  const [newSongAlbum, setNewSongAlbum] = useState('');
  const [newSongYear, setNewSongYear] = useState('');
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState('');

  // Fetch available albums
  useEffect(() => {
    axios.get('http://localhost:5000/api/albums')
      .then(response => setAlbums(response.data))
      .catch(error => console.error('Error fetching albums:', error.response ? error.response.data : error));
  }, []);

  const handleAddSong = () => {
    // Check if all fields are filled
    if (!newSongName || !newSongAlbum || !newSongYear) {
      setError('All fields are required');
      return;
    }

    const newSong = {
      name: newSongName,
      albumId: newSongAlbum,
      releaseYear: newSongYear,
    };

    // Send the POST request to add the song
    axios.post('http://localhost:5000/api/songs', newSong)
      .then(response => {
        // Add the new song to the state after it has been created
        setSongs([...songs, response.data]);

        // Reset the input fields
        setNewSongName('');
        setNewSongAlbum('');
        setNewSongYear('');
        setError('');
      })
      .catch(error => {
        console.error('Error adding song:', error.response ? error.response.data : error);
        setError('Failed to add song');
      });
  };

  // Function to delete a song
  const handleDeleteSong = (id) => {
    axios.delete(`http://localhost:5000/api/songs/${id}`)  // Ensure the ID is passed in the URL
      .then(() => {
        setSongs(songs.filter(song => song.id !== id));  // Remove the song from the state after deletion
      })
      .catch(error => {
        console.error('Error deleting song:', error.response ? error.response.data : error);
        setError('Failed to delete song');  // Display a deletion error message
      });
  };

  return (
    <div>
      <h2>Songs</h2>
      <div>
        <input
          type="text"
          placeholder="Song name"
          value={newSongName}
          onChange={(e) => setNewSongName(e.target.value)}  // Update the song name input
        />

        {/* Dropdown for selecting album */}
        <select
          value={newSongAlbum}
          onChange={(e) => setNewSongAlbum(e.target.value)}  // Update the album selection
        >
          <option value="">Select Album</option>
          {albums.map(album => (
            <option key={album.id} value={album.id}>  {/* Correctly map album id */}
              {album.albumName}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Release Year"
          value={newSongYear}
          onChange={(e) => setNewSongYear(e.target.value)}  // Update the release year input
        />
        <button onClick={handleAddSong}>Add Song</button>  {/* Add song button */}
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}  {/* Display error messages */}

      <ul>
        {Array.isArray(songs) && songs.map(song => (
          <li key={song.id}>
            {song.songName} ({song.releaseYear})
            <button onClick={() => handleDeleteSong(song.id)}>Delete</button>  {/* Delete song button */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Songs;