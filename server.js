const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { testConnection } = require('./config/db');

// Load Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware Setup
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Route Imports
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const saleRoutes = require('./routes/saleRoutes');
const reportRoutes = require('./routes/reportRoutes');
const adminRoutes = require('./routes/adminRoutes');

// API Health Check & Assignment 4 Overview
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Store Management REST API - Route Assignment 4 (PostgreSQL Edition)',
    tasks: {
      'Task 1': 'Database connection pool & tables (Products, Suppliers, Sales)',
      'Task 2': 'CRUD endpoints for Products (/api/products)',
      'Task 3': 'CRUD endpoints for Suppliers (/api/suppliers)',
      'Task 4': 'Sales endpoints (/api/sales)',
      'Task 5': 'Database modifications endpoints (/api/admin/migrations/*)',
      'Task 6': 'Data seed initialization endpoint (/api/admin/seed)',
      'Task 7': 'Update Bread price to 25.00 (PUT /api/products/special/update-bread-price)',
      'Task 8': 'Delete Eggs product (DELETE /api/products/special/delete-eggs)',
      'Task 9': 'Total sold per product report (GET /api/reports/total-sold-per-product)',
      'Task 10': 'Highest stock product (GET /api/products/special/highest-stock)',
      'Task 11': 'Suppliers starting with F (GET /api/suppliers/special/starts-with-f)',
      'Task 12': 'Products never sold (GET /api/products/special/never-sold)',
      'Task 13': 'Detailed sales with SQL JOIN (GET /api/sales/detailed)',
      'Tasks 14-16': 'Permissions for store_manager (POST /api/admin/permissions/store-manager)'
    }
  });
});

app.get('/api/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// Mount API Routes
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: [${req.method}] ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start Server
const startServer = async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Store Management API (Assignment 4) running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`==================================================`);
  });
};

startServer();

module.exports = app;
