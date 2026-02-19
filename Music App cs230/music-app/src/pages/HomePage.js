import React from 'react';

const HomePage = ({ artists, songs, albums }) => {
  return (
    <div>
      <h1>Welcome to the Music App!</h1>

      {/* Display the list of artists with some additional information */}
      <h2>Artists</h2>
      <ul>
        {artists.map((artist) => (
          <li key={artist.id}>
            {artist.artistName} Has {artist.monthlyListeners} Monthly Listeners, he is a {artist.genre} Artist
            {/* Add any other details about the artist if needed */}
          </li>
        ))}
      </ul>

      {/* Display the list of songs with their release year */}
      <h2>Songs</h2>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>
            {song.songName} (Released in {song.releaseYear})
          </li>
        ))}
      </ul>

      {/* Display the list of albums with their release year */}
      <h2>Albums</h2>
      <ul>
        {albums.map((album) => (
          <li key={album.id}>
            {album.albumName} (Released in {album.releaseYear})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;