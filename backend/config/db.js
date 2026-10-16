import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure env variables are loaded from backend/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'u733794648_prephq',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// Create the connection pool
export const pool = mysql.createPool(dbConfig);

// Helper function to run parameterized queries with clean error handling
export const query = async (sql, params = []) => {
  try {
    const [rows, fields] = await pool.query(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
    });
    throw error;
  }
};

// Verify the connection pool
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`[MySQL] Successfully connected to database "${dbConfig.database}" at ${dbConfig.host}:${dbConfig.port}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('[MySQL] Database connection failed:', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database,
      message: error.message,
      code: error.code,
    });
    return false;
  }
};

export default { pool, query, testConnection };
