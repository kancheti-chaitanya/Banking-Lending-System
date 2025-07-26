require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const loansRouter = require('./routes/loans');
const customersRouter = require('./routes/customers');
const { initCustomerTable } = require('./models/customer');
const { initLoanTable } = require('./models/loan');
const { initPaymentTable } = require('./models/payment');

const app = express();

// Security and logging middleware
app.use(helmet());
app.use(cors({ 
  origin: [
    'http://localhost:3001',
    'https://banking-lending-system-frontend.vercel.app',
    'https://your-vercel-app.vercel.app'
  ],
  credentials: true
}));
app.use(morgan('combined'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());

// Initialize DB tables
initCustomerTable();
initLoanTable();
initPaymentTable();

// API routes
app.use('/api/v1/loans', loansRouter);
app.use('/api/v1/customers', customersRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Bank Lending System API');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
