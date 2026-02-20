// src/components/ClientPage.js
import React, { useState } from 'react';

const ClientPage = () => {
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: '',
    regularity: '',
  });

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields before sending
    if (!clientData.name || !clientData.email || !clientData.phone || !clientData.regularity) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });

      const result = await response.json(); // Get the response JSON

      if (response.ok) {
        alert('Client added successfully');
        setClientData({
          name: '',
          email: '',
          phone: '',
          regularity: '',
        });
      } else {
        console.error('Error response:', result); // Log the full error response
        alert(result.message || 'Error adding client');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding client');
    }
  };

  return (
    <div className="content">
      <h2>Add Client</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={clientData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={clientData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={clientData.phone}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Regularity of Appointments:
          <select
            name="regularity"
            value={clientData.regularity}
            onChange={handleChange}
            required
          >
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </label>
        <button type="submit">Add Client</button>
      </form>
    </div>
  );
};

export default ClientPage;