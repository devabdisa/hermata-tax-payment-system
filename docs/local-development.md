# Local Development Guide

This guide explains how to set up the **Kebele House Tax and Property Payment Management System** for local development.

## 1. Prerequisites

- **Node.js**: v18+ (v22 recommended)
- **pnpm**: `npm install -g pnpm` (for frontend)
- **npm**: (for backend)
- **PostgreSQL**: A running instance (Local or Cloud like Neon)

## 2. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and provide your `DATABASE_URL`.
   - Set a random string for `BETTER_AUTH_SECRET`.

4. **Initialize Database**:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The backend will be available at `http://localhost:5000`.

## 3. Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure Environment**:
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Edit `.env.local` and ensure `NEXT_PUBLIC_API_URL` points to your backend.
   - Provide the same `DATABASE_URL` and `BETTER_AUTH_SECRET` as used in the backend.

4. **Start Development Server**:
   ```bash
   pnpm dev
   ```
   The application will be available at `http://localhost:3000`.

## 4. Demo Accounts

The following demo accounts are created by the seed script. By default, you can register these users or use the **Dev Auth Bypass** if enabled.

- **Admin**: `admin@hermata.local`
- **Manager**: `manager@hermata.local`
- **Assigned Worker**: `worker@hermata.local`
- **Property Owner**: `owner@hermata.local`

> **Note on Passwords**: Since passwords are encrypted by Better Auth, the seed script creates the user records but not the credentials. You can "Register" with these emails to set your own password, or use the `ENABLE_DEV_AUTH_BYPASS=true` flag to bypass password checks (by passing `Authorization: Bearer dev-admin` etc. in API requests, or manually setting a session cookie).

## 5. Demo Workflow

1. **Login** as a Property Owner (`owner@hermata.local`).
2. **Register a Property**: Go to "My Properties" and add a new property.
3. **Upload Documents**: Upload required ownership documents.
4. **Login** as a Manager (`manager@hermata.local`).
5. **Review Property**: Review the submitted property and documents. Approve them.
6. **Generate Assessment**: From the property details, click "Generate Assessment".
7. **Login** as Property Owner again.
8. **Make Payment**: Go to the assessment and choose "Pay". Upload a Sinqee Bank receipt.
9. **Login** as Manager.
10. **Verify Payment**: Go to "Payments", review the receipt, and verify it.
11. **Issue Confirmation**: Once verified, an official Kebele Confirmation is generated.
12. **View Reports**: Check the "Reports" dashboard to see the updated metrics.

## 6. Common Troubleshooting

- **Prisma Schema Mismatch**: Run `npx prisma generate` after any schema changes.
- **Port Conflicts**: Ensure ports 3000 (frontend) and 5000 (backend) are free.
- **Database Connection**: Verify your `DATABASE_URL` is accessible.
