const db = require('../db');

function initLoanTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS Loans (
      loan_id TEXT PRIMARY KEY,
      customer_id TEXT,
      principal_amount DECIMAL,
      total_amount DECIMAL,
      interest_rate DECIMAL,
      loan_period_years INTEGER,
      monthly_emi DECIMAL,
      status TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
    )
  `);
}

module.exports = { initLoanTable }; 