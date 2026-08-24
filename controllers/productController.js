const { pool } = require('../config/db');

// Task 2a: Create a product
const createProduct = async (req, res) => {
  try {
    const { ProductName, Price, StockQuantity, SupplierID } = req.body;

    if (!ProductName || Price === undefined || StockQuantity === undefined) {
      return res.status(400).json({ success: false, message: 'ProductName, Price, and StockQuantity are required' });
    }

    const query = `
      INSERT INTO "Products" ("ProductName", "Price", "StockQuantity", "SupplierID")
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const { rows } = await pool.query(query, [ProductName, Price, StockQuantity, SupplierID || null]);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: rows[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating product', error: error.message });
  }
};

// Task 2b: Retrieve all products
const getAllProducts = async (req, res) => {
  try {
    const query = `
      SELECT p.*, s."SupplierName" 
      FROM "Products" p
      LEFT JOIN "Suppliers" s ON p."SupplierID" = s."SupplierID"
      ORDER BY p."ProductID" ASC
    `;
    const { rows } = await pool.query(query);
    res.json({ success: true, count: rows.length, products: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving products', error: error.message });
  }
};

// Task 2c: Retrieve a product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT p.*, s."SupplierName" 
      FROM "Products" p
      LEFT JOIN "Suppliers" s ON p."SupplierID" = s."SupplierID"
      WHERE p."ProductID" = $1
    `;
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving product', error: error.message });
  }
};

// Task 2d: Update a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { ProductName, Price, StockQuantity, SupplierID } = req.body;

    const existing = await pool.query('SELECT * FROM "Products" WHERE "ProductID" = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const query = `
      UPDATE "Products"
      SET "ProductName" = COALESCE($1, "ProductName"),
          "Price" = COALESCE($2, "Price"),
          "StockQuantity" = COALESCE($3, "StockQuantity"),
          "SupplierID" = COALESCE($4, "SupplierID")
      WHERE "ProductID" = $5
      RETURNING *
    `;

    const { rows } = await pool.query(query, [ProductName, Price, StockQuantity, SupplierID, id]);
    res.json({ success: true, message: 'Product updated successfully', product: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating product', error: error.message });
  }
};

// Task 2e: Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query('SELECT * FROM "Products" WHERE "ProductID" = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await pool.query('DELETE FROM "Products" WHERE "ProductID" = $1', [id]);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting product', error: error.message });
  }
};

// Task 7: Update the price of 'Bread' to 25.00
const updateBreadPrice = async (req, res) => {
  try {
    const query = `
      UPDATE "Products" 
      SET "Price" = 25.00 
      WHERE "ProductName" = 'Bread' 
      RETURNING *
    `;
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product "Bread" not found' });
    }

    res.json({ success: true, message: 'Price of Bread updated to 25.00', product: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating Bread price', error: error.message });
  }
};

// Task 8: Delete the product 'Eggs'
const deleteEggsProduct = async (req, res) => {
  try {
    const query = `DELETE FROM "Products" WHERE "ProductName" = 'Eggs' RETURNING *`;
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product "Eggs" not found' });
    }

    res.json({ success: true, message: 'Product "Eggs" deleted successfully', deletedProduct: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting Eggs product', error: error.message });
  }
};

// Task 10: Retrieve the product with the highest stock quantity
const getHighestStockProduct = async (req, res) => {
  try {
    const query = `
      SELECT * FROM "Products" 
      ORDER BY "StockQuantity" DESC 
      LIMIT 1
    `;
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No products found' });
    }

    res.json({ success: true, product: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving highest stock product', error: error.message });
  }
};

// Task 12: Retrieve all products that have never been sold
const getNeverSoldProducts = async (req, res) => {
  try {
    const query = `
      SELECT * FROM "Products" 
      WHERE "ProductID" NOT IN (SELECT DISTINCT "ProductID" FROM "Sales")
      ORDER BY "ProductID" ASC
    `;
    const { rows } = await pool.query(query);
    res.json({ success: true, count: rows.length, products: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving products that have never been sold', error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateBreadPrice,
  deleteEggsProduct,
  getHighestStockProduct,
  getNeverSoldProducts
};
