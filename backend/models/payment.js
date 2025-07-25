const db = require('../db');

function initPaymentTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS Payments (
      payment_id TEXT PRIMARY KEY,
      loan_id TEXT,
      amount DECIMAL,
      payment_type TEXT,
      payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (loan_id) REFERENCES Loans(loan_id)
    )
  `);
}

module.exports = { initPaymentTable }; 