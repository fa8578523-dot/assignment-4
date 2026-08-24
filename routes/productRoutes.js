const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateBreadPrice,
  deleteEggsProduct,
  getHighestStockProduct,
  getNeverSoldProducts
} = require('../controllers/productController');

// Task 10 & Task 12 special endpoints (before :id)
router.get('/special/highest-stock', getHighestStockProduct);
router.get('/special/never-sold', getNeverSoldProducts);

// Task 7 & Task 8 special endpoints
router.put('/special/update-bread-price', updateBreadPrice);
router.delete('/special/delete-eggs', deleteEggsProduct);

// Task 2 Standard CRUD
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
