const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../db');

// POST /api/v1/customers - Create a new customer
router.post(
  '/',
  [
    body('customer_id').isString().notEmpty(),
    body('name').isString().notEmpty()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { customer_id, name } = req.body;
    db.run(
      `INSERT INTO Customers (customer_id, name) VALUES (?, ?)`,
      [customer_id, name],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Database error', details: err.message });
        }
        res.status(201).json({ message: 'Customer created successfully.', customer_id, name });
      }
    );
  }
);

// GET /api/v1/customers/:customer_id/overview - ACCOUNT OVERVIEW
router.get(
  '/:customer_id/overview',
  [param('customer_id').isString().notEmpty()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { customer_id } = req.params;
    db.all('SELECT * FROM Loans WHERE customer_id = ?', [customer_id], (err, loans) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      if (!loans || loans.length === 0) {
        return res.status(404).json({ error: 'No loans found for this customer.' });
      }
      // For each loan, get payments and calculate summary
      let completed = 0;
      const result = [];
      loans.forEach((loan, idx) => {
        db.get('SELECT SUM(amount) as total_paid FROM Payments WHERE loan_id = ?', [loan.loan_id], (err2, row) => {
          const total_paid = (row && row.total_paid) ? row.total_paid : 0;
          let emis_left = Math.ceil((loan.total_amount - total_paid) / loan.monthly_emi);
          if ((loan.total_amount - total_paid) <= 0) emis_left = 0;
          result[idx] = {
            loan_id: loan.loan_id,
            principal: loan.principal_amount,
            total_amount: loan.total_amount,
            total_interest: loan.total_amount - loan.principal_amount,
            emi_amount: loan.monthly_emi,
            amount_paid: total_paid,
            emis_left
          };
          completed++;
          if (completed === loans.length) {
            res.status(200).json({
              customer_id,
              total_loans: loans.length,
              loans: result
            });
          }
        });
      });
    });
  }
);

module.exports = router; 