# 💳 RevoBank - Backend API

A simple banking API built with **NestJS**, simulating core digital banking functionalities like user registration, login, money transfer, and transaction tracking.

---

## 📌 Project Overview

**RevoBank** is a backend system that allows users to register, authenticate, view their account details, perform money transfers, and view transaction history. It was developed as part of a backend development course using modern technologies and clean architecture.

---

## ✨ Endpoint and Features Implemented
### 1. Endpoint
| Feature             | Endpoint                      | Description                                                     |
|---------------------|-------------------------------|-----------------------------------------------------------------|
| User Registration   | `POST /auth/register`         | Create a new user account                                       |
| User Login          | `POST /auth/login`            | Authenticate user and return a JWT                              |
| View Profile        | `GET /users/profile`          | Retrieve current user's details                                 |
| Specific User       | `POST /users/profile`         | Update user information (Admin and Customer)                    |
| Specific User       | `GET /users/:id`              | Admin Retrieve details of a specific user                       |
| Edit User           | `PATCH /users/:id`            | Update user information (Admin Only)                            |
| Account Registration| `POST /accounts`              | Create a new bank account for a user (Admin)                    |
| Account Registration| `POST /accounts/register`     | Create a new bank account for a user (general)                  |
| All Account         | `GET /accounts`               | Retrieve a list of accounts with optional filters (Admin Only)  |
| Specific Account    | `GET /accounts/:id`           | Retrieve details of a specific account                          |
| Edit Account        | `PATCH /accounts/:id`         | Update account details                                          |
| Delete Account      | `DELETE /accounts/:id`        | Delete an account                                               |
| Deposit             | `POST /transactions/deposit`  | Deposit to account                                              |
| Withdraw            | `POST /transactions/withdraw` | Withdraw from account                                           |
| Transfer            | `POST /transactions/transfer` | Transfer between accounts                                       |
| All Transaction     | `GET /transactions`           | Retrieve a list of transactions with filters                    |
| Specific Transaction| `GET /transactions/:id`       | Retrieve details of a specific transaction                      |
| Edit Transaction    | `PATCH /transactions/:id`     | Update transaction status                                       |

### 2. Feature
- **Security and Compliance**:

  - JWT-based authentication for secure endpoint access.
  - Role-based access control (e.g., admin vs. regular user).
  - Audit logging for administrative actions (e.g., viewing accounts or transactions).
  - Secure data transformation using DTOs to exclude sensitive fields (e.g., `pin`, `password`).

- **Additional Features**:

  - Pagination and filtering for large datasets (e.g., accounts and transactions).
  - Data validation using `class-validator` for request payloads.
  - Custom interceptor (`TransformResInterceptor`) to transform responses into DTOs for consistency and security.

---

## Technologies Used

The Revobank API is built using the following technologies:

- **Framework**: NestJS (v10.x) - A progressive Node.js framework for building efficient and scalable server-side applications.
- **ORM**: Prisma (v5.x) - A modern database toolkit for TypeScript and Node.js, used for database interactions and schema management.
- **Database**: PostgreSQL - A powerful, open-source relational database for storing user, account, and transaction data.
- **Authentication**: JSON Web Tokens (JWT) - For secure user authentication and authorization.
- **Data Transformation**: `class-transformer` and `class-validator` - For transforming and validating API responses and requests.
- **Package Manager**: pnpm - For efficient dependency management.
- **Other Libraries**:
  - `@nestjs/config` for environment variable management.
  - `@nestjs/jwt` and `@nestjs/passport` for authentication.
  - `bcrypt` for password hashing.
- **Development Tools**:
  - TypeScript (v5.x) for type-safe code.
  - ESLint and Prettier for code linting and formatting.
  - NestJS CLI for project scaffolding and build management.

## How to Run the Project Locally

Follow these steps to set up and run the Revobank API locally.

### Prerequisites

- **Node.js**: v22.12.0 or later
- **pnpm**: v8.x or later (`npm install -g pnpm`)
- **PostgreSQL**: v14.x or later, installed and running locally or on a hosted service
- **Git**: For cloning the repository

### Setup Instructions

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd milestone-4-Salthof28
   ```

2. **Install Dependencies**:

   ```bash
   pnpm install
   ```

3. **Set Up Environment Variables**:

   - Copy the `.env.example` file to `.env`:

     ```bash
     cp .env.example .env
     ```
   - Update `.env` with your configuration:

     ```env
     DATABASE_URL="postgresql://<user>:<password>@localhost:5432/revobank?schema=public"
     ```
   - **Note**: Replace `<user>`, `<password>`, and other values with your PostgreSQL credentials.

4. **Set Up the Database**:

   - Run Prisma migrations to create the database schema:

     ```bash
     npx prisma migrate dev --name init
     ```
   - Generate Prisma Client:

     ```bash
     npx prisma generate
     ```
   - (Optional) Seed the database with sample data:

     ```bash
     npx prisma db seed
     ```

5. **Build the Project**:

   ```bash
   pnpm run build
   ```

6. **Run the Application**:

   - For development (with hot reload):

     ```bash
     pnpm run start:dev
     ```

7. **Access the API**:

   - The API will be available at `http://localhost:3000`.
   - Use tools like Postman or cURL to test endpoints (e.g., `POST /auth/register`, `GET /accounts`).

### Database Configuration

- **Schema**: The database schema is defined in `prisma/schema.prisma`. Key models include:
  - `User`: Stores user information (e.g., email, password hash).
  - `Account`: Stores bank account details (e.g., `account_number`, `balance`, `sourceTransactions`, `destinationTransactions`).
  - `Transaction`: Stores transaction records (e.g., `account_id`, `destination_account_id`, `amount`).
  - `AuditLog`: Stores logs of administrative actions for compliance.
- **Migration**: Use `npx prisma migrate dev` to apply schema changes.
- **Seeding**: Implement a seeding script (e.g., `prisma/seed.ts`) to populate the database with sample data for testing.

### Example `.env.example`

```env
DATABASE_URL="postgresql://user:password@localhost:5432/revobank"
```