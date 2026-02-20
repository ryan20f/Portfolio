import React, { useState } from 'react';

const TherapistPage = () => {
  const [therapistData, setTherapistData] = useState({
    title: '',
    name: '',
    email: '',
    location: '',
    yearsOfPractice: '', // Treat as string to send as varchar
    availability: 'Taking Clients', // Default value
  });

  const [isLoading, setIsLoading] = useState(false); // To show loading state
  const [error, setError] = useState(null); // To track any errors

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setTherapistData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure yearsOfPractice is a valid numeric value and not empty
    const yearsOfPractice = therapistData.yearsOfPractice.trim();
    if (yearsOfPractice === '' || isNaN(yearsOfPractice) || parseInt(yearsOfPractice, 10) <= 0) {
      alert('Years of practice must be a valid positive number');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(therapistData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(true); // Set loading state to true when making the request
    setError(null); // Reset any previous errors

    try {
      const response = await fetch('http://localhost:5000/api/therapists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...therapistData,
          years_of_practice: yearsOfPractice, // Send years_of_practice as string
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Error adding therapist');
        throw new Error(errorData.message || 'Error adding therapist');
      }

      alert('Therapist added successfully');
      setTherapistData({
        title: '',
        name: '',
        email: '',
        location: '',
        yearsOfPractice: '', // Reset to empty string
        availability: 'Taking Clients', // Reset default value
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding therapist');
    } finally {
      setIsLoading(false); // Set loading state to false once the request is complete
    }
  };

  return (
    <div className="content">
      <h2>Add Therapist</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={therapistData.title}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </label>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={therapistData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={therapistData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </label>
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={therapistData.location}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </label>
        <label>
          Years of Practice:
          <input
            type="text"
            name="yearsOfPractice"
            value={therapistData.yearsOfPractice}
            onChange={handleChange}
            required
            disabled={isLoading}
            min="1"
          />
        </label>
        <label>
          Availability:
          <select
            name="availability"
            value={therapistData.availability}
            onChange={handleChange}
            required
            disabled={isLoading}
          >
            <option value="Taking Clients">Taking Clients</option>
            <option value="Not Taking Clients">Not Taking Clients</option>
          </select>
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Therapist'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if any */}
    </div>
  );
};

export default TherapistPage;