import React, { useState } from 'react';
import { TextField, Button, Snackbar, Alert, Card, CardContent, Typography, Box, CircularProgress, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

function PaymentForm() {
  const [loanId, setLoanId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState('EMI');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSnackbar({ open: false, message: '', severity: 'success' });
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/v1/loans/${loanId}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, payment_type: paymentType })
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setSnackbar({ open: true, message: 'Payment recorded successfully!', severity: 'success' });
        setLoanId('');
        setAmount('');
        setPaymentType('EMI');
      } else {
        setSnackbar({ open: true, message: data.error || 'Error recording payment', severity: 'error' });
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
          Make Payment
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Loan ID"
            value={loanId}
            onChange={e => setLoanId(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="payment-type-label">Payment Type</InputLabel>
            <Select
              labelId="payment-type-label"
              value={paymentType}
              label="Payment Type"
              onChange={e => setPaymentType(e.target.value)}
            >
              <MenuItem value="EMI">EMI</MenuItem>
              <MenuItem value="LUMP_SUM">LUMP_SUM</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary" disabled={loading} startIcon={loading && <CircularProgress size={18} color="inherit" /> }>
            {loading ? 'Paying...' : 'Pay'}
          </Button>
        </Box>
        {result && (
          <Box mt={3} p={2} bgcolor="#f5f5f5" borderRadius={2}>
            <Typography variant="subtitle1" fontWeight="bold">Payment Info:</Typography>
            <Typography variant="body2">Payment ID: {result.payment_id}</Typography>
            <Typography variant="body2">Remaining Balance: {result.remaining_balance}</Typography>
            <Typography variant="body2">EMIs Left: {result.emis_left}</Typography>
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

export default PaymentForm; 