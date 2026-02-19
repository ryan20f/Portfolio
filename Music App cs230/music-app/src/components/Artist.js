import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Artist = () => {
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [artistName, setArtistName] = useState('');
  const [monthlyListeners, setMonthlyListeners] = useState('');
  const [genre, setGenre] = useState('');

  // Fetch all artists, albums, and songs
  useEffect(() => {
    // Fetch artists
    axios.get('http://localhost:5000/api/artists')
      .then((response) => {
        setArtists(response.data);
        console.log('Fetched Artists:', response.data);
      })
      .catch((error) => console.error('Error fetching artists:', error));

    // Fetch albums
    axios.get('http://localhost:5000/api/albums')
      .then((response) => {
        setAlbums(response.data);
        console.log('Fetched Albums:', response.data);
      })
      .catch((error) => console.error('Error fetching albums:', error));

    // Fetch songs
    axios.get('http://localhost:5000/api/songs')
      .then((response) => {
        setSongs(response.data);
        console.log('Fetched Songs:', response.data);
      })
      .catch((error) => console.error('Error fetching songs:', error));
  }, []);

  // Handle adding a new artist
  const handleAddArtist = () => {
    const newArtist = { artistName, monthlyListeners, genre };
    axios.post('http://localhost:5000/api/artists', newArtist)
      .then((response) => setArtists([...artists, response.data.artist]))
      .catch((error) => console.error('Error adding artist:', error));
  };

  // Handle deleting an artist
  const handleDeleteArtist = (id) => {
    axios.delete(`http://localhost:5000/api/artists/${id}`)
      .then(() => setArtists(artists.filter(artist => artist.id !== id)))
      .catch((error) => console.error('Error deleting artist:', error));
  };

  return (
    <div>
      <h2>Artists</h2>
      <input
        type="text"
        value={artistName}
        onChange={(e) => setArtistName(e.target.value)}
        placeholder="Artist Name"
      />
      <input
        type="number"
        value={monthlyListeners}
        onChange={(e) => setMonthlyListeners(e.target.value)}
        placeholder="Monthly Listeners"
      />
      <input
        type="text"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        placeholder="Genre"
      />
      <button onClick={handleAddArtist}>Add Artist</button>

      <ul>
        {artists.map((artist) => (
          <li key={artist.id}>
            <h3>{artist.artistName} ({artist.genre}, {artist.monthlyListeners} listeners)</h3>

            <h4>Albums:</h4>
            <ul>
              {albums
                .filter((album) => album.artistName === artist.artistName) // Filter albums by artistName
                .map((album) => (
                  <li key={album.id}>
                    {/* Render album details */}
                    <h5>{album.albumName} ({album.releaseYear})</h5>
                    <h6>Songs:</h6>
                    <ul>
                      {songs
                        .filter((song) => song.albumName === album.albumName) // Filter songs by albumName
                        .map((song) => (
                          <li key={song.id}>
                            {/* Render song details */}
                            {song.songName} ({song.releaseYear})
                          </li>
                        ))}
                    </ul>
                  </li>
                ))}
              {albums.filter((album) => album.artistName === artist.artistName).length === 0 && (
                <li>No albums available for this artist.</li>
              )}
            </ul>

            <button onClick={() => handleDeleteArtist(artist.id)}>Delete Artist</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Artist;