# OpenWatch Deployment Guide

## Overview

This guide covers deploying OpenWatch to production using Vercel (frontend) and Render (backend).

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or MongoDB)
- Vercel account
- Render account
- Optional: Ethereum wallet for blockchain features

## Frontend Deployment (Vercel)

### 1. Prepare the Frontend

```bash
cd frontend
npm install
npm run build
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

#### Option B: GitHub Integration

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your backend API URL

### 3. Configure Environment Variables

In Vercel dashboard, add:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

## Backend Deployment (Render)

### 1. Prepare the Backend

```bash
cd backend
npm install
```

### 2. Create Render Web Service

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure build and start commands:
   - Build Command: `npm install`
   - Start Command: `npm start`

### 3. Configure Environment Variables

In Render dashboard, add:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-url.vercel.app
BCRYPT_ROUNDS=12
```

### 4. Database Setup

#### PostgreSQL (Recommended)

1. Create a PostgreSQL database on Render or external provider
2. Run the schema file:

```bash
psql $DATABASE_URL -f src/database/schema.sql
```

#### MongoDB Alternative

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/openwatch
```

## Optional: Blockchain Setup

### 1. Deploy Smart Contract

```bash
# Install Hardhat
npm install -g hardhat

# Deploy contract (example with Hardhat)
cd contracts
npx hardhat compile
npx hardhat deploy --network mainnet
```

### 2. Configure Blockchain Environment Variables

```
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-project-id
PRIVATE_KEY=your-ethereum-private-key
CONTRACT_ADDRESS=deployed-contract-address
```

## Security Checklist

- [ ] Use strong JWT secrets
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Use environment variables for all secrets
- [ ] Enable database SSL
- [ ] Set up monitoring and logging

## Monitoring

### Health Checks

Backend health endpoint: `GET /health`

### Logging

- Render provides built-in logging
- Consider adding external logging service (LogRocket, Sentry)

### Performance Monitoring

- Monitor API response times
- Track database query performance
- Monitor frontend Core Web Vitals

## Scaling Considerations

### Backend Scaling

- Render auto-scales based on traffic
- Consider Redis for session storage
- Implement database connection pooling

### Frontend Scaling

- Vercel provides global CDN
- Implement code splitting
- Optimize images and assets

### Database Scaling

- Use read replicas for heavy read workloads
- Implement database indexing
- Consider caching frequently accessed data

## Backup Strategy

### Database Backups

- Enable automated backups on your database provider
- Test restore procedures regularly

### Code Backups

- Use Git for version control
- Tag releases for easy rollback

## Troubleshooting

### Common Issues

1. **CORS Errors**

   - Verify FRONTEND_URL in backend environment
   - Check CORS configuration

2. **Database Connection Issues**

   - Verify DATABASE_URL format
   - Check network connectivity
   - Ensure SSL is configured if required

3. **JWT Token Issues**

   - Verify JWT_SECRET is set
   - Check token expiration settings

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

### Support

For deployment issues:

1. Check service logs
2. Verify environment variables
3. Test locally with production environment variables
4. Contact platform support if needed
