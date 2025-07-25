# Bank Lending System

A simple RESTful API for managing bank loans, payments, and customer accounts, plus utility functions for algorithmic problems.

## Project Structure

- `backend/` — Node.js + Express.js API with SQLite database
- `utils/` — Standalone utility functions (Caesar Cipher, Indian currency, etc.)

## Setup

1. Install dependencies:
   ```sh
   cd backend
   npm install
   ```
2. Start the server:
   ```sh
   node app.js
   ```

## API Endpoints

### Customers
- **Create Customer**
  - `POST /api/v1/customers`
  - Body: `{ "customer_id": "CUST001", "name": "Alice" }`
- **Account Overview**
  - `GET /api/v1/customers/{customer_id}/overview`

### Loans
- **LEND (Create Loan)**
  - `POST /api/v1/loans`
  - Body:
    ```json
    {
      "customer_id": "CUST001",
      "loan_amount": 100000,
      "loan_period_years": 2,
      "interest_rate_yearly": 10
    }
    ```
- **PAYMENT (Record Payment)**
  - `POST /api/v1/loans/{loan_id}/payments`
  - Body:
    ```json
    {
      "amount": 5000,
      "payment_type": "EMI" // or "LUMP_SUM"
    }
    ```
- **LEDGER (Loan Transactions)**
  - `GET /api/v1/loans/{loan_id}/ledger`

## Utility Functions (in `utils/`)

- **Caesar Cipher**: `caesarCipher.js`
- **Indian Currency Format**: `indianCurrencyFormat.js`
- **Combine Lists**: `combineLists.js`
- **Minimize Loss**: `minimizeLoss.js`

Each file exports functions you can import and use in Node.js:
```js
const { caesarEncode, caesarDecode } = require('./utils/caesarCipher');
const { formatIndianCurrency } = require('./utils/indianCurrencyFormat');
const { combineLists } = require('./utils/combineLists');
const { minimizeLoss } = require('./utils/minimizeLoss');
```

## Example Usage

### Create Customer
```sh
curl -X POST http://localhost:3000/api/v1/customers -H "Content-Type: application/json" -d '{"customer_id":"CUST001","name":"Alice"}'
```

### Create Loan
```sh
curl -X POST http://localhost:3000/api/v1/loans -H "Content-Type: application/json" -d '{"customer_id":"CUST001","loan_amount":100000,"loan_period_years":2,"interest_rate_yearly":10}'
```

### Record Payment
```sh
curl -X POST http://localhost:3000/api/v1/loans/{loan_id}/payments -H "Content-Type: application/json" -d '{"amount":5000,"payment_type":"EMI"}'
```

### Get Loan Ledger
```sh
curl http://localhost:3000/api/v1/loans/{loan_id}/ledger
```

### Get Account Overview
```sh
curl http://localhost:3000/api/v1/customers/CUST001/overview
```

---

**This project is for educational/demo purposes.** 