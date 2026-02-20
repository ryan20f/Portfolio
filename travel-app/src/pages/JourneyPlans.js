import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

function JourneyPlans() {
  const [journeyPlans, setJourneyPlans] = useState([]);
  const [name, setName] = useState('');
  const [locations, setLocations] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activities, setActivities] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [editingPlanId, setEditingPlanId] = useState(null);

  const api = axios.create({ baseURL: 'http://localhost:5000/api' });
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const fetchPlans = async () => {
    try {
      const response = await api.get('/journey_plans');
      setJourneyPlans(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching journey plans:', err);
      setError('Failed to fetch journey plans. Please try again later.');
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  const resetForm = () => {
    setName('');
    setLocations('');
    setStartDate('');
    setEndDate('');
    setActivities('');
    setDescription('');
    setEditingPlanId(null);
    setError(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    if (!name || !locations || !startDate || !endDate) {
      setError('Please fill in all required fields.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date.');
      return;
    }

    const payload = {
      name,
      locations,
      start_date: startDate,
      end_date: endDate,
      activities,
      description,
    };

    try {
      if (editingPlanId) {
        await api.put(`/journey_plans/${editingPlanId}`, payload, { headers: { 'Content-Type': 'application/json' } });
      } else {
        await api.post('/journey_plans', payload, { headers: { 'Content-Type': 'application/json' } });
      }
      resetForm();
      fetchPlans();
    } catch (err) {
      console.error('Error saving journey plan:', err);
      setError(`Failed to ${editingPlanId ? 'update' : 'create'} journey plan. Please try again.`);
    }
  };

  const handleEditClick = plan => {
    setEditingPlanId(plan.id);
    setName(plan.name);
    setLocations(plan.locations);
    setStartDate(plan.start_date);
    setEndDate(plan.end_date);
    setActivities(plan.activities);
    setDescription(plan.description);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async id => {
    try {
      await api.delete(`/journey_plans/${id}`);
      fetchPlans();
    } catch (err) {
      console.error('Error deleting journey plan:', err);
      setError('Failed to delete journey plan. Please try again.');
    }
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
        <h1>Journey Plans</h1>
        <p>Plan and organize your upcoming adventures!</p>

        <form className="form-body" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}

          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Plan Name"
            required
          />

          <input
            type="text"
            value={locations}
            onChange={e => setLocations(e.target.value)}
            placeholder="Locations (comma-separated)"
            required
          />

          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
          />

          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            required
          />

          <input
            type="text"
            value={activities}
            onChange={e => setActivities(e.target.value)}
            placeholder="Activities (comma-separated)"
          />

          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description"
          />

          <button type="submit">
            {editingPlanId ? 'Save Changes' : 'Create Journey Plan'}
          </button>
          {editingPlanId && (
            <button type="button" onClick={resetForm} className="cancel-btn">
              Cancel Edit
            </button>
          )}
        </form>
      </header>

      <ul className="logs-list">
        {journeyPlans.map(plan => (
          <li key={plan.id} className="log-item">
            <div className="log-details">
              <h3>{plan.name}</h3>
              <p><strong>Locations:</strong> {plan.locations}</p>
              <p><strong>Dates:</strong> {plan.start_date} to {plan.end_date}</p>
              <p><strong>Activities:</strong> {plan.activities}</p>
              <p>{plan.description}</p>
              <div className="actions">
                <button onClick={() => handleEditClick(plan)}>Edit</button>
                <button onClick={() => handleDelete(plan.id)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <footer className="App-footer">
        <p>© 2025 Travel App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default JourneyPlans;
