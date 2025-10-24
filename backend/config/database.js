'use strict';

const process = require('process');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || '10.11.148.104',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'event_management',
  user: process.env.DB_USER || 'btechb22567',
  password: process.env.DB_PASSWORD || 'loujopro',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Query helper function
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error('Query error:', err);
    throw err;
  }
};

module.exports = {
  pool,
  query
};
