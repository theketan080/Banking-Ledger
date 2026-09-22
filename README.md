# 🏦 Banking Transaction & Ledger System

A production-style **backend banking system** built with **Node.js, Express.js, MongoDB, and Mongoose**, designed to handle user authentication, bank accounts, transactions, and a reliable transaction ledger.

The project focuses on implementing real-world backend concepts such as **JWT authentication, password hashing, MongoDB transactions, ACID principles, database indexing, middleware, and ledger-based transaction tracking**.

## 🚀 Live Demo

**Backend API:**
https://banking-ledger-5a4t.onrender.com

## 📂 Source Code

**GitHub:**
https://github.com/theketan080/Banking-Ledger

---

## ✨ Features

* 🔐 **User Authentication**

  * User registration
  * User login
  * JWT-based authentication
  * Protected routes
  * Secure password hashing with bcrypt

* 🏦 **Bank Account Management**

  * Create and manage accounts
  * Account ownership using user references
  * Account status management

* 💸 **Banking Transactions**

  * Deposit money
  * Withdraw money
  * Transfer money between accounts
  * Transaction validation

* 📒 **Ledger System**

  * Records financial transactions
  * Tracks debit and credit entries
  * Maintains transaction history

* 🔒 **ACID Transactions**

  * Uses MongoDB sessions and transactions
  * Helps maintain consistency during financial operations
  * Prevents partial transaction updates

* ⚡ **Database Optimization**

  * MongoDB indexes
  * Compound indexes
  * Efficient querying using Mongoose

* 🛡️ **Backend Security**

  * JWT authentication
  * Password hashing
  * Authentication middleware
  * Environment variables for sensitive credentials

* 🧪 **API Testing**

  * APIs tested using Postman

---

## 🛠️ Tech Stack

### Backend

* **Node.js**
* **Express.js**
* **JavaScript**

### Database

* **MongoDB**
* **MongoDB Atlas**
* **Mongoose**

### Authentication & Security

* **JWT (JSON Web Token)**
* **bcrypt**
* **Cookie-based authentication**

### Development Tools

* **Git**
* **GitHub**
* **Postman**
* **VS Code**

### Deployment

* **Render**

---

## 🏗️ Project Architecture

The application follows a modular backend architecture:

```text
Client
  │
  ▼
Routes
  │
  ▼
Middleware
  │
  ▼
Controllers
  │
  ▼
Models
  │
  ▼
MongoDB
```

### Request Flow

```text
Client Request
      ↓
Express Router
      ↓
Authentication Middleware
      ↓
Controller
      ↓
Business Logic
      ↓
Mongoose Model
      ↓
MongoDB
      ↓
Response
```

---

## 📁 Project Structure

```text
Banking-Ledger/
│
├── controllers/
│   ├── user.controller.js
│   ├── account.controller.js
│   └── transaction.controller.js
│
├── middleware/
│   └── auth.middleware.js
│
├── models/
│   ├── user.model.js
│   ├── account.model.js
│   └── ledger.model.js
│
├── routes/
│   ├── user.routes.js
│   ├── account.routes.js
│   └── transaction.routes.js
│
├── db/
│   └── db.js
│
├── app.js
├── server.js
├── package.json
├── package-lock.json
├── .env
└── .gitignore
```

> File and folder names may vary slightly depending on the final project structure.

---

# 🔐 Authentication

The application uses **JWT-based authentication**.

### Registration

A user can create an account by providing their required details.

```text
User Details
     ↓
Validate Input
     ↓
Hash Password
     ↓
Create User
     ↓
Store in MongoDB
```

### Login

```text
Login Request
     ↓
Find User
     ↓
Compare Password
     ↓
Generate JWT
     ↓
Send Authentication Cookie
```

### Protected Routes

Protected APIs use authentication middleware to verify the JWT before allowing access.

```text
Request
  ↓
JWT Token
  ↓
Authentication Middleware
  ↓
Verify Token
  ↓
Authenticated User
  ↓
Controller
```

---

# 💳 Banking Transaction System

The system supports financial operations such as:

### Deposit

```text
Account Balance
       +
Deposit Amount
       ↓
Updated Balance
       ↓
Ledger Entry
```

### Withdrawal

```text
Account Balance
       -
Withdrawal Amount
       ↓
Updated Balance
       ↓
Ledger Entry
```

### Transfer

A transfer involves two accounts:

```text
Sender Account
      ↓
Debit
      ↓
Receiver Account
      ↓
Credit
      ↓
Ledger Entries
```

The transaction is designed to maintain consistency between account balances and ledger records.

---

# 🔄 ACID Transactions

Financial operations require consistency.

The project uses **MongoDB transactions** to ensure that related database operations are handled atomically.

For example, during a transfer:

```text
Start Transaction
       ↓
Debit Sender
       ↓
Credit Receiver
       ↓
Create Ledger Entries
       ↓
Commit Transaction
```

If something fails:

```text
Error
  ↓
Rollback
  ↓
No Partial Transaction
```

This helps maintain the integrity of financial data.

---

# 📒 Ledger System

The ledger maintains a record of financial activity.

A transaction can contain information such as:

```text
Transaction
├── Account
├── Amount
├── Type
├── Status
├── Reference
├── Created At
└── Other transaction metadata
```

The ledger provides a historical record that can be used to track account activity.

---

# ⚡ MongoDB Indexing

Indexes are used to improve query performance.

For example, a compound index can be created for frequently queried fields:

```javascript
accountSchema.index({
    user: 1,
    status: 1
});
```

This allows MongoDB to efficiently query accounts based on combinations of fields such as:

```text
user + status
```

Indexes are particularly useful when the application grows and the database contains a large number of documents.

---

# 🌐 API Structure

The backend exposes REST APIs for different resources.

### User APIs

```text
POST   /api/users/register
POST   /api/users/login
POST   /api/users/logout
```

### Account APIs

```text
POST   /api/accounts
GET    /api/accounts
GET    /api/accounts/:id
```

### Transaction APIs

```text
POST   /api/transactions/deposit
POST   /api/transactions/withdraw
POST   /api/transactions/transfer
```

> Exact endpoint names may differ depending on the final implementation.

---

# 🧪 API Testing

All APIs were tested using **Postman**.

The testing process included:

* Registration
* Login
* Authentication
* Account creation
* Deposits
* Withdrawals
* Transfers
* Logout
* Error handling
* Protected routes

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone https://github.com/theketan080/Banking-Ledger.git
```

## 2. Navigate into the project

```bash
cd Banking-Ledger
```

## 3. Install dependencies

```bash
npm install
```

## 4. Create `.env`

Create a `.env` file in the root directory:

```env
PORT=3000

MONGODB_URL=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
```

Replace the values with your own credentials.

## 5. Start the server

For development:

```bash
npm run dev
```

Or:

```bash
npm start
```

The server will run on:

```text
http://localhost:3000
```

---

# 🔒 Environment Variables

Never commit sensitive credentials to GitHub.

Example:

```env
PORT=3000
MONGODB_URL=********
JWT_SECRET=********
```

The `.env` file should be included in `.gitignore`:

```gitignore
node_modules/
.env
```

---

# 📊 Backend Concepts Implemented

This project helped implement several important backend concepts:

* REST API development
* Express.js routing
* Middleware
* JWT authentication
* Password hashing
* Cookies
* MongoDB
* MongoDB Atlas
* Mongoose
* Schema design
* References between collections
* MongoDB indexes
* Compound indexes
* MongoDB sessions
* ACID transactions
* Database consistency
* Ledger architecture
* Error handling
* Environment variables
* API testing with Postman
* Git & GitHub
* Backend deployment

---

# 🚀 Deployment

The backend is deployed using **Render**.

### Live API

https://banking-ledger-5a4t.onrender.com

### Repository

https://github.com/theketan080/Banking-Ledger

---

# 🔮 Future Improvements

Possible improvements include:

* Add refresh-token authentication
* Add role-based authorization
* Add transaction pagination
* Add advanced transaction filtering
* Add rate limiting
* Add request validation using Joi/Zod
* Add centralized error handling
* Add automated unit and integration tests
* Add API documentation using Swagger
* Add Docker support
* Add monitoring and logging
* Add email notifications for transactions
* Add account statements
* Add transaction reconciliation

---

# 👨‍💻 Author

**Ketan**

B.Tech — Information Technology
Jabalpur Engineering College | 2026

### Connect

* GitHub: https://github.com/theketan080

---

## ⭐ Project Highlights

> A backend-focused banking system built to understand and implement **real-world financial transaction handling, authentication, database consistency, and ledger architecture** using Node.js, Express.js, MongoDB, and Mongoose.

If you found this project useful, consider giving the repository a ⭐.
