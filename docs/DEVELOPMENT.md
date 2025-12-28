# OpenWatch Development Guide

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+ (or MongoDB 4.4+)
- Git
- Optional: Docker for containerized development

### Local Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-org/openwatch.git
cd openwatch
```

2. **Backend Setup**

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your local configuration
npm run dev
```

3. **Frontend Setup**

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your local configuration
npm run dev
```

4. **Database Setup**

```bash
# Create PostgreSQL database
createdb openwatch

# Run schema
psql openwatch -f backend/src/database/schema.sql
```

## Project Structure

```
openwatch/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── context/        # React context providers
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Data models (if using ORM)
│   │   └── utils/          # Utility functions
│   ├── server.js           # Express server entry point
│   └── package.json
├── contracts/              # Solidity smart contracts
├── docs/                   # Documentation
└── README.md
```

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature development branches
- `hotfix/*` - Critical bug fixes

### Commit Convention

Use conventional commits:

```
feat: add user authentication
fix: resolve CORS issue
docs: update API documentation
style: format code with prettier
refactor: restructure user service
test: add unit tests for auth controller
```

### Code Style

#### Frontend (React/JavaScript)

- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Implement proper error boundaries

#### Backend (Node.js)

- Use ES6+ modules
- Implement proper error handling
- Follow RESTful API conventions
- Use middleware for cross-cutting concerns

## Testing

### Frontend Testing

```bash
cd frontend
npm test
```

### Backend Testing

```bash
cd backend
npm test
```

### Test Structure

- Unit tests for individual functions
- Integration tests for API endpoints
- End-to-end tests for critical user flows

## Database Development

### Migrations

When making schema changes:

1. Create migration file
2. Update schema.sql
3. Test migration on development database
4. Document changes in commit message

### Seeding Data

Use the demo data in schema.sql for development:

- Demo users with different roles
- Sample government records
- Audit trail examples

## API Development

### Adding New Endpoints

1. Define route in appropriate router file
2. Implement controller function
3. Add validation schema
4. Update API documentation
5. Add tests

### Authentication & Authorization

- Use JWT tokens for authentication
- Implement role-based access control
- Validate permissions in middleware

## Frontend Development

### Component Development

1. Create reusable components in `/components`
2. Use TypeScript for better type safety
3. Implement proper prop validation
4. Add loading and error states

### State Management

- Use React Context for global state
- Implement proper error handling
- Cache API responses when appropriate

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow consistent spacing and typography
- Implement responsive design
- Use semantic HTML elements

## Security Best Practices

### Backend Security

- Validate all input data
- Use parameterized queries
- Implement rate limiting
- Hash passwords with bcrypt
- Use HTTPS in production
- Sanitize user input

### Frontend Security

- Validate user input
- Implement proper authentication flows
- Store tokens securely
- Use HTTPS for API calls
- Implement CSRF protection

## Performance Optimization

### Backend Performance

- Implement database indexing
- Use connection pooling
- Add caching where appropriate
- Optimize database queries
- Monitor API response times

### Frontend Performance

- Implement code splitting
- Optimize images and assets
- Use lazy loading
- Minimize bundle size
- Implement proper caching

## Debugging

### Backend Debugging

```bash
# Enable debug logging
DEBUG=* npm run dev

# Use Node.js debugger
node --inspect server.js
```

### Frontend Debugging

- Use React Developer Tools
- Implement proper error logging
- Use browser developer tools
- Add console logging for development

## Environment Configuration

### Development Environment Variables

**Backend (.env)**

```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://localhost:5432/openwatch
JWT_SECRET=dev-secret-key
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**

```
VITE_API_URL=http://localhost:5000/api
```

## Docker Development (Optional)

### Docker Compose Setup

```yaml
version: "3.8"
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:5000/api

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/openwatch
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=openwatch
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Troubleshooting

### Common Issues

1. **Port conflicts**

   - Change ports in environment variables
   - Kill processes using required ports

2. **Database connection issues**

   - Verify PostgreSQL is running
   - Check connection string format
   - Ensure database exists

3. **CORS errors**

   - Verify FRONTEND_URL in backend
   - Check CORS middleware configuration

4. **JWT token issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Validate token format

### Getting Help

1. Check existing documentation
2. Search through GitHub issues
3. Ask questions in team chat
4. Create detailed bug reports

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Update documentation
6. Submit a pull request

### Pull Request Guidelines

- Provide clear description of changes
- Include relevant tests
- Update documentation if needed
- Ensure all tests pass
- Follow code style guidelines
