import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  waitForConnections: boolean;
  connectionLimit: number;
  queueLimit: number;
}

const config: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3308', 10),
  database: process.env.DB_NAME || 'event_management',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'P@ssw0rd',
  waitForConnections: true,
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0, // Unlimited queueing
};

const pool = mysql.createPool(config);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database');
    connection.release();
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(-1);
  }
};

testConnection();

// Query helper function
const query = async <T = any>(
  sql: string,
  params?: any[]
): Promise<{ rows: T[]; affectedRows?: number }> => {
  const start = Date.now();
  try {
    const [result] = await pool.execute(sql, params);
    const duration = Date.now() - start;
    if (Array.isArray(result)) {
      // SELECT query
      console.log('Executed query', { sql, duration, rows: result.length });
      return { rows: result as T[] };
    } else {
      // INSERT/UPDATE/DELETE query
      console.log('Executed query', { sql, duration, affectedRows: result.affectedRows });
      return { rows: [], affectedRows: result.affectedRows };
    }
  } catch (err) {
    console.error('Query error:', err);
    throw err;
  }
};

export default pool;
export { query };
