import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import the CSS
import './App.css';

// Pages
import HomePage from './components/HomePage';
import TherapistPage from './components/TherapistPage';
import ClientPage from './components/ClientPage';
import SessionPage from './components/SessionPage';

function App() {
  return (
    <Router>
      {/* Navbar - directly included here */}
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/therapists">Therapists</Link>
          </li>
          <li>
            <Link to="/clients">Clients</Link>
          </li>
          <li>
            <Link to="/sessions">Sessions</Link>
          </li>
        </ul>
      </nav>

      {/* Routes for different pages */}
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/therapists" element={<TherapistPage />} />
          <Route path="/clients" element={<ClientPage />} />
          <Route path="/sessions" element={<SessionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;