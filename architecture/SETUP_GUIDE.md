# Waidblick - Setup & Development Guide

## Inhaltsverzeichnis
- [System Requirements](#system-requirements)
- [Project Setup](#project-setup)
- [Backend Development](#backend-development)
- [Frontend Development](#frontend-development)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)

---

## System Requirements

### Minimum Requirements
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **PostgreSQL**: 14.x or higher
- **Git**: For version control

### Development Tools (Recommended)
- **Visual Studio Code** with extensions:
  - ESLint
  - Prettier
  - TypeScript Vue Plugin
  - PostCSS Language Support
- **Postman** or **Insomnia** for API testing
- **pgAdmin** or **DBeaver** for database management

---

## Project Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/waidblick.git
cd waidblick
```

### 2. Create Environment Files

#### Backend Environment (`.env` in `BACKEND/`)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=waidblick
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Server
NODE_ENV=development
PORT=3001
API_BASE_URL=http://localhost:3001

# Security
JWT_SECRET=your_jwt_secret_key_min_32_chars
JWT_EXPIRES_IN=7d

# Logging
LOG_LEVEL=debug

# CORS
CORS_ORIGIN=http://localhost:5173
```

#### Frontend Environment (`.env` in `FRONTEND/`)
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=Waidblick
VITE_APP_VERSION=1.0.0
```

### 3. Install Root Dependencies
```bash
npm install
```

### 4. Install Backend Dependencies
```bash
cd BACKEND
npm install
```

### 5. Install Frontend Dependencies
```bash
cd ../FRONTEND
npm install
```

---

## Database Setup

### 1. Create PostgreSQL Database
```bash
# Connect to PostgreSQL
psql -U postgres

# In PostgreSQL shell
CREATE DATABASE waidblick;
CREATE USER waidblick_user WITH PASSWORD 'your_password';
ALTER ROLE waidblick_user SET client_encoding TO 'utf8';
ALTER ROLE waidblick_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE waidblick_user SET default_transaction_deferrable TO on;
ALTER ROLE waidblick_user SET default_transaction_level TO 'read committed';
GRANT ALL PRIVILEGES ON DATABASE waidblick TO waidblick_user;
\q
```

### 2. Run Database Migrations
```bash
cd BACKEND

# Create migration runner (if not using existing tool)
npm run migrate:up

# Or using raw SQL file
psql -U waidblick_user -d waidblick -f src/database/migrations/001_init_schema.sql
```

### 3. Seed Sample Data (Optional)
```bash
npm run seed:dev
```

---

## Backend Development

### Development Server
```bash
cd BACKEND

# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Or with nodemon
npm run dev:watch
```

The backend will be available at `http://localhost:3001`

### API Documentation
Once server is running, visit:
- **API Docs**: `http://localhost:3001/api/docs` (Swagger UI)
- **API Health**: `http://localhost:3001/health`

### Common Backend Commands
```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Build for production
npm run build

# Start production server
npm run start

# Database migrations
npm run migrate:up      # Run pending migrations
npm run migrate:down    # Rollback last migration
npm run migrate:status  # Check migration status
```

### Backend Project Structure Reference
```
BACKEND/
├── src/
│   ├── modules/          # Feature modules (jaeger, reviere, etc.)
│   ├── middleware/       # Express middleware
│   ├── database/         # Database client and migrations
│   ├── types/            # TypeScript interfaces
│   ├── utils/            # Utility functions
│   └── index.ts          # Entry point
├── tests/                # Test files
├── package.json
└── tsconfig.json
```

---

## Frontend Development

### Development Server
```bash
cd FRONTEND

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Common Frontend Commands
```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type check
npm run type-check
```

### Frontend Project Structure Reference
```
FRONTEND/
├── src/
│   ├── components/       # React components
│   ├── features/         # Feature-specific components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service layer
│   ├── store/            # State management (Zustand)
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   ├── styles/           # Global styles
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── tests/                # Test files
├── package.json
└── vite.config.ts
```

---

## Running the Application

### Option 1: Manual Run (Development)

Terminal 1 - Start Backend:
```bash
cd BACKEND
npm run dev
```

Terminal 2 - Start Frontend:
```bash
cd FRONTEND
npm run dev
```

Then open browser to `http://localhost:5173`

### Option 2: Docker Compose (Recommended)

```bash
# From project root
docker-compose up

# Or in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The application will be available at:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001`
- **PostgreSQL**: `localhost:5432`

### Option 3: Production Build

```bash
# Build backend
cd BACKEND
npm run build

# Build frontend
cd FRONTEND
npm run build

# Start production servers (requires NODE_ENV=production)
NODE_ENV=production npm start
```

---

## Development Workflow

### Adding a New Backend Module

1. **Create module folder**
```bash
mkdir BACKEND/src/modules/new-feature
```

2. **Create module files**
```bash
touch BACKEND/src/modules/new-feature/new-feature.{validation,repository,service,controller,routes,test}.ts
```

3. **Add TypeScript interfaces**
   - Edit `BACKEND/src/types/models.ts`

4. **Implement module**
   - Follow the pattern in `BACKEND_MODULE_EXAMPLE.md`

5. **Register routes**
   - Update `BACKEND/src/routes/api.routes.ts`

6. **Test**
```bash
cd BACKEND
npm run test -- new-feature.test.ts
```

### Adding a New Frontend Feature

1. **Create feature folder**
```bash
mkdir FRONTEND/src/components/features/new-feature
```

2. **Create feature files**
```bash
touch FRONTEND/src/components/features/new-feature/{NewFeatureList,NewFeatureForm,NewFeatureDetail}.tsx
touch FRONTEND/src/components/features/new-feature/new-feature.module.css
```

3. **Create service**
```bash
touch FRONTEND/src/services/new-feature.service.ts
```

4. **Create store**
```bash
touch FRONTEND/src/store/slices/new-feature.slice.ts
```

5. **Create custom hook**
```bash
touch FRONTEND/src/hooks/useNewFeature.ts
```

6. **Create page**
```bash
touch FRONTEND/src/pages/NewFeaturePage.tsx
```

7. **Update Router**
   - Edit `FRONTEND/src/Router.tsx`

8. **Follow the pattern in `FRONTEND_MODULE_EXAMPLE.md`**

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature description"

# Push to remote
git push origin feature/new-feature

# Create Pull Request on GitHub
# ... review and merge
```

### Conventional Commits
Use these prefixes for commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (no logic)
- `refactor:` - Code refactoring
- `test:` - Test updates
- `chore:` - Build, deps, config changes

Example:
```bash
git commit -m "feat(jaeger): add hunting license validation"
git commit -m "fix(reviere): correct GPS coordinate validation"
git commit -m "docs(api): update endpoint documentation"
```

---

## Debugging

### Backend Debugging

Using VS Code:
1. Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Backend Debug",
      "program": "${workspaceFolder}/BACKEND/src/index.ts",
      "outFiles": ["${workspaceFolder}/BACKEND/dist/**/*.js"],
      "runtimeArgs": ["-r", "ts-node/register"],
      "cwd": "${workspaceFolder}/BACKEND"
    }
  ]
}
```

2. Add breakpoints in code
3. Press F5 to start debugging

### Frontend Debugging

1. Open DevTools (F12)
2. Use React DevTools extension
3. Use Redux DevTools for state debugging (if using Redux)

### Database Debugging

```bash
# Connect to database
psql -U waidblick_user -d waidblick

# Useful commands
\dt              # List tables
\d table_name    # Describe table
SELECT * FROM table_name LIMIT 10;  # Query data
```

---

## Testing

### Backend Tests
```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- jaeger.test.ts

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Frontend Tests
```bash
# Run all tests
npm run test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### Test Structure
```
BACKEND/tests/
├── unit/
│   └── modules/jaeger/
│       └── jaeger.service.test.ts
├── integration/
│   └── api/jaeger.integration.test.ts
└── fixtures/
    └── jaeger.fixtures.ts

FRONTEND/tests/
├── unit/
│   ├── services/
│   ├── hooks/
│   └── utils/
├── integration/
└── fixtures/
```

---

## Performance Tips

### Backend
- Use database indexes (already defined in schema)
- Implement pagination for large datasets
- Use connection pooling (pg pool)
- Cache frequently accessed data
- Monitor query performance

### Frontend
- Use React.memo for expensive components
- Implement lazy loading with React.lazy()
- Code split by route using React Router
- Optimize images and assets
- Use virtual scrolling for long lists

---

## Common Issues & Solutions

### Issue: Port Already in Use
```bash
# Find process using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=3002
```

### Issue: Database Connection Fails
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection string
psql -U waidblick_user -d waidblick

# Verify DB_* variables in .env
```

### Issue: CORS Errors
- Check `CORS_ORIGIN` in backend .env
- Check `VITE_API_BASE_URL` in frontend .env
- Ensure backend CORS middleware is enabled

### Issue: Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Environment Variables Checklist

### Backend .env
- [ ] DB_HOST
- [ ] DB_PORT
- [ ] DB_NAME
- [ ] DB_USER
- [ ] DB_PASSWORD
- [ ] NODE_ENV
- [ ] PORT
- [ ] JWT_SECRET (min 32 chars)
- [ ] CORS_ORIGIN

### Frontend .env
- [ ] VITE_API_BASE_URL
- [ ] VITE_APP_NAME
- [ ] VITE_APP_VERSION

---

## Next Steps

1. **Setup complete** - Follow the "Running the Application" section
2. **Explore code** - Review `BACKEND_MODULE_EXAMPLE.md` and `FRONTEND_MODULE_EXAMPLE.md`
3. **Create first feature** - Add a new module using the guides above
4. **Add tests** - Ensure code quality with unit and integration tests
5. **Deploy** - Follow deployment guidelines when ready

---

## Support & Resources

- **Database Schema**: See `waidblick_schema.sql`
- **API Documentation**: Run backend and visit `/api/docs`
- **Architecture**: See `PROJECT_STRUCTURE.md`
- **Backend Example**: See `BACKEND_MODULE_EXAMPLE.md`
- **Frontend Example**: See `FRONTEND_MODULE_EXAMPLE.md`

---

## Quick Start Summary

```bash
# 1. Setup environment
cp BACKEND/.env.example BACKEND/.env
cp FRONTEND/.env.example FRONTEND/.env

# 2. Create database
createdb waidblick

# 3. Run migrations
cd BACKEND && npm run migrate:up

# 4. Install dependencies
npm install && cd BACKEND && npm install && cd ../FRONTEND && npm install

# 5. Start development
# Terminal 1:
cd BACKEND && npm run dev

# Terminal 2:
cd FRONTEND && npm run dev

# 6. Visit http://localhost:5173
```

Happy coding! 🚀
