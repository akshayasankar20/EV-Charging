const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const stationRoutes = require('./routes/stations');
const recommendRoutes = require('./routes/recommend');
const bookRoutes = require('./routes/book');
const predictRoutes = require('./routes/predict');

// Routes
app.use('/api/stations', stationRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/predict', predictRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 EV Charging Backend running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
});

module.exports = app;
