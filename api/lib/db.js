import mysql from 'mysql2/promise';

let pool = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'mysql-boushera-bai.alwaysdata.net',
      user: process.env.DB_USERNAME || 'boushera-bai',
      password: process.env.DB_PASSWORD || 'bouchra1975@@',
      database: process.env.DB_DATABASE || 'boushera-bai_vitabi',
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      enableTimeoutCleanup: true,
      timeout: 30000,
    });
  }
  return pool;
}

export async function query(sql, values = []) {
  try {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
      const [results] = await connection.execute(sql, values);
      return results;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('DB Query Error:', error);
    throw error;
  }
}

export async function getConnection() {
  return getPool().getConnection();
}
