# OpenWatch - Transparency & Governance Platform

A full-stack platform for government transparency and public accountability with secure, auditable access to public records.

## Architecture

- **Frontend**: React + Tailwind CSS (Vercel)
- **Backend**: Node.js + Express (Render)
- **Database**: PostgreSQL with audit trails
- **Optional**: Blockchain verification via ethers.js

## Features

- Role-based access control (Citizens, Officials, Admins)
- Government records management with full audit trails
- Optional blockchain verification for tamper-proof integrity
- Real-time transparency and accountability

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Deployment

- Frontend: Vercel (auto-deploy)
- Backend: Render (persistent service)
- Database: PostgreSQL

## Security

- JWT authentication
- Password hashing (bcrypt)
- Input validation
- CORS & rate limiting
- Environment-isolated secrets
