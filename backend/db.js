 // db.js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test DB connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("DB connection error:", err.message);
  } else {
    console.log("✅ Connected to PostgreSQL!");
    release();
  }
});

module.exports = pool;
