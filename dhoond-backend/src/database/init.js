const fs = require('fs');
const path = require('path');
const db = require('../config/db');

/**
 * Initialize database — run schema.sql to create all tables
 * Uses IF NOT EXISTS so it's safe to run multiple times
 */
const initDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await db.query(schema);
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    // Don't crash the server — tables may already exist
  }
};

// If run directly: node src/database/init.js
if (require.main === module) {
  // unnecessary
  require('dotenv').config({ path: path.join(__dirname, '../../.env') });
  initDatabase().then(() => process.exit(0));
}

module.exports = initDatabase;
