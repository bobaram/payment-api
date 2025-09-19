# Payment Processing API

This is a secure **RESTful API** for managing payment transactions, featuring an integrated **rule-based fraud detection system**.  
The project is built with **Node.js**, **Express**, **TypeScript**, and **Prisma**, using a **SQLite database** for portability and ease of setup.

---

## 📑 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Running Tests](#running-tests)
- [Security Considerations](#security-considerations)

---

## 🚀 Features

- **Transaction Management**: Create, read, and list payment transactions.
- **Status Updates**: Admin-only endpoint to update the status of a transaction.
- **Fraud Detection**: Automated, rule-based system to flag suspicious transactions.
- **Analytics**: Endpoint to provide a summary of all flagged transactions.
- **Merchant Views**: Retrieve all transactions for a specific merchant.

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: SQLite
- **ORM**: Prisma
- **Validation**: Zod
- **Testing**: Jest & Supertest

---

## 📂 Project Structure

The project uses a scalable, feature-first structure that separates concerns, making it easy to maintain and test.

/
├── prisma/ # Database schema and migrations
├── src/
│ ├── api/ # API-related code (routes, middleware, services)
│ ├── startup/ # App initialization modules (routes, db)
│ └── tests/ # Integration and unit tests
└── ... # Config files (package.json, tsconfig.json, etc.)

yaml
Copy code

---

⚙️ Setup and Installation

1. Clone the repository
   git clone <your-repository-url>
   cd payment-api

2. Install dependencies
   npm install

3. Set up environment files
   Create two environment files in the project root: .env.development and .env.test.

Copy the contents from the Environment Variables section below into each.

4. Set up the development database
   Run the migration command to create and set up your local dev.db file:

npm run db:migrate:dev

5. Set up the test database
   Run the migration command to create and set up your separate test.db file:

npm run db:migrate:test

6. Run the development server
   This will copy your .env.development to a temporary .env (via the predev script) and then start the server:

npm run dev

The server will be available at http://localhost:3000.

🔑 Environment Variables
.env.development

# The port the application will run on

PORT=3000

# Connection URL for the SQLite development database

DATABASE_URL="file:./dev.db"

# A secret key for protecting admin-only endpoints

ADMIN_API_KEY="your-secret-admin-key"

.env.test

# Connection URL for the SQLite test database

DATABASE_URL="file:./test.db"

# A different secret key for tests

ADMIN_API_KEY="test-admin-key-123"

📘 API Documentation
A Postman collection Payment-API.postman_collection.json is included in the root of this repository.

For usage instructions, please see POSTMAN_README.md.

🧪 Running Tests
To run the full suite of integration tests against the test database:

npm test

The pretest script automatically sets up the correct environment file.

🔒 Security Considerations
Input Validation: All incoming request data is validated with Zod.

Admin Route Protection: Critical endpoints require a secret API key and middleware protection.

Security Headers: The helmet middleware applies standard security-related HTTP headers.

Environment Variables: All sensitive values are stored in environment variables (never hardcoded).
