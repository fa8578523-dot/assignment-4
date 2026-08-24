const { pool } = require('../config/db');

// Task 4a: Record a sale
const recordSale = async (req, res) => {
  try {
    const { ProductID, QuantitySold, SaleDate } = req.body;

    if (!ProductID || !QuantitySold) {
      return res.status(400).json({ success: false, message: 'ProductID and QuantitySold are required' });
    }

    // Check product exists
    const productCheck = await pool.query('SELECT * FROM "Products" WHERE "ProductID" = $1', [ProductID]);
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Product ID ${ProductID} not found` });
    }

    const query = `
      INSERT INTO "Sales" ("ProductID", "QuantitySold", "SaleDate")
      VALUES ($1, $2, COALESCE($3, CURRENT_DATE))
      RETURNING *
    `;

    const { rows } = await pool.query(query, [ProductID, QuantitySold, SaleDate || null]);

    res.status(201).json({
      success: true,
      message: 'Sale recorded successfully',
      sale: rows[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error recording sale', error: error.message });
  }
};

// Task 4b: Retrieve all sales
const getAllSales = async (req, res) => {
  try {
    const query = 'SELECT * FROM "Sales" ORDER BY "SaleID" DESC';
    const { rows } = await pool.query(query);
    res.json({ success: true, count: rows.length, sales: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving sales', error: error.message });
  }
};

// Task 4c: Retrieve sales for a specific product
const getSalesForProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const query = 'SELECT * FROM "Sales" WHERE "ProductID" = $1 ORDER BY "SaleID" DESC';
    const { rows } = await pool.query(query, [productId]);
    res.json({ success: true, count: rows.length, sales: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving sales for product', error: error.message });
  }
};

// Task 13: Retrieve all sales including ProductName, QuantitySold, SaleDate using SQL JOIN operations
const getDetailedSales = async (req, res) => {
  try {
    const query = `
      SELECT 
        p."ProductName", 
        s."QuantitySold", 
        s."SaleDate"
      FROM "Sales" s
      JOIN "Products" p ON s."ProductID" = p."ProductID"
      ORDER BY s."SaleID" DESC
    `;
    const { rows } = await pool.query(query);
    res.json({ success: true, count: rows.length, sales: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving detailed sales report', error: error.message });
  }
};

module.exports = {
  recordSale,
  getAllSales,
  getSalesForProduct,
  getDetailedSales
};
