// controllers/clientController.js
const db = require('../db');

// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clients');
    res.json(rows);
  } catch (error) {
    console.error('Error retrieving clients:', error);
    res.status(500).json({ message: 'Error retrieving clients' });
  }
};

// Create a new client
exports.createClient = async (req, res) => {
  const { name, email, phone, regularity } = req.body;

  console.log("Received client data:", req.body); // Debugging log

  // Basic validation to check if any required fields are missing
  if (!name || !email || !phone || !regularity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO clients (name, email, phone, regularity) VALUES (?, ?, ?, ?)',
      [name, email, phone, regularity]
    );
    const newClient = { id: result.insertId, name, email, phone, regularity };
    res.status(201).json(newClient);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ message: 'Error creating client' });
  }
};

// Update a client
exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, regularity } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE clients SET name = ?, email = ?, phone = ?, regularity = ? WHERE id = ?',
      [name, email, phone, regularity, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const updatedClient = { id, name, email, phone, regularity };
    res.json(updatedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ message: 'Error updating client' });
  }
};

// Delete a client
exports.deleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM clients WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ message: 'Error deleting client' });
  }
};