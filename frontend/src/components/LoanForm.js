import React, { useState } from 'react';
import { TextField, Button, Snackbar, Alert, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';

function LoanForm() {
  const [customerId, setCustomerId] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanPeriod, setLoanPeriod] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSnackbar({ open: false, message: '', severity: 'success' });
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/v1/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          loan_amount: loanAmount,
          loan_period_years: loanPeriod,
          interest_rate_yearly: interestRate
        })
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setSnackbar({ open: true, message: 'Loan created successfully!', severity: 'success' });
        setCustomerId('');
        setLoanAmount('');
        setLoanPeriod('');
        setInterestRate('');
      } else {
        setSnackbar({ open: true, message: data.error || 'Error creating loan', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Network error', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Create Loan
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Customer ID"
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Loan Amount"
            type="number"
            value={loanAmount}
            onChange={e => setLoanAmount(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Loan Period (years)"
            type="number"
            value={loanPeriod}
            onChange={e => setLoanPeriod(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Interest Rate (% per year)"
            type="number"
            value={interestRate}
            onChange={e => setInterestRate(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading} startIcon={loading && <CircularProgress size={18} color="inherit" /> }>
            {loading ? 'Creating...' : 'Create Loan'}
          </Button>
        </Box>
        {result && (
          <Box mt={3} p={2} bgcolor="#f5f5f5" borderRadius={2}>
            <Typography variant="subtitle1" fontWeight="bold">Loan Details:</Typography>
            <Typography variant="body2">Loan ID: {result.loan_id}</Typography>
            <Typography variant="body2">Total Amount Payable: {result.total_amount_payable}</Typography>
            <Typography variant="body2">Monthly EMI: {result.monthly_emi}</Typography>
          </Box>
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}

export default LoanForm; 