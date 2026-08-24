const express = require('express');
const router = express.Router();
const {
  recordSale,
  getAllSales,
  getSalesForProduct,
  getDetailedSales
} = require('../controllers/saleController');

// Task 13 JOIN query endpoint
router.get('/detailed', getDetailedSales);

// Task 4c Retrieve sales for a specific product
router.get('/product/:productId', getSalesForProduct);

// Task 4a & 4b
router.get('/', getAllSales);
router.post('/', recordSale);

module.exports = router;
