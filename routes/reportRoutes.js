const express = require('express');
const router = express.Router();
const { getTotalSoldPerProduct } = require('../controllers/reportController');

// Task 9: Total quantity sold for each product using aggregate functions
router.get('/total-sold-per-product', getTotalSoldPerProduct);

module.exports = router;
