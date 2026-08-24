const express = require('express');
const router = express.Router();
const {
  addCategoryColumn,
  removeCategoryColumn,
  modifyContactNumber,
  addNotNullProductName,
  seedData,
  setupStoreManagerPermissions
} = require('../controllers/adminController');

// Task 5 Migration Endpoints
router.post('/migrations/add-category', addCategoryColumn);
router.delete('/migrations/remove-category', removeCategoryColumn);
router.patch('/migrations/modify-contact-number', modifyContactNumber);
router.patch('/migrations/add-not-null-product-name', addNotNullProductName);

// Task 6 Seed Initialization Endpoint
router.post('/seed', seedData);

// Tasks 14, 15, 16 User Permissions Endpoint
router.post('/permissions/store-manager', setupStoreManagerPermissions);

module.exports = router;
