// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import TravelLogs from './pages/TravelLogs';
import JourneyPlans from './pages/JourneyPlans';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  // Always start unauthenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Called by your <Login> page when login succeeds
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Called whenever you want to log out
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Always go to /login on first load */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public */}
        <Route 
          path="/login" 
          element={<Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/register" 
          element={<Register />} 
        />

        {/* Protected */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated 
              ? <Dashboard onLogout={handleLogout} /> 
              : <Navigate to="/login" replace />
          } 
        />

        <Route 
          path="/travel-logs" 
          element={
            isAuthenticated 
              ? <TravelLogs /> 
              : <Navigate to="/login" replace />
          } 
        />

        <Route 
          path="/journey-plans" 
          element={
            isAuthenticated 
              ? <JourneyPlans /> 
              : <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
