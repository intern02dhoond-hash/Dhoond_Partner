const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,    // fail fast if DB is unreachable
  idleTimeoutMillis: 30000,
  statement_timeout: 10000,         // kill queries taking >10s
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
