# Waidblick - Jagdverwaltungs Web-App
## Modulare File-Struktur

```
waidblick/
├── README.md                          # Project documentation
├── .gitignore
├── .env.example                       # Environment variables template
├── docker-compose.yml                 # Docker setup for local development
│
├── BACKEND/
│   ├── package.json
│   ├── .env
│   ├── tsconfig.json
│   ├── jest.config.js
│   │
│   ├── src/
│   │   ├── index.ts                   # Main server entry point
│   │   ├── server.ts                  # Express app configuration
│   │   ├── config/
│   │   │   ├── database.ts            # PostgreSQL connection setup
│   │   │   ├── environment.ts         # Environment variable validation
│   │   │   └── constants.ts           # Application constants
│   │   │
│   │   ├── types/
│   │   │   ├── models.ts              # TypeScript interfaces for database models
│   │   │   ├── api.ts                 # API request/response types
│   │   │   └── errors.ts              # Custom error types
│   │   │
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts        # Global error handling middleware
│   │   │   ├── validation.ts          # Request validation middleware
│   │   │   ├── authentication.ts      # JWT/auth middleware
│   │   │   ├── logging.ts             # Request logging middleware
│   │   │   └── cors.ts                # CORS configuration
│   │   │
│   │   ├── database/
│   │   │   ├── client.ts              # Database client initialization
│   │   │   └── migrations/
│   │   │       ├── 001_init_schema.sql
│   │   │       ├── 002_add_indexes.sql
│   │   │       └── migration.ts       # Migration runner
│   │   │
│   │   ├── modules/
│   │   │   ├── hegeringe/             # Hegeringe module
│   │   │   │   ├── hegeringe.controller.ts
│   │   │   │   ├── hegeringe.service.ts
│   │   │   │   ├── hegeringe.repository.ts
│   │   │   │   ├── hegeringe.validation.ts
│   │   │   │   ├── hegeringe.routes.ts
│   │   │   │   └── hegeringe.test.ts
│   │   │   │
│   │   │   ├── reviere/               # Reviere module
│   │   │   │   ├── reviere.controller.ts
│   │   │   │   ├── reviere.service.ts
│   │   │   │   ├── reviere.repository.ts
│   │   │   │   ├── reviere.validation.ts
│   │   │   │   ├── reviere.routes.ts
│   │   │   │   └── reviere.test.ts
│   │   │   │
│   │   │   ├── jaeger/                # Jaeger module
│   │   │   │   ├── jaeger.controller.ts
│   │   │   │   ├── jaeger.service.ts
│   │   │   │   ├── jaeger.repository.ts
│   │   │   │   ├── jaeger.validation.ts
│   │   │   │   ├── jaeger.routes.ts
│   │   │   │   └── jaeger.test.ts
│   │   │   │
│   │   │   ├── paechter/              # Paechter module
│   │   │   │   ├── paechter.controller.ts
│   │   │   │   ├── paechter.service.ts
│   │   │   │   ├── paechter.repository.ts
│   │   │   │   ├── paechter.validation.ts
│   │   │   │   ├── paechter.routes.ts
│   │   │   │   └── paechter.test.ts
│   │   │   │
│   │   │   ├── mitjaeger/             # Mitjäger module
│   │   │   │   ├── mitjaeger.controller.ts
│   │   │   │   ├── mitjaeger.service.ts
│   │   │   │   ├── mitjaeger.repository.ts
│   │   │   │   ├── mitjaeger.validation.ts
│   │   │   │   ├── mitjaeger.routes.ts
│   │   │   │   └── mitjaeger.test.ts
│   │   │   │
│   │   │   └── auth/                  # Authentication module
│   │   │       ├── auth.controller.ts
│   │   │       ├── auth.service.ts
│   │   │       ├── auth.routes.ts
│   │   │       └── auth.test.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── logger.ts              # Logging utility
│   │   │   ├── validators.ts          # Reusable validation functions
│   │   │   ├── apiResponse.ts         # Standardized API response formatter
│   │   │   ├── dateUtils.ts           # Date helper functions
│   │   │   └── errorHandler.ts        # Custom error handling
│   │   │
│   │   └── routes/
│   │       └── api.routes.ts          # Main API routes aggregator
│   │
│   └── tests/
│       ├── fixtures/                  # Test data and mocks
│       ├── integration/               # Integration tests
│       └── unit/                      # Unit tests
│
├── FRONTEND/
│   ├── package.json
│   ├── vite.config.ts                 # Vite configuration
│   ├── tsconfig.json
│   ├── .env.example
│   │
│   ├── public/
│   │   ├── favicon.ico
│   │   └── robots.txt
│   │
│   ├── src/
│   │   ├── main.tsx                   # React entry point
│   │   ├── vite-env.d.ts              # Vite type definitions
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Layout.tsx
│   │   │   │   └── Footer.tsx
│   │   │   │
│   │   │   ├── common/                # Reusable components
│   │   │   │   ├── Button/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   └── Button.module.css
│   │   │   │   ├── Modal/
│   │   │   │   │   ├── Modal.tsx
│   │   │   │   │   └── Modal.module.css
│   │   │   │   ├── Table/
│   │   │   │   │   ├── Table.tsx
│   │   │   │   │   └── Table.module.css
│   │   │   │   ├── Form/
│   │   │   │   │   ├── FormField.tsx
│   │   │   │   │   └── FormField.module.css
│   │   │   │   ├── Card/
│   │   │   │   │   ├── Card.tsx
│   │   │   │   │   └── Card.module.css
│   │   │   │   ├── Loading/
│   │   │   │   │   ├── Spinner.tsx
│   │   │   │   │   └── Spinner.module.css
│   │   │   │   └── Toast/
│   │   │   │       ├── Toast.tsx
│   │   │   │       └── Toast.module.css
│   │   │   │
│   │   │   └── features/              # Feature-specific components
│   │   │       ├── hegeringe/
│   │   │       │   ├── HegeringeList.tsx
│   │   │       │   ├── HegeringeForm.tsx
│   │   │       │   ├── HegeringeDetail.tsx
│   │   │       │   └── hegeringe.module.css
│   │   │       ├── reviere/
│   │   │       │   ├── RievereList.tsx
│   │   │       │   ├── RievereForm.tsx
│   │   │       │   ├── RievereDetail.tsx
│   │   │       │   └── reviere.module.css
│   │   │       ├── jaeger/
│   │   │       │   ├── JaegerList.tsx
│   │   │       │   ├── JaegerForm.tsx
│   │   │       │   ├── JaegerDetail.tsx
│   │   │       │   └── jaeger.module.css
│   │   │       ├── paechter/
│   │   │       │   ├── PaechterList.tsx
│   │   │       │   ├── PaechterForm.tsx
│   │   │       │   └── paechter.module.css
│   │   │       └── mitjaeger/
│   │   │           ├── MitjaegerList.tsx
│   │   │           ├── MitjaegerForm.tsx
│   │   │           └── mitjaeger.module.css
│   │   │
│   │   ├── pages/                     # Page components (routing)
│   │   │   ├── Dashboard.tsx
│   │   │   ├── HegeringePage.tsx
│   │   │   ├── RevierePage.tsx
│   │   │   ├── JaegerPage.tsx
│   │   │   ├── PaechterPage.tsx
│   │   │   ├── MitjaegerPage.tsx
│   │   │   ├── ReportsPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   │
│   │   ├── hooks/                     # Custom React hooks
│   │   │   ├── useFetch.ts            # Data fetching hook
│   │   │   ├── useForm.ts             # Form state management hook
│   │   │   ├── useAuth.ts             # Authentication hook
│   │   │   ├── useToast.ts            # Toast notifications hook
│   │   │   └── useTable.ts            # Table pagination/sorting hook
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts                 # API client setup (axios/fetch)
│   │   │   ├── hegeringe.service.ts   # Hegeringe API calls
│   │   │   ├── reviere.service.ts     # Reviere API calls
│   │   │   ├── jaeger.service.ts      # Jaeger API calls
│   │   │   ├── paechter.service.ts    # Paechter API calls
│   │   │   ├── mitjaeger.service.ts   # Mitjäger API calls
│   │   │   ├── auth.service.ts        # Authentication API calls
│   │   │   └── storage.service.ts     # Local storage management
│   │   │
│   │   ├── store/                     # State management (Zustand/Redux)
│   │   │   ├── index.ts
│   │   │   ├── slices/
│   │   │   │   ├── hegeringe.slice.ts
│   │   │   │   ├── reviere.slice.ts
│   │   │   │   ├── jaeger.slice.ts
│   │   │   │   ├── paechter.slice.ts
│   │   │   │   ├── mitjaeger.slice.ts
│   │   │   │   ├── ui.slice.ts
│   │   │   │   └── auth.slice.ts
│   │   │   └── selectors/             # Memoized state selectors
│   │   │       ├── hegeringe.selectors.ts
│   │   │       ├── reviere.selectors.ts
│   │   │       └── ...
│   │   │
│   │   ├── types/
│   │   │   ├── models.ts              # TypeScript models
│   │   │   ├── api.ts                 # API request/response types
│   │   │   └── ui.ts                  # UI component types
│   │   │
│   │   ├── utils/
│   │   │   ├── formatters.ts          # Data formatting utilities
│   │   │   ├── validators.ts          # Form validation rules
│   │   │   ├── constants.ts           # Application constants
│   │   │   ├── dateUtils.ts           # Date manipulation
│   │   │   └── permissions.ts         # Permission/role checking
│   │   │
│   │   ├── styles/
│   │   │   ├── global.css             # Global styles
│   │   │   ├── variables.css          # CSS variables (colors, spacing, etc)
│   │   │   ├── reset.css              # Browser reset
│   │   │   └── utilities.css          # Utility classes
│   │   │
│   │   ├── App.tsx                    # Root component
│   │   └── Router.tsx                 # Route configuration
│   │
│   └── tests/
│       ├── unit/
│       ├── integration/
│       └── fixtures/
│
├── SHARED/                            # Shared code between frontend and backend
│   ├── types/
│   │   ├── models.ts                  # Shared TypeScript interfaces
│   │   ├── api.ts                     # API contract types
│   │   └── validation.ts              # Shared validation schemas
│   │
│   ├── constants/
│   │   ├── errors.ts                  # Error codes and messages
│   │   ├── validation.ts              # Validation rules
│   │   └── enums.ts                   # Enum definitions
│   │
│   └── utils/
│       ├── dateUtils.ts               # Shared date utilities
│       └── formatters.ts              # Shared formatting functions
│
└── DOCS/
    ├── API.md                         # API documentation
    ├── SETUP.md                       # Setup and installation guide
    ├── ARCHITECTURE.md                # Architecture documentation
    ├── CONTRIBUTING.md                # Contribution guidelines
    └── DATABASE.md                    # Database documentation

```

## Architektur-Übersicht

### Backend-Architektur (Node.js/Express/TypeScript)

**Layer-Pattern:**
```
Routes → Controller → Service → Repository → Database
           ↓
       Middleware (Validation, Auth, Error Handling)
```

### Frontend-Architektur (React/TypeScript)

**Component-Pattern:**
```
Pages → Features → Common Components
  ↓
Hooks & Services
  ↓
State Store (Zustand)
  ↓
API Services
```

## Modularisierungsstrategie

### Backend-Module

Jedes Backend-Modul folgt diesem Standard:

1. **Controller** - HTTP Request Handling
2. **Service** - Business Logic
3. **Repository** - Database Access (mit Query Builder)
4. **Validation** - Input Validation (Zod/Joi)
5. **Routes** - Endpoint Definition
6. **Tests** - Unit & Integration Tests

**Beispiel: Jaeger Modul**
- `jaeger.controller.ts` → Handles HTTP requests
- `jaeger.service.ts` → Core business logic
- `jaeger.repository.ts` → DB queries (reusable)
- `jaeger.validation.ts` → Input schema validation
- `jaeger.routes.ts` → Express route definitions

### Frontend-Module

**Features-Folder** für Domain-driven Development:
- `features/hegeringe/` - All hegeringe-related components
- `features/reviere/` - All reviere-related components
- `features/jaeger/` - All jaeger-related components

**Common Components** - Wiederverwendbare UI-Elemente:
- Button, Modal, Table, Form, Card, etc.

## Dateibenennungs-Konventionen

### Backend
- `*.controller.ts` - HTTP handler
- `*.service.ts` - Business logic
- `*.repository.ts` - Database operations
- `*.validation.ts` - Input validation
- `*.routes.ts` - Route definitions
- `*.test.ts` - Tests

### Frontend
- `*.tsx` - React components
- `*.ts` - TypeScript/logic files
- `*.module.css` - Component-scoped styles
- `*.service.ts` - API services
- `*.slice.ts` - State management slices
- `*.test.tsx` - Component tests

## Erweiterungspunkte

Diese Struktur ermöglicht einfaches Hinzufügen von Features:

1. **Neue Entity hinzufügen:**
   - Backend: `src/modules/new-entity/` with standard pattern
   - Frontend: `src/components/features/new-entity/` with components
   - Update: `src/services/new-entity.service.ts`
   - Update: `src/store/slices/new-entity.slice.ts`

2. **Neue Route/Page:**
   - Neue Datei in `src/pages/`
   - Update `Router.tsx`
   - Neue Feature-Components automatisch verfügbar

3. **Neue API-Endpoint:**
   - Backend: Neue Methode in entsprechender `.service.ts`
   - Backend: Neue Route in entsprechender `.routes.ts`
   - Frontend: Neue Methode in entsprechender `.service.ts`

## Abhängigkeiten (npm packages)

### Backend
```json
{
  "express": "^4.x",
  "pg": "^8.x",
  "typescript": "^5.x",
  "zod": "^3.x",
  "dotenv": "^16.x",
  "cors": "^2.x",
  "helmet": "^7.x",
  "winston": "^3.x",
  "jest": "^29.x",
  "supertest": "^6.x"
}
```

### Frontend
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-router-dom": "^6.x",
  "zustand": "^4.x",
  "axios": "^1.x",
  "typescript": "^5.x",
  "vite": "^5.x",
  "tailwindcss": "^3.x",
  "vitest": "^1.x"
}
```

## Nächste Schritte

1. Erstelle die Ordnerstruktur
2. Initialisiere Package.json für Backend und Frontend
3. Erstelle die Base-Services und Repositories
4. Implementiere Standard-Middleware und Error Handling
5. Erstelle erste Module (Hegeringe, Jaeger)
6. Baue Dashboard und Navigation
7. Implementiere Authentication/Authorization
