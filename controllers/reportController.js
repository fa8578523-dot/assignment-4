const { pool } = require('../config/db');

// Task 9: Retrieve the total quantity sold for each product using SQL aggregate functions
const getTotalSoldPerProduct = async (req, res) => {
  try {
    const query = `
      SELECT 
        p."ProductID",
        p."ProductName",
        COALESCE(SUM(s."QuantitySold"), 0) AS "TotalQuantitySold"
      FROM "Products" p
      LEFT JOIN "Sales" s ON p."ProductID" = s."ProductID"
      GROUP BY p."ProductID", p."ProductName"
      ORDER BY p."ProductID" ASC
    `;

    const { rows } = await pool.query(query);

    res.json({
      success: true,
      count: rows.length,
      report: rows
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating total sold report', error: error.message });
  }
};

module.exports = {
  getTotalSoldPerProduct
};
