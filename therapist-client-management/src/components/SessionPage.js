import React, { useState } from 'react';

const SessionPage = () => {
  const [sessionData, setSessionData] = useState({
    therapistName: '',
    clientName: '',
    notes: '',
    date: '',
    length: '',
  });

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSessionData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Get therapist ID by name
  const getTherapistId = async (name) => {
    try {
      // URL encode the therapist name to handle spaces or special characters
      const encodedName = encodeURIComponent(name);

      const response = await fetch(`http://localhost:5000/api/therapists/by-name/${encodedName}`);
      if (!response.ok) {
        throw new Error('Therapist not found');
      }
      const data = await response.json();
      return data.id; // Assuming the response contains an object with `id` field
    } catch (error) {
      console.error('Error fetching therapist:', error);
      alert('Therapist not found');
      throw error;
    }
  };

  // Get client ID by name
  const getClientId = async (name) => {
    try {
      // URL encode the client name to handle spaces or special characters
      const encodedName = encodeURIComponent(name);

      const response = await fetch(`http://localhost:5000/api/clients/by-name/${encodedName}`);
      if (!response.ok) {
        throw new Error('Client not found');
      }
      const data = await response.json();
      return data.id; // Assuming the response contains an object with `id` field
    } catch (error) {
      console.error('Error fetching client:', error);
      alert('Client not found');
      throw error;
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Fetch therapist and client IDs based on their names
      const therapistId = await getTherapistId(sessionData.therapistName);
      const clientId = await getClientId(sessionData.clientName);

      const sessionPayload = {
        therapist_id: therapistId,
        client_id: clientId,
        notes: sessionData.notes,
        date: sessionData.date,
        length: sessionData.length,
      };

      const response = await fetch('http://localhost:5000/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionPayload),
      });

      if (response.ok) {
        alert('Session added successfully');
        setSessionData({
          therapistName: '',
          clientName: '',
          notes: '',
          date: '',
          length: '',
        });
      } else {
        alert('Error adding session');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding session');
    }
  };

  return (
    <div className="content">
      <h2>Add Session</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Therapist Name:
          <input
            type="text"
            name="therapistName"
            value={sessionData.therapistName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Client Name:
          <input
            type="text"
            name="clientName"
            value={sessionData.clientName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Notes:
          <textarea
            name="notes"
            value={sessionData.notes}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Date:
          <input
            type="datetime-local"
            name="date"
            value={sessionData.date}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Length (minutes):
          <input
            type="number"
            name="length"
            value={sessionData.length}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Add Session</button>
      </form>
    </div>
  );
};

export default SessionPage;
