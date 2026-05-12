# Hermata Kebele House Tax and Property Payment Management System

A comprehensive digital platform for managing property registration, tax assessments, and payments for the Hermata Kebele.

## 🚀 Overview

This system streamlines the yearly property tax collection process by providing:
- **Property Management**: Registration and approval of houses and land.
- **Document Management**: Secure storage and review of ownership documents.
- **Tax Assessments**: Automated generation of yearly tax based on location categories and land size.
- **Payment Collection**: Support for Sinqee Bank receipt uploads and Chapa online payments.
- **Kebele Confirmations**: Issuance of official, printable payment confirmations.
- **Reports & Analytics**: Real-time insights for kebele management.
- **Multi-language Support**: Fully localized in English, Amharic, and Afaan Oromoo.

## 🛠️ Project Structure

- `/frontend`: Next.js 16 application (TypeScript, Tailwind CSS, pnpm).
- `/backend`: Node.js/Express API (TypeScript, Prisma, PostgreSQL).
- `/docs`: Detailed documentation and setup guides.

## 🏁 Quick Start

To set up the project locally, please follow the [Local Development Guide](./docs/local-development.md).

### Summary Commands:

**Backend:**
```bash
cd backend
npm install
npm run db:setup
npm run dev
```

**Frontend:**
```bash
cd frontend
pnpm install
pnpm dev
```

## 🔐 Security & Auth

Authentication is handled by **Better Auth**, providing secure session management and Role-Based Access Control (RBAC).

Roles:
- **ADMIN**: Full system configuration.
- **MANAGER**: Property/document review and assessment approval.
- **ASSIGNED_WORKER**: Data entry and field verification.
- **USER**: Property owners viewing their tax status and making payments.

## 🌍 Localization

The system supports:
- 🇺🇸 English
- 🇪🇹 Amharic (አማርኛ)
- 🇪🇹 Afaan Oromoo (Oromiffa)

Routes are prefixed by locale: `/[lang]/dashboard`.

## 📄 License

Internal system for Hermata Kebele. All rights reserved.
