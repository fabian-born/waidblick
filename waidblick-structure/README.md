# Waidblick - Hunting Management System

A modern, modular web application for managing hunting territories, hunters, and related operations.

## 📁 Project Structure

```
waidblick/
├── BACKEND/           # Node.js/Express/TypeScript API
├── FRONTEND/          # React/TypeScript Web Application
├── SHARED/            # Shared types and utilities
├── DOCS/              # Documentation files
├── docker-compose.yml # Docker setup
├── package.json       # Root package.json
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- PostgreSQL 14+
- Docker (optional)

### Using Docker (Recommended)

```bash
# Setup environment
cp BACKEND/.env.example BACKEND/.env
cp FRONTEND/.env.example FRONTEND/.env

# Start all services
docker-compose up

# Application will be available at:
# - Frontend: http://localhost:5173
# - Backend: http://localhost:3001
# - Database: localhost:5432
```

### Manual Setup

```bash
# 1. Install dependencies
npm run install-all

# 2. Create database
createdb waidblick

# 3. Run migrations
cd BACKEND && npm run migrate:up

# 4. Start development servers (in separate terminals)
npm run dev:backend
npm run dev:frontend

# Application will be available at:
# - Frontend: http://localhost:5173
# - Backend: http://localhost:3001
```

## 📚 Documentation

See the `/DOCS` folder for comprehensive documentation:

- **PROJECT_STRUCTURE.md** - Complete file structure and organization
- **BACKEND_MODULE_EXAMPLE.md** - Backend development patterns
- **FRONTEND_MODULE_EXAMPLE.md** - Frontend development patterns
- **SETUP_GUIDE.md** - Detailed setup instructions
- **ARCHITECTURE_DIAGRAMS.md** - System architecture and data flow
- **QUICK_REFERENCE.md** - Quick commands and patterns

## 🔧 Available Scripts

### Root Level
```bash
npm install-all           # Install dependencies for all packages
npm run dev               # Start both backend and frontend
npm run dev:backend       # Start backend only
npm run dev:frontend      # Start frontend only
npm run build             # Build both for production
npm run test              # Run all tests
npm run lint              # Lint all code
npm run lint:fix          # Fix linting issues
```

### Backend
```bash
cd BACKEND

npm run dev               # Start development server
npm test                  # Run tests
npm run lint              # Check code quality
npm run migrate:up        # Run database migrations
npm run migrate:down      # Rollback migrations
npm run build             # Build for production
npm start                 # Start production server
```

### Frontend
```bash
cd FRONTEND

npm run dev               # Start development server
npm run build             # Build for production
npm run preview           # Preview production build
npm test                  # Run tests
npm run lint              # Check code quality
npm run type-check        # Check TypeScript types
```

## 🏗️ Architecture Overview

### Backend (Node.js/Express)
- **Layer Pattern**: Routes → Controller → Service → Repository → Database
- **Type Safety**: Full TypeScript support
- **Validation**: Zod schemas for input validation
- **Error Handling**: Centralized error handling middleware
- **Logging**: Winston logger for all events
- **Database**: PostgreSQL with connection pooling

### Frontend (React)
- **Component-Based**: Reusable components with React
- **State Management**: Zustand for global state
- **API Integration**: Axios with interceptors
- **Styling**: CSS Modules for scoped styles
- **Routing**: React Router v6
- **Type Safety**: Full TypeScript support

### Database
- **PostgreSQL**: Relational database
- **Schema**: 5 main tables + multiple views
- **Indexes**: Optimized queries with proper indexes
- **Relationships**: Foreign keys and constraints

## 📋 Features

- ✅ Modular architecture for easy feature addition
- ✅ Type-safe TypeScript throughout
- ✅ Comprehensive error handling
- ✅ Input validation on both frontend and backend
- ✅ Responsive UI with modern styling
- ✅ RESTful API design
- ✅ Database migrations support
- ✅ Comprehensive logging
- ✅ Docker support for easy deployment
- ✅ Full test coverage capabilities

## 🗄️ Database Schema

The application manages:
- **Hegeringe** (Hunting Circles)
- **Reviere** (Hunting Territories)
- **Jaeger** (Hunters)
- **Paechter** (Territory Lessees)
- **Mitjäger** (Additional Hunters)

See `DOCS/DATABASE.md` for detailed schema documentation.

## 🔐 Security

- Input validation with Zod schemas
- SQL injection prevention (parameterized queries)
- CORS configuration
- Helmet for HTTP headers
- JWT-ready authentication structure
- Environment variables for sensitive data

## 📊 Performance

- Database indexes on frequently queried columns
- Connection pooling
- Request compression
- Code splitting in frontend
- Lazy loading support
- Query optimization

## 🧪 Testing

```bash
# Backend tests
cd BACKEND && npm test

# Frontend tests
cd FRONTEND && npm test

# Coverage
npm run test:coverage
```

## 📖 Development Workflow

1. **Create feature branch**: `git checkout -b feature/feature-name`
2. **Follow patterns**: See BACKEND_MODULE_EXAMPLE.md and FRONTEND_MODULE_EXAMPLE.md
3. **Write tests**: Ensure test coverage
4. **Run linters**: `npm run lint:fix`
5. **Create pull request**: For team review

## 🚀 Deployment

For production deployment:

```bash
# Build
npm run build

# Environment setup
cp BACKEND/.env.example BACKEND/.env
cp FRONTEND/.env.example FRONTEND/.env

# Update .env files with production values
# - Database credentials
# - API endpoints
# - Security settings

# Run migrations
npm run migrate:up

# Start servers
npm start
```

## 🤝 Contributing

1. Follow the modular structure
2. Use TypeScript for type safety
3. Add tests for new features
4. Follow the naming conventions
5. Update documentation
6. Use meaningful commit messages

## 📝 License

MIT

## 📞 Support

For detailed information:
- See `/DOCS` folder for comprehensive documentation
- Check existing code examples in modules
- Review error messages and logs
- Consult the QUICK_REFERENCE.md for common tasks

---

**Happy Hunting! 🎯**
