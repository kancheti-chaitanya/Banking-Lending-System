import React, { useState } from 'react';
import CustomerForm from './components/CustomerForm';
import LoanForm from './components/LoanForm';
import PaymentForm from './components/PaymentForm';
import LedgerView from './components/LedgerView';
import AccountOverview from './components/AccountOverview';
import { AppBar, Toolbar, Tabs, Tab, Container, Typography, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057' },
  },
});

const pages = [
  { key: 'customer', label: 'Create Customer' },
  { key: 'loan', label: 'Create Loan' },
  { key: 'payment', label: 'Make Payment' },
  { key: 'ledger', label: 'View Ledger' },
  { key: 'overview', label: 'Account Overview' },
];

function App() {
  const [page, setPage] = useState('customer');

  const renderPage = () => {
    switch (page) {
      case 'customer': return <CustomerForm />;
      case 'loan': return <LoanForm />;
      case 'payment': return <PaymentForm />;
      case 'ledger': return <LedgerView />;
      case 'overview': return <AccountOverview />;
      default: return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Bank Lending System
          </Typography>
          <Tabs
            value={pages.findIndex(p => p.key === page)}
            onChange={(_, idx) => setPage(pages[idx].key)}
            textColor="inherit"
            indicatorColor="secondary"
          >
            {pages.map(p => <Tab key={p.key} label={p.label} />)}
          </Tabs>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            <Box boxShadow={3} p={3} borderRadius={2} bgcolor="#fff">
              {renderPage()}
            </Box>
          </motion.div>
        </AnimatePresence>
      </Container>
    </ThemeProvider>
  );
}

export default App;
