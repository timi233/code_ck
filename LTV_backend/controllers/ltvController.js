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

const { v4: uuidv4 } = require('uuid');

// Save or Update LTV data
async function saveLTVData(req, res) {
  try {
    const { userId, name: userName } = req.user; // User info from token
    const { rawData, calculatedData } = req.body;

    if (!rawData || !calculatedData) {
      return res.status(400).json({ success: false, message: 'Invalid data format' });
    }

    // Use the ID from the form if it exists (for updates), otherwise generate a new UUID for new customers
    const customerId = rawData.id || uuidv4();

    const ltvRecord = {
      userId: userId,
      userName: userName,
      customerId: customerId,
      customerName: rawData.name,
      ltvValue: calculatedData.finalScore,
      calculationDate: new Date(),
      details: { rawData, calculatedData } // Store all details in the JSON field
    };

    // Find if a record already exists for this customer and user
    const [instance, created] = await LTVData.findOrCreate({
      where: { customerId: customerId, userId: userId },
      defaults: ltvRecord
    });

    if (!created) {
      // If the record was found, update it with the new data
      await instance.update(ltvRecord);
    }

    res.status(created ? 201 : 200).json({ success: true, data: instance });

  } catch (error) {
    logger.error('Error saving LTV data:', { message: error.message, stack: error.stack });
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