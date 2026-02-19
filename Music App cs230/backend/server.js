const express = require('express');
const cors = require('cors');
const app = express();

// Import the route files
const artistRoutes = require('./routes/artistRoutes');
const albumRoutes = require('./routes/albumRoutes');
const songRoutes = require('./routes/songRoutes');

// Middleware setup
app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(express.json());  // Using built-in express.json()

// Use the routes for specific endpoints with a prefix
app.use('/api/artists', artistRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/songs', songRoutes);

// Set the server to listen on a specific port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
