const axios = require('axios');
const logger = require('../logger');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Feishu Auth service URL
const FEISHU_AUTH_URL = process.env.FEISHU_AUTH_URL || 'http://auth_backend:4000';

// Middleware to verify JWT token from Feishu Auth service
async function verifyFeishuToken(req, res, next) {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Missing or invalid authorization header' 
      });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify the token with Feishu Auth service
    const response = await axios.get(`${FEISHU_AUTH_URL}/api/auth/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data.success) {
      // Add user info to request object
      req.user = response.data.data;
      next();
    } else {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
  } catch (error) {
    logger.error('Error verifying token with Feishu Auth service:', error.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}

module.exports = { verifyFeishuToken };