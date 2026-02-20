import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

function TravelLogs() {
  const [logs, setLogs] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState(null);
  const [editingLogId, setEditingLogId] = useState(null);

  const api = axios.create({ baseURL: 'http://localhost:5000/api' });
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const fetchLogs = async () => {
    try {
      const response = await api.get('/travel_logs');
      setLogs(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching travel logs:', err);
      setError('Failed to fetch travel logs. Please try again later.');
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setTags('');
    setEditingLogId(null);
    setError(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    if (!title || !description || !startDate || !endDate) {
      setError('Please fill in all required fields.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after the end date.');
      return;
    }

    const payload = {
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      tags: tags || null,
    };

    try {
      if (editingLogId) {
        await api.put(`/travel_logs/${editingLogId}`, payload, { headers: { 'Content-Type': 'application/json' } });
      } else {
        await api.post('/travel_logs', payload, { headers: { 'Content-Type': 'application/json' } });
      }
      resetForm();
      fetchLogs();
    } catch (err) {
      console.error('Error saving travel log:', err);
      setError(`Failed to ${editingLogId ? 'update' : 'create'} travel log. Please try again.`);
    }
  };

  const handleEditClick = log => {
    setEditingLogId(log.id);
    setTitle(log.title);
    setDescription(log.description);
    setStartDate(log.start_date);
    setEndDate(log.end_date);
    setTags(log.tags || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async id => {
    try {
      await api.delete(`/travel_logs/${id}`);
      fetchLogs();
    } catch (err) {
      console.error('Error deleting travel log:', err);
      setError('Failed to delete travel log. Please try again.');
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
        <h1>Travel Logs</h1>
        <p>Document and review your exciting journeys!</p>

        <form className="form-body" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}

          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            required
          />

          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description"
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
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="Tags"
          />

          <button type="submit">
            {editingLogId ? 'Save Changes' : 'Create Travel Log'}
          </button>
          {editingLogId && (
            <button type="button" onClick={resetForm} className="cancel-btn">
              Cancel Edit
            </button>
          )}
        </form>
      </header>

      <ul className="logs-list">
        {logs.map(log => (
          <li key={log.id} className="log-item">
            <div className="log-details">
              <h3>{log.title}</h3>
              <p>{log.description}</p>
              <p>{log.start_date} to {log.end_date}</p>
              <p>{log.tags}</p>
              <div className="actions">
                <button onClick={() => handleEditClick(log)}>Edit</button>
                <button onClick={() => handleDelete(log.id)}>Delete</button>
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

export default TravelLogs;
