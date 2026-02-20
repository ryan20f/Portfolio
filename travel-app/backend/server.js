require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Debugging Middleware (Logs incoming requests)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Import routes
const journeyPlanRoutes = require('./routes/journeyPlanRoutes');
const travelLogRoutes = require('./routes/travelLogRoutes');
const userRoutes = require('./routes/userRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/travel_logs', travelLogRoutes);
app.use('/api/journey_plans', journeyPlanRoutes);

// Handle undefined routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Error occurred:", err.message); // Log error details
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
