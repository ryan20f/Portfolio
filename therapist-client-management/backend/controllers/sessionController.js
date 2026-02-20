const db = require('../db');

// Get therapist ID by name
exports.getTherapistByName = async (req, res) => {
  const { name } = req.params; // The name will be automatically decoded by express

  try {
    // Log the decoded name to check for any unexpected characters
    console.log("Decoded Therapist Name:", name);

    // Query the database for the therapist's ID
    const [rows] = await db.query('SELECT id FROM therapists WHERE name = ?', [name]);

    // If no therapist is found, return a 404 error
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Therapist not found' });
    }

    // Return the therapist's ID
    res.json(rows[0]);
  } catch (error) {
    console.error('Error retrieving therapist:', error);
    res.status(500).json({ message: 'Error retrieving therapist' });
  }
};

// Get client ID by name
exports.getClientByName = async (req, res) => {
  const { name } = req.params; // The name will be automatically decoded by express

  try {
    // Log the decoded name to check for any unexpected characters
    console.log("Decoded Client Name:", name);

    // Query the database for the client's ID
    const [rows] = await db.query('SELECT id FROM clients WHERE name = ?', [name]);

    // If no client is found, return a 404 error
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Return the client's ID
    res.json(rows[0]);
  } catch (error) {
    console.error('Error retrieving client:', error);
    res.status(500).json({ message: 'Error retrieving client' });
  }
};

// Create a new session
exports.createSession = async (req, res) => {
  const { therapist_id, client_id, notes, date, length } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO sessions (therapist_id, client_id, notes, date, length) VALUES (?, ?, ?, ?, ?)',
      [therapist_id, client_id, notes, date, length]
    );
    const newSession = { id: result.insertId, therapist_id, client_id, notes, date, length };
    res.status(201).json(newSession);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ message: 'Error creating session' });
  }
};

// Update a session
exports.updateSession = async (req, res) => {
  const { id } = req.params;
  const { therapist_id, client_id, notes, date, length } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE sessions SET therapist_id = ?, client_id = ?, notes = ?, date = ?, length = ? WHERE id = ?',
      [therapist_id, client_id, notes, date, length, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const updatedSession = { id, therapist_id, client_id, notes, date, length };
    res.json(updatedSession);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ message: 'Error updating session' });
  }
};

// Delete a session
exports.deleteSession = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM sessions WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ message: 'Error deleting session' });
  }
};