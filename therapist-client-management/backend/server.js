// app.js
const express = require('express');
const app = express();
const cors = require('cors');

// Middleware
app.use(express.json());  // To parse JSON request bodies
app.use(cors());  // Enable CORS

// Import routes
const therapistRoutes = require('./routes/therapistRoutes');
const clientRoutes = require('./routes/clientRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

// Use routes
app.use('/api/therapists', therapistRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/sessions', sessionRoutes);

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});