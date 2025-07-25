import React, { useState } from 'react';
import { TextField, Button, Snackbar, Alert, Card, CardContent, Typography, Box } from '@mui/material';

function CustomerForm() {
  const [customerId, setCustomerId] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSnackbar({ open: false, message: '', severity: 'success' });
    try {
      const res = await fetch('http://localhost:3000/api/v1/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: customerId, name })
      });
      const data = await res.json();
      if (res.ok) {
        setSnackbar({ open: true, message: 'Customer created successfully!', severity: 'success' });
        setCustomerId('');
        setName('');
      } else {
        setSnackbar({ open: true, message: data.error || 'Error creating customer', severity: 'error' });
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
          Create Customer
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
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </Box>
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

export default CustomerForm; 