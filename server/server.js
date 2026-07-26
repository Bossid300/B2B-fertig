import mariadb from 'mariadb';

import pool from './database.js';

async function testConnection() {
  let conn;

  try {
    conn = await pool.getConnection();

    const rows = await conn.query(
      'SELECT * FROM profiles'
    );

    console.log('DB VERBUNDEN ✅');
    console.log(rows);

  } catch (err) {
    console.error('DB FEHLER ❌', err);

  } finally {
    if (conn) conn.release();
  }
}

testConnection();