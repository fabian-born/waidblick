# Waidblick - Developer Quick Reference

## Quick Commands

### Backend
```bash
cd BACKEND

# Development
npm run dev              # Start dev server
npm run dev:watch       # With nodemon
npm test                # Run tests
npm run lint            # Check code
npm run lint:fix        # Fix linting issues
npm run build           # Build for production

# Database
npm run migrate:up      # Run migrations
npm run migrate:down    # Rollback
npm run seed:dev        # Seed sample data
```

### Frontend
```bash
cd FRONTEND

# Development
npm run dev             # Start dev server
npm test                # Run tests
npm run lint            # Check code
npm run lint:fix        # Fix linting issues
npm run build           # Build for production
npm run preview         # Preview production build
```

### Docker
```bash
# From root directory
docker-compose up       # Start all services
docker-compose down     # Stop all services
docker-compose logs -f  # View logs
```

---

## Folder Structure Quick Reference

```
BACKEND/
├── src/modules/       ← Add new features here
├── src/middleware/    ← Add global middleware
├── src/database/      ← Add migrations
├── src/types/         ← Add TypeScript types
└── src/utils/         ← Add helper functions

FRONTEND/
├── src/components/features/  ← Add feature components
├── src/services/             ← Add API services
├── src/store/slices/         ← Add state management
├── src/hooks/                ← Add custom hooks
├── src/pages/                ← Add pages/routes
└── src/styles/               ← Add global styles

SHARED/
├── types/              ← Shared TypeScript types
├── constants/          ← Shared constants
└── utils/              ← Shared utility functions
```

---

## Creating New Features Checklist

### New Backend Module

- [ ] Create folder: `BACKEND/src/modules/new-feature/`
- [ ] Create `new-feature.validation.ts` with Zod schemas
- [ ] Create `new-feature.repository.ts` with DB queries
- [ ] Create `new-feature.service.ts` with business logic
- [ ] Create `new-feature.controller.ts` with request handlers
- [ ] Create `new-feature.routes.ts` with route definitions
- [ ] Create `new-feature.test.ts` with unit tests
- [ ] Add TypeScript interfaces to `src/types/models.ts`
- [ ] Register routes in `src/routes/api.routes.ts`
- [ ] Test with Postman/Insomnia
- [ ] Update API documentation

### New Frontend Feature

- [ ] Create folder: `FRONTEND/src/components/features/new-feature/`
- [ ] Create `NewFeatureList.tsx` component
- [ ] Create `NewFeatureForm.tsx` component
- [ ] Create `NewFeatureDetail.tsx` component
- [ ] Create `new-feature.module.css` styles
- [ ] Create `FRONTEND/src/services/new-feature.service.ts`
- [ ] Create `FRONTEND/src/store/slices/new-feature.slice.ts`
- [ ] Create `FRONTEND/src/hooks/useNewFeature.ts`
- [ ] Create `FRONTEND/src/pages/NewFeaturePage.tsx`
- [ ] Update routing in `src/Router.tsx`
- [ ] Update navigation/menu if needed
- [ ] Add tests

---

## Common Code Patterns

### Backend Service Pattern
```typescript
export class MyService {
  constructor(private myRepository: MyRepository) {}

  async getData(): Promise<MyType[]> {
    try {
      return await this.myRepository.findAll();
    } catch (error) {
      logger.error('Error in getData', error);
      throw new AppError('Failed to fetch data', 500);
    }
  }
}
```

### Backend Controller Pattern
```typescript
export class MyController {
  constructor(private myService: MyService) {}

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.myService.getData();
      sendSuccess(res, data, 'Data fetched successfully');
    } catch (error) {
      next(error);
    }
  };
}
```

### Backend Repository Pattern
```typescript
export class MyRepository {
  constructor(private db: Pool) {}

  async findAll(): Promise<MyType[]> {
    try {
      const result = await this.db.query('SELECT * FROM my_table');
      return result.rows;
    } catch (error) {
      logger.error('Error in findAll', error);
      throw error;
    }
  }
}
```

### Frontend Component Pattern
```typescript
import React, { useEffect } from 'react';
import { useMyFeature } from '../../../hooks/useMyFeature';
import Button from '../../common/Button/Button';

const MyComponent: React.FC = () => {
  const { data, loading, error, fetchAll } = useMyFeature();

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {/* Render data */}
    </div>
  );
};

export default MyComponent;
```

### Frontend Hook Pattern
```typescript
export const useMyFeature = () => {
  const store = useMyFeatureStore();

  const handleFetch = useCallback(() => {
    store.fetchAll();
  }, [store]);

  return {
    data: store.data,
    loading: store.loading,
    error: store.error,
    fetch: handleFetch,
  };
};
```

### Frontend Store Pattern
```typescript
export const useMyFeatureStore = create<MyFeatureState>((set) => ({
  data: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const data = await myFeatureService.getAll();
      set({ data, loading: false });
    } catch (error) {
      set({ error: 'Error message', loading: false });
    }
  },
}));
```

---

## API Endpoints Pattern

Every module should provide these standard endpoints:

```
GET    /api/module           - Get all items
GET    /api/module/:id       - Get single item
POST   /api/module           - Create new item
PUT    /api/module/:id       - Update item
DELETE /api/module/:id       - Delete item
GET    /api/module/search    - Search items (optional)
GET    /api/module/stats/*   - Stats endpoints (optional)
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Testing Checklist

### Unit Tests Should Cover
- [ ] Happy path (successful operation)
- [ ] Error cases (service errors)
- [ ] Validation failures
- [ ] Edge cases (empty data, null values)
- [ ] Data transformations

### Integration Tests Should Cover
- [ ] Complete request/response flow
- [ ] Database operations
- [ ] Multiple service interactions
- [ ] Error handling through layers
- [ ] Middleware behavior

### Frontend Tests Should Cover
- [ ] Component rendering
- [ ] User interactions
- [ ] State changes
- [ ] API calls (mocked)
- [ ] Error handling
- [ ] Loading states

### Test Command
```bash
# Run all tests
npm test

# Run specific test
npm test -- myFeature.test.ts

# Run with coverage
npm test:coverage

# Watch mode
npm test:watch
```

---

## Git Workflow Quick Guide

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "feat: description"

# Push to remote
git push origin feature/new-feature

# Create Pull Request
# ... wait for review and approval

# Merge and cleanup
git checkout main
git pull origin main
git merge feature/new-feature
git push origin main
git branch -d feature/new-feature
```

### Commit Message Convention
```
<type>(<scope>): <subject>

feat(jaeger):     Add new feature
fix(reviere):     Fix bug
docs(api):        Update documentation
style(components): Format code
refactor(store):  Reorganize code
test(services):   Add unit tests
chore(deps):      Update dependencies
```

---

## Debugging Tips

### Backend
```typescript
// Add logging
logger.debug('Debug message', { context: 'info' });

// VS Code debugger (F5)
// Breakpoints will pause execution

// Database queries
console.log(query, values);  // Log SQL before execution

// Error details
console.error(error);  // Full error stack
```

### Frontend
```typescript
// Console logging
console.log('value:', value);
console.error('error:', error);

// React DevTools
// Use component tree inspection

// Redux DevTools
// Track state changes over time

// Network tab
// Monitor API requests/responses
```

### Database
```sql
-- Check table structure
\d jaeger

-- Count rows
SELECT COUNT(*) FROM jaeger;

-- View recent records
SELECT * FROM jaeger LIMIT 10;

-- Check indexes
\d+ jaeger

-- View execution plan
EXPLAIN ANALYZE SELECT * FROM jaeger WHERE ...;
```

---

## Code Quality Checklist

Before committing:
- [ ] Code follows naming conventions
- [ ] No console.log() in production code
- [ ] No unused imports/variables
- [ ] TypeScript errors fixed
- [ ] Linter passes: `npm run lint`
- [ ] Tests pass: `npm test`
- [ ] No hardcoded values
- [ ] Error messages are helpful
- [ ] Code is DRY (Don't Repeat Yourself)
- [ ] Components/functions are small and focused

---

## Performance Tips

### Backend
- Use indexes for filtered/sorted columns ✅
- Implement pagination for large datasets
- Select only needed columns (avoid SELECT *)
- Use connection pooling
- Cache frequently accessed data
- Profile slow queries

### Frontend
- Memoize expensive components: `React.memo()`
- Use lazy loading: `React.lazy()` + `Suspense`
- Code split by route
- Optimize images (compression, format)
- Use virtual scrolling for large lists
- Debounce/throttle event handlers

### Database
- Create indexes on:
  - Foreign keys ✅ (already done)
  - Frequently filtered columns ✅
  - Join columns ✅
  - Sorted columns

---

## Security Checklist

- [ ] All inputs validated on backend
- [ ] SQL injection prevention (parameterized queries) ✅
- [ ] CORS properly configured
- [ ] Sensitive data not logged
- [ ] Passwords hashed (bcrypt)
- [ ] JWT secrets strong (min 32 chars)
- [ ] Environment variables not in code
- [ ] HTTPS enforced in production
- [ ] Rate limiting implemented
- [ ] Input sanitization (XSS prevention)

---

## Environment Variables

### Required Backend (.env)
```
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
JWT_SECRET=              # min 32 characters
NODE_ENV=development     # or production
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### Required Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=Waidblick
VITE_APP_VERSION=1.0.0
```

---

## Useful Tools

- **Postman** - API testing
- **DBeaver** - Database management
- **VS Code Extensions**:
  - ESLint
  - Prettier
  - TypeScript Vue Plugin
  - Thunder Client (API testing)
  - PostgreSQL
- **DevTools** - Browser debugging
- **Git Extensions** - Git visualization

---

## File Naming Convention

### Backend
- `*.controller.ts` - HTTP handler
- `*.service.ts` - Business logic
- `*.repository.ts` - Database access
- `*.validation.ts` - Input validation
- `*.routes.ts` - Route definitions
- `*.test.ts` - Tests

### Frontend
- `*.tsx` - React components
- `*.ts` - TypeScript logic
- `*.module.css` - Scoped styles
- `*.service.ts` - API services
- `*.slice.ts` - State slices
- `*.test.tsx` - Component tests
- `*.hook.ts` or `use*.ts` - Custom hooks

---

## Common Errors & Solutions

| Error | Solution |
|-------|----------|
| `Cannot find module` | Run `npm install`, check import path |
| `Port already in use` | Change PORT in .env or kill process |
| `Database connection failed` | Check DB credentials, ensure PostgreSQL running |
| `CORS error` | Check CORS_ORIGIN in backend .env |
| `Module not found` | Clear node_modules: `rm -rf node_modules && npm install` |
| `TypeScript errors` | Run `npm run type-check` and fix issues |
| `Linting errors` | Run `npm run lint:fix` |

---

## Quick Start (New Developer)

```bash
# 1. Clone repo
git clone <repo>
cd waidblick

# 2. Setup environments
cp BACKEND/.env.example BACKEND/.env
cp FRONTEND/.env.example FRONTEND/.env

# 3. Install dependencies
npm install && cd BACKEND && npm install && cd ../FRONTEND && npm install && cd ..

# 4. Setup database
createdb waidblick
cd BACKEND && npm run migrate:up

# 5. Start development
# Terminal 1:
cd BACKEND && npm run dev

# Terminal 2:
cd FRONTEND && npm run dev

# 6. Visit http://localhost:5173
```

---

## Learning Resources

- **Backend Patterns**: See `BACKEND_MODULE_EXAMPLE.md`
- **Frontend Patterns**: See `FRONTEND_MODULE_EXAMPLE.md`
- **Architecture**: See `ARCHITECTURE_DIAGRAMS.md`
- **Setup Guide**: See `SETUP_GUIDE.md`
- **Project Structure**: See `PROJECT_STRUCTURE.md`

---

## Need Help?

1. Check relevant documentation file
2. Search existing code for similar patterns
3. Check tests for usage examples
4. Check error message carefully
5. Review Git history for context
6. Ask team members

---

**Happy Coding! 🚀**
