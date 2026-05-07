require('dotenv').config();
const app = require('./app');
const db = require('./config/db');
const initDatabase = require('./database/init'); // 👈 add this

const PORT = process.env.PORT || 5001;

(async () => {
  try {
    await initDatabase(); // 👈 run schema setup once

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize app:', err);
    process.exit(1); // crash if DB setup fails badly
  }
})();