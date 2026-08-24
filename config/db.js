const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'store_management_db',
  max: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Helper for executing queries
const query = (text, params) => pool.query(text, params);

// Test Database Connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log(`[DB] Successfully connected to PostgreSQL database "${process.env.DB_NAME || 'store_management_db'}"`);
    client.release();
    return true;
  } catch (error) {
    console.error(`[DB Error] Failed to connect to PostgreSQL database: ${error.message}`);
    return false;
  }
};

module.exports = {
  pool,
  query,
  testConnection
};
