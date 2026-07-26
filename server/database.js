import mariadb from 'mariadb';

const pool = mariadb.createPool({
  host: 'mysqlsvr88.world4you.com',
  user: 'sql9872333',
  password: 'w40+70n4',
  database: '8678591db1',
  connectionLimit: 5,
  connectTimeout: 10000
});

export default pool;