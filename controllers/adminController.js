const { pool } = require('../config/db');

// Task 5a: Add a Category column to the Products table
const addCategoryColumn = async (req, res) => {
  try {
    await pool.query('ALTER TABLE "Products" ADD COLUMN IF NOT EXISTS "Category" VARCHAR(100) NULL');
    res.json({ success: true, message: 'Column "Category" added to "Products" table successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding Category column', error: error.message });
  }
};

// Task 5b: Remove the Category column from the Products table
const removeCategoryColumn = async (req, res) => {
  try {
    await pool.query('ALTER TABLE "Products" DROP COLUMN IF EXISTS "Category"');
    res.json({ success: true, message: 'Column "Category" removed from "Products" table successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing Category column', error: error.message });
  }
};

// Task 5c: Change ContactNumber to VARCHAR(15)
const modifyContactNumber = async (req, res) => {
  try {
    await pool.query('ALTER TABLE "Suppliers" ALTER COLUMN "ContactNumber" TYPE VARCHAR(15)');
    res.json({ success: true, message: 'Column "ContactNumber" changed to VARCHAR(15) successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error modifying ContactNumber column type', error: error.message });
  }
};

// Task 5d: Add a NOT NULL constraint to ProductName
const addNotNullProductName = async (req, res) => {
  try {
    await pool.query('ALTER TABLE "Products" ALTER COLUMN "ProductName" SET NOT NULL');
    res.json({ success: true, message: 'NOT NULL constraint added to "ProductName" successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error setting NOT NULL constraint', error: error.message });
  }
};

// Task 6: API endpoint or initialization script to insert data
const seedData = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 6a. Add supplier 'FreshFoods' (01001234567)
    const supplierRes = await client.query(`
      INSERT INTO "Suppliers" ("SupplierName", "ContactNumber")
      VALUES ('FreshFoods', '01001234567')
      ON CONFLICT ("SupplierID") DO UPDATE SET "SupplierName" = EXCLUDED."SupplierName"
      RETURNING "SupplierID"
    `);

    let supplierId = supplierRes.rows.length > 0 ? supplierRes.rows[0].SupplierID : 1;

    // 6b. Insert products provided by 'FreshFoods'
    // i. 'Milk' (price: 15.00, stock: 50)
    const milkRes = await client.query(`
      INSERT INTO "Products" ("ProductName", "Price", "StockQuantity", "SupplierID")
      VALUES ('Milk', 15.00, 50, $1)
      RETURNING "ProductID"
    `, [supplierId]);

    const milkId = milkRes.rows[0].ProductID;

    // ii. 'Bread' (price: 10.00, stock: 30)
    await client.query(`
      INSERT INTO "Products" ("ProductName", "Price", "StockQuantity", "SupplierID")
      VALUES ('Bread', 10.00, 30, $1)
    `, [supplierId]);

    // iii. 'Eggs' (price: 20.00, stock: 40)
    await client.query(`
      INSERT INTO "Products" ("ProductName", "Price", "StockQuantity", "SupplierID")
      VALUES ('Eggs', 20.00, 40, $1)
    `, [supplierId]);

    // 6c. Add record for sale of 2 units of 'Milk' made on '2025-05-20'
    await client.query(`
      INSERT INTO "Sales" ("ProductID", "QuantitySold", "SaleDate")
      VALUES ($1, 2, '2025-05-20')
    `, [milkId]);

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Initialization data seeded successfully (FreshFoods, Milk, Bread, Eggs, Sale of 2 Milk on 2025-05-20)'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, message: 'Error executing seed initialization', error: error.message });
  } finally {
    client.release();
  }
};

// Tasks 14, 15, 16: Setup store_manager user and permissions
const setupStoreManagerPermissions = async (req, res) => {
  try {
    // Task 14: Create user store_manager and grant SELECT, INSERT, UPDATE
    await pool.query(`
      DO $$ BEGIN
          IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'store_manager') THEN
              CREATE USER store_manager WITH PASSWORD 'StoreManagerPass123!';
          END IF;
      END $$;
      GRANT CONNECT ON DATABASE store_management_db TO store_manager;
      GRANT USAGE ON SCHEMA public TO store_manager;
      GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO store_manager;
    `);

    // Task 15: Revoke UPDATE permission from store_manager
    await pool.query('REVOKE UPDATE ON ALL TABLES IN SCHEMA public FROM store_manager;');

    // Task 16: Grant DELETE permission to store_manager only on the Sales table
    await pool.query('GRANT DELETE ON "Sales" TO store_manager;');

    res.json({
      success: true,
      message: 'User store_manager permissions configured successfully (Tasks 14, 15, 16)'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error setting up user permissions', error: error.message });
  }
};

module.exports = {
  addCategoryColumn,
  removeCategoryColumn,
  modifyContactNumber,
  addNotNullProductName,
  seedData,
  setupStoreManagerPermissions
};
