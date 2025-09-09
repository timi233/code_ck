const express = require('express');
const { verifyFeishuToken } = require('../middleware/auth');
const { getLTVData, saveLTVData, getLTVDataByCustomer } = require('../controllers/ltvController');

const router = express.Router();

// Apply Feishu token verification middleware to all subsequent routes in this router
router.use(verifyFeishuToken);

// GET /ltv - Get LTV data for the authenticated user
router.get('/', getLTVData);

// POST /ltv - Save LTV data
router.post('/', saveLTVData);

// GET /ltv/:customerId - Get LTV data by customer ID
router.get('/:customerId', getLTVDataByCustomer);

module.exports = router;