const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// POST /api/v1/loans - LEND
router.post(
  '/',
  [
    body('customer_id').isString().notEmpty(),
    body('loan_amount').isFloat({ gt: 0 }),
    body('loan_period_years').isFloat({ gt: 0 }),
    body('interest_rate_yearly').isFloat({ min: 0 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { customer_id, loan_amount, loan_period_years, interest_rate_yearly } = req.body;
    const P = parseFloat(loan_amount);
    const N = parseFloat(loan_period_years);
    const R = parseFloat(interest_rate_yearly);
    // Simple Interest
    const I = P * N * (R / 100);
    const A = P + I;
    const monthly_emi = parseFloat((A / (N * 12)).toFixed(2));
    const loan_id = uuidv4();
    db.run(
      `INSERT INTO Loans (loan_id, customer_id, principal_amount, total_amount, interest_rate, loan_period_years, monthly_emi, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
      [loan_id, customer_id, P, A, R, N, monthly_emi],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Database error', details: err.message });
        }
        res.status(201).json({
          loan_id,
          customer_id,
          total_amount_payable: A,
          monthly_emi
        });
      }
    );
  }
);

// POST /api/v1/loans/:loan_id/payments - PAYMENT
router.post(
  '/:loan_id/payments',
  [
    param('loan_id').isString().notEmpty(),
    body('amount').isFloat({ gt: 0 }),
    body('payment_type').isIn(['EMI', 'LUMP_SUM'])
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { loan_id } = req.params;
    const { amount, payment_type } = req.body;
    const amt = parseFloat(amount);
    db.get('SELECT * FROM Loans WHERE loan_id = ?', [loan_id], (err, loan) => {
      if (err || !loan) {
        return res.status(404).json({ error: 'Loan not found.' });
      }
      // Insert payment
      const payment_id = uuidv4();
      db.run(
        `INSERT INTO Payments (payment_id, loan_id, amount, payment_type) VALUES (?, ?, ?, ?)`,
        [payment_id, loan_id, amt, payment_type],
        function (err2) {
          if (err2) {
            return res.status(500).json({ error: 'Database error', details: err2.message });
          }
          // Calculate total paid
          db.get(
            `SELECT SUM(amount) as total_paid FROM Payments WHERE loan_id = ?`,
            [loan_id],
            (err3, row) => {
              if (err3) {
                return res.status(500).json({ error: 'Database error', details: err3.message });
              }
              const total_paid = row.total_paid || 0;
              let remaining_balance = parseFloat((loan.total_amount - total_paid).toFixed(2));
              let emis_left = Math.ceil(remaining_balance / loan.monthly_emi);
              if (remaining_balance <= 0) {
                remaining_balance = 0;
                emis_left = 0;
                db.run(`UPDATE Loans SET status = 'PAID_OFF' WHERE loan_id = ?`, [loan_id]);
              }
              res.status(200).json({
                payment_id,
                loan_id,
                message: 'Payment recorded successfully.',
                remaining_balance,
                emis_left
              });
            }
          );
        }
      );
    });
  }
);

// GET /api/v1/loans/:loan_id/ledger - LEDGER
router.get('/:loan_id/ledger', (req, res) => {
  const { loan_id } = req.params;
  db.get('SELECT * FROM Loans WHERE loan_id = ?', [loan_id], (err, loan) => {
    if (err || !loan) {
      return res.status(404).json({ error: 'Loan not found.' });
    }
    db.all('SELECT * FROM Payments WHERE loan_id = ? ORDER BY payment_date ASC', [loan_id], (err2, payments) => {
      if (err2) {
        return res.status(500).json({ error: 'Database error', details: err2.message });
      }
      const amount_paid = payments.reduce((sum, p) => sum + p.amount, 0);
      let balance_amount = parseFloat((loan.total_amount - amount_paid).toFixed(2));
      let emis_left = Math.ceil(balance_amount / loan.monthly_emi);
      if (balance_amount <= 0) {
        balance_amount = 0;
        emis_left = 0;
      }
      res.status(200).json({
        loan_id: loan.loan_id,
        customer_id: loan.customer_id,
        principal: loan.principal_amount,
        total_amount: loan.total_amount,
        monthly_emi: loan.monthly_emi,
        amount_paid,
        balance_amount,
        emis_left,
        transactions: payments.map(p => ({
          transaction_id: p.payment_id,
          date: p.payment_date,
          amount: p.amount,
          type: p.payment_type
        }))
      });
    });
  });
});

module.exports = router; 