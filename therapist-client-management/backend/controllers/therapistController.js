const db = require('../db');

// Get all therapists
exports.getAllTherapists = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM therapists');
    res.json(rows);
  } catch (error) {
    console.error('Error retrieving therapists:', error);
    res.status(500).json({ message: 'Error retrieving therapists' });
  }
};

// Create a new therapist
exports.createTherapist = async (req, res) => {
  const { title, name, email, location, years_of_practice, availability } = req.body;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address format.' });
  }

  try {
    // Insert data into the database treating years_of_practice as a string
    const [result] = await db.query(
      'INSERT INTO therapists (title, name, email, location, years_of_practice, availability) VALUES (?, ?, ?, ?, ?, ?)',
      [title, name, email, location, years_of_practice, availability]
    );

    const newTherapist = { id: result.insertId, title, name, email, location, years_of_practice, availability };
    res.status(201).json(newTherapist);
  } catch (error) {
    console.error('Error creating therapist:', error);
    res.status(500).json({ message: 'Error creating therapist' });
  }
};

// Update a therapist
exports.updateTherapist = async (req, res) => {
  const { id } = req.params;
  const { title, name, email, location, years_of_practice, availability } = req.body;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address format.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE therapists SET title = ?, name = ?, email = ?, location = ?, years_of_practice = ?, availability = ? WHERE id = ?',
      [title, name, email, location, years_of_practice, availability, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Therapist not found' });
    }

    const updatedTherapist = { id, title, name, email, location, years_of_practice, availability };
    res.json(updatedTherapist);
  } catch (error) {
    console.error('Error updating therapist:', error);
    res.status(500).json({ message: 'Error updating therapist' });
  }
};

// Delete a therapist
exports.deleteTherapist = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM therapists WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Therapist not found' });
    }

    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting therapist:', error);
    res.status(500).json({ message: 'Error deleting therapist' });
  }
};