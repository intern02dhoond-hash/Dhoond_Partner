const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('PostgreSQL Connection Failed:', err.message);
    return;
  }
  release();
  console.log(' PostgreSQL Connected Successfully');
});

module.exports = pool;
