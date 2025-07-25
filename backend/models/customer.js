const db = require('../db');

function initCustomerTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS Customers (
      customer_id TEXT PRIMARY KEY,
      name TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

module.exports = { initCustomerTable }; 