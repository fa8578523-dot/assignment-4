const { pool } = require('../config/db');

// Task 3a: Create a supplier
const createSupplier = async (req, res) => {
  try {
    const { SupplierName, ContactNumber } = req.body;

    if (!SupplierName) {
      return res.status(400).json({ success: false, message: 'SupplierName is required' });
    }

    const query = `
      INSERT INTO "Suppliers" ("SupplierName", "ContactNumber")
      VALUES ($1, $2)
      RETURNING *
    `;

    const { rows } = await pool.query(query, [SupplierName, ContactNumber || null]);

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      supplier: rows[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating supplier', error: error.message });
  }
};

// Task 3b: Retrieve all suppliers
const getAllSuppliers = async (req, res) => {
  try {
    const query = 'SELECT * FROM "Suppliers" ORDER BY "SupplierID" ASC';
    const { rows } = await pool.query(query);
    res.json({ success: true, count: rows.length, suppliers: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving suppliers', error: error.message });
  }
};

// Task 3c: Update supplier information
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { SupplierName, ContactNumber } = req.body;

    const existing = await pool.query('SELECT * FROM "Suppliers" WHERE "SupplierID" = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    const query = `
      UPDATE "Suppliers"
      SET "SupplierName" = COALESCE($1, "SupplierName"),
          "ContactNumber" = COALESCE($2, "ContactNumber")
      WHERE "SupplierID" = $3
      RETURNING *
    `;

    const { rows } = await pool.query(query, [SupplierName, ContactNumber, id]);
    res.json({ success: true, message: 'Supplier updated successfully', supplier: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating supplier', error: error.message });
  }
};

// Task 3d: Delete a supplier
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query('SELECT * FROM "Suppliers" WHERE "SupplierID" = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    await pool.query('DELETE FROM "Suppliers" WHERE "SupplierID" = $1', [id]);
    res.json({ success: true, message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting supplier', error: error.message });
  }
};

// Task 11: Retrieve suppliers whose names start with 'F'
const getSuppliersStartsWithF = async (req, res) => {
  try {
    const query = `
      SELECT * FROM "Suppliers" 
      WHERE "SupplierName" ILIKE 'F%' 
      ORDER BY "SupplierID" ASC
    `;
    const { rows } = await pool.query(query);
    res.json({ success: true, count: rows.length, suppliers: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving suppliers starting with F', error: error.message });
  }
};

module.exports = {
  createSupplier,
  getAllSuppliers,
  updateSupplier,
  deleteSupplier,
  getSuppliersStartsWithF
};
