const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const logger = require('./logger');

// Load environment variables from .env file
dotenv.config();

// Database configuration from environment variables
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '3306';
const dbName = process.env.DB_NAME || 'ltv_db';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbDialect = process.env.DB_DIALECT || 'mysql';

// Log the actual values being used
logger.info('Database configuration:', {
  host: dbHost,
  port: dbPort,
  database: dbName,
  username: dbUser,
  dialect: dbDialect
});

// Create Sequelize instance
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: dbDialect,
  logging: (msg) => logger.debug(msg),
  dialectOptions: {
    // MySQL specific options
    connectTimeout: 60000
  },
  // Pool configuration
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    logger.info('Connected to MySQL database');
  } catch (error) {
    logger.error('Error connecting to MySQL database:', error.message);
    // Log detailed connection info for debugging (without password)
    logger.error('Connection details:', {
      host: dbHost,
      port: dbPort,
      database: dbName,
      username: dbUser,
      dialect: dbDialect
    });
  }
}

// Sync models with database
async function syncModels() {
  try {
    await sequelize.sync({ alter: true });
    logger.info('Database models synced successfully');
  } catch (error) {
    logger.error('Error syncing database models:', error.message);
  }
}

// Export sequelize instance and helper functions
module.exports = {
  sequelize,
  testConnection,
  syncModels
};