const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const logger = require('./logger');
const { testConnection, syncModels } = require('./db');
const ltvRoutes = require('./routes/ltv');

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to log incoming requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'LTV Backend API is running',
    version: '1.0.0'
  });
});

// Use LTV routes
app.use('/api/ltv', ltvRoutes);

// Test database connection and sync models
testConnection()
  .then(() => {
    syncModels();
  })
  .catch((error) => {
    logger.error('Failed to initialize database:', error);
  });

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`LTV Backend server is running on port ${PORT}`);
});