// src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h2>Welcome to Therapist Client Management System</h2>
      <p>Manage therapists, clients, and sessions with ease.</p>
      
      <div className="home-buttons">
        <Link to="/therapists">
          <button>Manage Therapists</button>
        </Link>
        <Link to="/clients">
          <button>Manage Clients</button>
        </Link>
        <Link to="/sessions">
          <button>Manage Sessions</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;