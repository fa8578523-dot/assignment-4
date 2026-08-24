const express = require('express');
const router = express.Router();
const {
  createSupplier,
  getAllSuppliers,
  updateSupplier,
  deleteSupplier,
  getSuppliersStartsWithF
} = require('../controllers/supplierController');

// Task 11 special endpoint
router.get('/special/starts-with-f', getSuppliersStartsWithF);

// Task 3 Standard CRUD
router.get('/', getAllSuppliers);
router.post('/', createSupplier);
router.put('/:id', updateSupplier);
router.delete('/:id', deleteSupplier);

module.exports = router;
