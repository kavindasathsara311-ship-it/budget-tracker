# Budgetify - Multi-user Budget Tracking Web Application

A professional, full-stack budget tracking application built with Node.js, Express, Prisma, React, and Tailwind CSS.

## Features
- **Secure Authentication**: JWT-based auth with refresh token rotation and HTTP-only cookies.
- **OTP Verification**: Multi-step registration with 6-digit email verification.
- **Expense Management**: Add, view, filter, and delete expenses with category icons.
- **Budget Tracking**: Set daily limits and track status with visual progress bars.
- **Visual Analytics**: Interactive charts (Donut, Bar, Line) for spending trends and breakdown.
- **Automated Reports**: Daily summaries, weekly and monthly detailed reports via email.
- **Security Hardened**: Rate limiting, Helmet (CSP), input validation (Zod), and password hashing (Bcrypt).

## Tech Stack
- **Backend**: Node.js, Express, Prisma (PostgreSQL), Nodemailer, node-cron.
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Zustand, Recharts, React Hook Form, Zod.
- **Infrastructure**: Docker & Docker Compose.

## Prerequisites
- Node.js (v18+)
- PostgreSQL (or use Docker)
- SMTP credentials (for emails)

## Local Setup

### 1. Clone the repository
```bash
git clone <repo-url>
cd budget-tracker
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your DATABASE_URL, JWT_SECRET, and SMTP credentials
npx prisma migrate dev
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
# Update .env if your backend port is different
npm run dev
```

## Running with Docker
1. Create a `.env` file in the root directory (refer to `backend/.env.example`).
2. Run the following command:
```bash
docker-compose up --build
```

## Default Ports
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Database**: localhost:5432

## Environment Variables
Refer to `backend/.env.example` and `frontend/.env.example` for the full list of required variables.

## Scripts
### Backend
- `npm run dev`: Start development server (nodemon)
- `npm run build`: Compile TypeScript
- `npm run prisma:migrate`: Run database migrations

### Frontend
- `npm run dev`: Start Vite development server
- `npm run build`: Build for production
