import React, { useState } from 'react';
import { TextField, Button, Snackbar, Alert, Card, CardContent, Typography, Box, CircularProgress, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

function AccountOverview() {
  const [customerId, setCustomerId] = useState('');
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSnackbar({ open: false, message: '', severity: 'success' });
    setOverview(null);
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/v1/customers/${customerId}/overview`);
      const data = await res.json();
      if (res.ok) {
        setOverview(data);
      } else {
        setSnackbar({ open: true, message: data.error || 'Error fetching overview', severity: 'error' });
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
          Account Overview
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Customer ID"
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading} startIcon={loading && <CircularProgress size={18} color="inherit" /> }>
            {loading ? 'Loading...' : 'View Overview'}
          </Button>
        </Box>
        {overview && (
          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight="bold">Customer ID: {overview.customer_id}</Typography>
            <Typography variant="body2">Total Loans: {overview.total_loans}</Typography>
            <Table sx={{ mt: 2 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Loan ID</TableCell>
                  <TableCell>Principal</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Total Interest</TableCell>
                  <TableCell>EMI Amount</TableCell>
                  <TableCell>Amount Paid</TableCell>
                  <TableCell>EMIs Left</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {overview.loans.map(loan => (
                  <TableRow key={loan.loan_id}>
                    <TableCell>{loan.loan_id}</TableCell>
                    <TableCell>{loan.principal}</TableCell>
                    <TableCell>{loan.total_amount}</TableCell>
                    <TableCell>{loan.total_interest}</TableCell>
                    <TableCell>{loan.emi_amount}</TableCell>
                    <TableCell>{loan.amount_paid}</TableCell>
                    <TableCell>{loan.emis_left}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

export default AccountOverview; 