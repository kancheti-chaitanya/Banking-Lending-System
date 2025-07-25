import React, { useState } from 'react';
import { TextField, Button, Snackbar, Alert, Card, CardContent, Typography, Box, CircularProgress, List, ListItem, Divider } from '@mui/material';

function LedgerView() {
  const [loanId, setLoanId] = useState('');
  const [ledger, setLedger] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSnackbar({ open: false, message: '', severity: 'success' });
    setLedger(null);
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/v1/loans/${loanId}/ledger`);
      const data = await res.json();
      if (res.ok) {
        setLedger(data);
      } else {
        setSnackbar({ open: true, message: data.error || 'Error fetching ledger', severity: 'error' });
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
          Loan Ledger
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Loan ID"
            value={loanId}
            onChange={e => setLoanId(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading} startIcon={loading && <CircularProgress size={18} color="inherit" /> }>
            {loading ? 'Loading...' : 'View Ledger'}
          </Button>
        </Box>
        {ledger && (
          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight="bold">Loan Info:</Typography>
            <Typography variant="body2">Customer ID: {ledger.customer_id}</Typography>
            <Typography variant="body2">Principal: {ledger.principal}</Typography>
            <Typography variant="body2">Total Amount: {ledger.total_amount}</Typography>
            <Typography variant="body2">Monthly EMI: {ledger.monthly_emi}</Typography>
            <Typography variant="body2">Amount Paid: {ledger.amount_paid}</Typography>
            <Typography variant="body2">Balance Amount: {ledger.balance_amount}</Typography>
            <Typography variant="body2">EMIs Left: {ledger.emis_left}</Typography>
            <Typography variant="subtitle1" fontWeight="bold" mt={2}>Transactions:</Typography>
            <List>
              {ledger.transactions.map((txn, idx) => (
                <React.Fragment key={txn.transaction_id}>
                  <ListItem>
                    <Box>
                      <Typography variant="body2">{txn.date}: <b>{txn.type}</b> - {txn.amount}</Typography>
                    </Box>
                  </ListItem>
                  {idx < ledger.transactions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
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

export default LedgerView; 