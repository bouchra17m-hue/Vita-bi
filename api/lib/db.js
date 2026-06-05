import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql-boushera-bai.alwaysdata.net',
  user: process.env.DB_USERNAME || 'boushera-bai',
  password: process.env.DB_PASSWORD || 'bouchra1975@@',
  database: process.env.DB_DATABASE || 'boushera-bai_vitabi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query(sql, values) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, values);
    return results;
  } finally {
    connection.release();
  }
}

export async function getConnection() {
  return pool.getConnection();
}

export default pool;
