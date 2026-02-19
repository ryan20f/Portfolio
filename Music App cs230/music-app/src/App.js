import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import HomePage from './pages/HomePage';
import Artist from './components/Artist';
import Songs from './components/Songs';
import Albums from './components/Albums';

const App = () => {
  const [activeComponent, setActiveComponent] = useState('home');
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]); // Initialize songs as an empty array
  const [albums, setAlbums] = useState([]); // Initialize albums as an empty array
  const [artists, setArtists] = useState([]); // Initialize artists as an empty array

  // Fetch data when the app loads
  useEffect(() => {
    axios.get('http://localhost:5000/api/artists')
      .then(response => {
        setArtists(response.data); // Set artists data
      })
      .catch(error => {
        console.error('Error fetching artists:', error);
      });

    axios.get('http://localhost:5000/api/songs')
      .then(response => {
        setSongs(response.data); // Set songs data
      })
      .catch(error => {
        console.error('Error fetching songs:', error);
      });

    axios.get('http://localhost:5000/api/albums')
      .then(response => {
        setAlbums(response.data); // Set albums data
      })
      .catch(error => {
        console.error('Error fetching albums:', error);
      });

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <h2>Loading, please wait...</h2>
      </div>
    );
  }

  // Handle showing different components
  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Music App</h1>
        <nav className="navbar">
          <button
            className={`navbar-link ${activeComponent === 'home' ? 'active' : ''}`}
            onClick={() => handleComponentChange('home')}
          >
            Home
          </button>
          <button
            className={`navbar-link ${activeComponent === 'artists' ? 'active' : ''}`}
            onClick={() => handleComponentChange('artists')}
          >
            Artists
          </button>
          <button
            className={`navbar-link ${activeComponent === 'albums' ? 'active' : ''}`}
            onClick={() => handleComponentChange('albums')}
          >
            Albums
          </button>
          <button
            className={`navbar-link ${activeComponent === 'songs' ? 'active' : ''}`}
            onClick={() => handleComponentChange('songs')}
          >
            Songs
          </button>
        </nav>
      </header>

      <main className="main-content">
        {activeComponent === 'home' && (
          <HomePage artists={artists} songs={songs} albums={albums} />
        )}
        {activeComponent === 'artists' && <Artist artists={artists} setArtists={setArtists} />}
        {activeComponent === 'songs' && <Songs songs={songs} setSongs={setSongs} />}
        {activeComponent === 'albums' && <Albums albums={albums} setAlbums={setAlbums} />}
      </main>

      <footer className="footer">
        <p>&copy; 2025 Music App. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;