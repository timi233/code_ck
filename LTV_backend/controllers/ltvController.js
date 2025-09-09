const LTVData = require('../models/LTVData');
const logger = require('../logger');

// Get LTV data for a user
async function getLTVData(req, res) {
  try {
    const { userId } = req.user;
    
    // Find LTV data for the user
    const ltvData = await LTVData.findAll({
      where: { userId },
      order: [['calculationDate', 'DESC']]
    });
    
    res.json({
      success: true,
      data: ltvData
    });
  } catch (error) {
    logger.error('Error retrieving LTV data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}

// Save LTV data
async function saveLTVData(req, res) {
  try {
    const { userId, name } = req.user;
    const { customerId, customerName, ltvValue, details } = req.body;
    
    // Create or update LTV data
    const ltvData = await LTVData.create({
      userId,
      userName: name,
      customerId,
      customerName,
      ltvValue,
      calculationDate: new Date(),
      details
    });
    
    res.json({
      success: true,
      data: ltvData
    });
  } catch (error) {
    logger.error('Error saving LTV data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}

// Get LTV data by customer ID
async function getLTVDataByCustomer(req, res) {
  try {
    const { customerId } = req.params;
    const { userId } = req.user;
    
    // Find LTV data for the customer
    const ltvData = await LTVData.findOne({
      where: { 
        customerId,
        userId  // Ensure user can only access their own data
      }
    });
    
    if (!ltvData) {
      return res.status(404).json({ 
        success: false, 
        message: 'LTV data not found' 
      });
    }
    
    res.json({
      success: true,
      data: ltvData
    });
  } catch (error) {
    logger.error('Error retrieving LTV data by customer:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}

module.exports = {
  getLTVData,
  saveLTVData,
  getLTVDataByCustomer
};