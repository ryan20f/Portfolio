import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const Dashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [travelLogs, setTravelLogs] = useState([]);
  const [journeyPlans, setJourneyPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const initDashboard = async () => {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));

      if (!token || !userData) {
        navigate('/login');
      } else {
        setUser(userData);
        await fetchTravelLogs(token, userData.id);
        await fetchJourneyPlans(token, userData.id);
      }
    };

    initDashboard();
  }, [navigate]);

  const fetchTravelLogs = async (token, userId) => {
    try {
      const response = await axios.get('http://localhost:5000/api/travel_logs', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Fetched travel logs:", response.data);  // Log the fetched logs
      const allLogs = response.data;
      const userLogs = allLogs.filter(log => log.user_id === userId); // Use user_id instead of userId
      setTravelLogs(userLogs);
    } catch (error) {
      console.error('Error fetching travel logs:', error);
    }
  };

  const fetchJourneyPlans = async (token, userId) => {
    try {
      const response = await axios.get('http://localhost:5000/api/journey_plans', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Fetched journey plans:", response.data);  // Log the fetched journey plans
      const allPlans = response.data;
      const userPlans = allPlans.filter(plan => plan.user_id === userId); // Use user_id instead of userId
      setJourneyPlans(userPlans);
    } catch (error) {
      console.error('Error fetching journey plans:', error);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  // Helper function to format dates
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <ul>
          <li><Link to="/dashboard">Home</Link></li>
          <li><Link to="/travel-logs">Travel Logs</Link></li>
          <li><Link to="/journey-plans">Journey Plans</Link></li>
        </ul>
      </nav>

      <header className="App-header">
        {user ? (
          <div className="user-info">
            <h1>Welcome, {user.username}</h1>
            <p>Email: {user.email}</p>
            <p>Address: {user.address}</p>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        ) : (
          <h1>Loading...</h1>
        )}

        <div className="user-travel-logs">
          <h2>Your Travel Logs</h2>
          {travelLogs.length === 0 ? (
            <p>No travel logs available.</p>
          ) : (
            <ul>
              {travelLogs.map(log => (
                <li key={log.id}>
                  <h3>{log.title}</h3>
                  <p>{log.description}</p>
                  <p><strong>Location:</strong> {log.location}</p>
                  <p><strong>Date:</strong> {formatDate(log.start_date)}</p> {/* Format the date */}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="user-journey-plans">
          <h2>Your Journey Plans</h2>
          {journeyPlans.length === 0 ? (
            <p>No journey plans available.</p>
          ) : (
            <ul>
              {journeyPlans.map(plan => (
                <li key={plan.id}>
                  <h3>{plan.name}</h3> {/* Use the correct property name */}
                  <p>{plan.locations}</p>
                  <p><strong>Start Date:</strong> {formatDate(plan.start_date)}</p> {/* Format the date */}
                  <p><strong>End Date:</strong> {formatDate(plan.end_date)}</p> {/* Format the date */}
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <footer className="App-footer">
        <p>© 2025 Travel App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;