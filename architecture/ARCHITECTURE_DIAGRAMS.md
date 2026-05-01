# Waidblick - Architecture & Data Flow

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT BROWSER                                     │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     FRONTEND (React + TypeScript)                   │    │
│  │                                                                      │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │    │
│  │  │    Pages     │  │  Components  │  │  State Management        │ │    │
│  │  │  - Dashboard │  │  - Common    │  │  (Zustand)               │ │    │
│  │  │  - Jaeger    │  │  - Features  │  │  - Store Slices         │ │    │
│  │  │  - Revier    │  │  - Layout    │  │  - Selectors            │ │    │
│  │  │  - etc.      │  │              │  │                          │ │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘ │    │
│  │         │                 │                     │                   │    │
│  │         └─────────────────┼─────────────────────┘                   │    │
│  │                           │                                         │    │
│  │                    ┌──────▼───────┐                                 │    │
│  │                    │   Services   │                                 │    │
│  │                    │  - API calls │                                 │    │
│  │                    │  - Data prep │                                 │    │
│  │                    └──────┬───────┘                                 │    │
│  └────────────────────────────┼─────────────────────────────────────────┘   │
│                               │                                              │
│                               │ HTTP/REST                                    │
│                               │                                              │
└───────────────────────────────┼──────────────────────────────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │   CORS Enabled        │
                    │   API Gateway         │
                    └───────────┬───────────┘
                                │
┌───────────────────────────────┼──────────────────────────────────────────────┐
│                               │                                              │
│                               │                                              │
│  ┌────────────────────────────▼────────────────────────────────────────┐    │
│  │              BACKEND (Node.js/Express + TypeScript)                 │    │
│  │                                                                      │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │                    API Routes                               │   │    │
│  │  │  /api/jaeger    /api/reviere    /api/paechter  /api/etc     │   │    │
│  │  └──────────────────────────────┬──────────────────────────────┘   │    │
│  │                                 │                                   │    │
│  │  ┌──────────────────────────────▼──────────────────────────────┐   │    │
│  │  │                  Middleware Layer                           │   │    │
│  │  │  - Authentication    - CORS        - Error Handling        │   │    │
│  │  │  - Validation        - Logging     - Rate Limiting         │   │    │
│  │  └──────────────────────────────┬──────────────────────────────┘   │    │
│  │                                 │                                   │    │
│  │  ┌──────────────────────────────▼──────────────────────────────┐   │    │
│  │  │              Module Controllers (5 modules)                │   │    │
│  │  │  ┌─────────────┬──────────┬──────────┬─────────────────┐  │   │    │
│  │  │  │  Jaeger     │ Reviere  │ Hegeringe│ Paechter/      │  │   │    │
│  │  │  │ Controller  │ Ctrl     │ Ctrl     │ Mitjäger Ctrl  │  │   │    │
│  │  │  └─────────────┴──────────┴──────────┴─────────────────┘  │   │    │
│  │  └──────────────────────────────┬──────────────────────────────┘   │    │
│  │                                 │                                   │    │
│  │  ┌──────────────────────────────▼──────────────────────────────┐   │    │
│  │  │                Services (Business Logic)                   │   │    │
│  │  │  ┌─────────────┬──────────┬──────────┬─────────────────┐  │   │    │
│  │  │  │  Jaeger     │ Reviere  │ Hegeringe│ Paechter/      │  │   │    │
│  │  │  │ Service     │ Service  │ Service  │ Mitjäger Serv. │  │   │    │
│  │  │  └─────────────┴──────────┴──────────┴─────────────────┘  │   │    │
│  │  └──────────────────────────────┬──────────────────────────────┘   │    │
│  │                                 │                                   │    │
│  │  ┌──────────────────────────────▼──────────────────────────────┐   │    │
│  │  │             Repository (Data Access Layer)                │   │    │
│  │  │  ┌─────────────┬──────────┬──────────┬─────────────────┐  │   │    │
│  │  │  │  Jaeger     │ Reviere  │ Hegeringe│ Paechter/      │  │   │    │
│  │  │  │ Repository  │ Repo     │ Repo     │ Mitjäger Repo  │  │   │    │
│  │  │  └─────────────┴──────────┴──────────┴─────────────────┘  │   │    │
│  │  └──────────────────────────────┬──────────────────────────────┘   │    │
│  └────────────────────────────────┼──────────────────────────────────┘    │
│                                   │                                       │
│                                   │ SQL Queries                            │
│                                   │                                       │
└───────────────────────────────────┼───────────────────────────────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │     PostgreSQL Database       │
                    │                               │
                    │  - hegeringe                  │
                    │  - reviere                    │
                    │  - jaeger                     │
                    │  - paechter                   │
                    │  - mitjaeger                  │
                    │                               │
                    │  Views:                       │
                    │  - v_paechter_pro_revier      │
                    │  - v_mitjaeger_pro_revier     │
                    │  - v_reviere_statistik        │
                    │  - v_jaeger_reviere           │
                    │                               │
                    │  Indexes:                     │
                    │  - idx_reviere_hegering       │
                    │  - idx_jaeger_name            │
                    │  - etc.                       │
                    └───────────────────────────────┘
```

---

## Request-Response Flow

### Create New Jaeger (Hunter) Flow

```
USER INTERACTION
      │
      ▼
┌──────────────────────┐
│ JaegerForm Component │ (Frontend)
│ - Input validation   │
│ - Form submission    │
└──────────┬───────────┘
           │
           │ Form Data
           │
           ▼
┌──────────────────────┐
│ useJaeger Hook       │ (Frontend)
│ - Calls service      │
└──────────┬───────────┘
           │
           │ API Request
           │
           ▼
┌──────────────────────┐
│ jaegerService        │ (Frontend)
│ - POST /api/jaeger   │
└──────────┬───────────┘
           │
           │ HTTP POST
           │ {vorname, nachname, email, ...}
           │
           ▼
┌──────────────────────┐
│ Express Server       │ (Backend)
│ Router               │
└──────────┬───────────┘
           │
           │
           ▼
┌──────────────────────┐
│ Middleware Stack     │ (Backend)
│ 1. CORS              │
│ 2. Body Parser       │
│ 3. Authentication    │
│ 4. Validation        │
└──────────┬───────────┘
           │
           │
           ▼
┌──────────────────────┐
│ JaegerController     │ (Backend)
│ createJaeger()       │
│ - Validates input    │
│ - Calls service      │
└──────────┬───────────┘
           │
           │
           ▼
┌──────────────────────┐
│ JaegerService        │ (Backend)
│ createJaeger()       │
│ - Business logic     │
│ - Email check        │
│ - Data transformation│
│ - Calls repository   │
└──────────┬───────────┘
           │
           │
           ▼
┌──────────────────────┐
│ JaegerRepository     │ (Backend)
│ create()             │
│ - Builds SQL         │
│ - Executes query     │
└──────────┬───────────┘
           │
           │ SQL INSERT
           │
           ▼
┌──────────────────────┐
│ PostgreSQL Database  │
│ INSERT INTO jaeger   │
│ VALUES (...)         │
│ RETURNING *          │
└──────────┬───────────┘
           │
           │ New Row
           │
           ▼
┌──────────────────────┐
│ JaegerRepository     │ (Backend)
│ Returns Jaeger obj   │
└──────────┬───────────┘
           │
           │
           ▼
┌──────────────────────┐
│ JaegerService        │ (Backend)
│ Returns Jaeger obj   │
└──────────┬───────────┘
           │
           │
           ▼
┌──────────────────────┐
│ JaegerController     │ (Backend)
│ sendSuccess()        │
│ - Formats response   │
│ - HTTP 201           │
└──────────┬───────────┘
           │
           │ HTTP Response
           │ {success: true, data: {id, vorname, ...}}
           │
           ▼
┌──────────────────────┐
│ jaegerService        │ (Frontend)
│ Returns Jaeger       │
└──────────┬───────────┘
           │
           │
           ▼
┌──────────────────────┐
│ useJaegerStore       │ (Frontend)
│ - Updates state      │
│ - createJaeger()     │
└──────────┬───────────┘
           │
           │
           ▼
┌──────────────────────┐
│ React Re-render      │ (Frontend)
│ - JaegerList         │
│ - Shows toast        │
│ - Closes modal       │
└──────────┬───────────┘
           │
           ▼
    USER SEES RESULT
```

---

## Data Flow in Module

### Example: Jaeger (Hunter) Module

```
┌─────────────────────────────────────────────────────────────────────┐
│                         JAEGER MODULE                               │
│                                                                      │
│  FRONTEND                           BACKEND                         │
│  ═══════════════════════════════════════════════════════════════   │
│                                                                      │
│  Components                         Routes                          │
│  ├─ JaegerList                      └─ /api/jaeger/*               │
│  ├─ JaegerForm                          │                           │
│  └─ JaegerDetail                        ▼                           │
│         │                           Controllers                      │
│         │                           ├─ getAllJaeger()              │
│         │                           ├─ getJaegerById()             │
│         │                           ├─ createJaeger()              │
│         │                           ├─ updateJaeger()              │
│         │                           └─ deleteJaeger()              │
│         │                                │                          │
│    Services                             ▼                           │
│    └─ jaegerService                 Services                        │
│        ├─ getAll()                  ├─ getAllJaeger()              │
│        ├─ getById()                 ├─ getJaegerById()             │
│        ├─ create()                  ├─ createJaeger()              │
│        ├─ update()                  ├─ updateJaeger()              │
│        ├─ delete()                  └─ deactivateJaeger()          │
│        └─ search()                      │                           │
│        │                               ▼                            │
│    Store (Zustand)                 Validation                       │
│    └─ useJaegerStore               └─ Zod Schemas                  │
│        ├─ jaeger[]                     ├─ createJaegerSchema       │
│        ├─ selectedJaeger               ├─ updateJaegerSchema       │
│        ├─ loading                      └─ Input validation          │
│        ├─ error                            │                        │
│        └─ Actions:                        ▼                        │
│           ├─ fetchAllJaeger()         Repositories                 │
│           ├─ fetchJaegerById()        └─ JaegerRepository         │
│           ├─ createJaeger()               ├─ findAll()            │
│           ├─ updateJaeger()               ├─ findById()           │
│           └─ deleteJaeger()               ├─ findByEmail()        │
│        │                               ├─ create()                 │
│    Hooks                               ├─ update()                 │
│    └─ useJaeger()                      ├─ deactivate()             │
│        - Wraps store                   ├─ search()                 │
│        - Easy state access             └─ count()                  │
│        │                                    │                       │
│        └────────────────────────────────────┼───────────────────── │
│                                             ▼                       │
│                                    PostgreSQL DB                    │
│                                    ├─ SELECT                        │
│                                    ├─ INSERT                        │
│                                    ├─ UPDATE                        │
│                                    └─ DELETE                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Database Relationships

```
                    ┌──────────────────┐
                    │  HEGERINGE       │
                    │  (Game Circles)  │
                    │                  │
                    │ - hegering_id    │◄────────────┐
                    │ - name (unique)  │             │
                    │ - beschreibung   │             │
                    │ - kontakt_*      │             │
                    └────────────┬─────┘             │
                                 │ 1:N              │
                                 │                  │
                    ┌────────────▼─────────────┐   │
                    │  REVIERE                 │   │
                    │  (Game Territories)      │   │
                    │                          │   │
                    │ - revier_id              │   │
                    │ - hegering_id ───────────┘   │
                    │ - name (unique per hegering) │
                    │ - groesse_ha                 │
                    │ - revier_typ                 │
                    │ - lage_gps_*                 │
                    └──────┬──────────────┬────────┘
                           │              │
                      1:N  │              │  1:N
                           │              │
        ┌──────────────────▼──┐  ┌────────▼───────────────┐
        │  PAECHTER            │  │  MITJAEGER             │
        │  (Lessees/Primary)   │  │  (Additional Hunters)  │
        │                      │  │                        │
        │ - paechter_id        │  │ - mitjaeger_id         │
        │ - jaeger_id ─────────┼──┼──► jaeger_id           │
        │ - revier_id          │  │ - revier_id            │
        │ - rolle              │  │ - zuteilung_*          │
        │ - pacht_*            │  │ - genehmigt_durch      │
        └──────────┬───────────┘  └────────┬────────────────┘
                   │                       │
                   │ N:M                   │ N:M
                   │                       │
                   └───────┬───────────────┘
                           │
                    ┌──────▼───────┐
                    │  JAEGER      │
                    │  (Hunters)   │
                    │              │
                    │ - jaeger_id  │
                    │ - vorname    │
                    │ - nachname   │
                    │ - email      │
                    │ - telefon    │
                    │ - adresse    │
                    │ - jagdschein_*
                    │ - haftpflicht_*
                    │ - aktiv      │
                    │ - created_at │
                    │ - updated_at │
                    └──────────────┘
```

---

## Module Dependency Graph

```
                    API Routes
                        │
        ┌───────────────┼───────────────┬──────────────┐
        │               │               │              │
        ▼               ▼               ▼              ▼
    JaegerRoutes  RevierRoutes  HegeringeRoutes  PaechterRoutes
        │               │               │              │
        ▼               ▼               ▼              ▼
    JaegerCtrl   RevierCtrl   HegeringeCtrl   PaechterCtrl
        │               │               │              │
        ▼               ▼               ▼              ▼
    JaegerSvc    RevierSvc    HegeringeSvc    PaechterSvc
        │               │               │              │
        └───────────────┼───────────────┴──────────────┘
                        │
                        ▼
            Shared Validation & Utils
                        │
                        ▼
            JaegerRepo, RevierRepo, etc.
                        │
                        ▼
                  Database Client
                        │
                        ▼
                  PostgreSQL Database
```

---

## Authentication Flow (Future)

```
LOGIN FLOW
══════════

1. User submits credentials
   └─► Frontend Form

2. POST /api/auth/login
   └─► Backend Auth Controller
       └─► AuthService.login()
           ├─ Verify credentials
           ├─ Check if user exists
           └─► Return JWT + Refresh Token

3. Store tokens
   └─► Frontend localStorage/sessionStorage

4. API Requests
   └─ Include JWT in Authorization header
      Header: "Authorization: Bearer <JWT>"

5. Backend Validation
   └─ JWT Middleware
      ├─ Verify token
      ├─ Extract user info
      └─ Continue to route handler

6. Logout
   └─ Clear tokens from frontend
```

---

## State Flow in Frontend (Zustand)

```
User Action (e.g., click "Add Hunter")
         │
         ▼
Component Handler
  └─► calls useJaeger().create(data)
         │
         ▼
Zustand Store Action
  └─► createJaeger()
      ├─ Set loading = true
      ├─ Call API service
      │  └─► POST /api/jaeger
      │      ├─ On success:
      │      │  ├─ Add to jaeger[]
      │      │  ├─ Set loading = false
      │      │  └─ Component re-renders
      │      │
      │      └─ On error:
      │         ├─ Set error message
      │         ├─ Set loading = false
      │         └─ Component shows error
      │
      └─ Component subscribes to state changes
         └─ Only re-renders when relevant state changes
```

---

## Performance Optimizations

### Database
- Indexes on frequently queried columns
- Views for complex queries
- Connection pooling
- Query result caching (future)

### Backend
- Pagination for large result sets
- Field selection (only needed fields)
- Middleware caching
- Compression

### Frontend
- Component memoization (React.memo)
- Zustand granular subscriptions
- Code splitting by route
- Lazy loading of images
- Virtual scrolling for large lists

---

## Error Handling Flow

```
ERROR OCCURS
     │
     ▼
Repository/Service
     │
     ├─ Catches error
     ├─ Logs error
     └─► Throws custom AppError
            │
            ▼
Controller
     │
     ├─ Catches error
     └─► Passes to error middleware
            │
            ▼
Error Middleware
     │
     ├─ Formats error response
     ├─ Sets HTTP status code
     ├─ Logs to logger
     └─► Sends to Frontend
            │
            ▼
Frontend Service
     │
     ├─ Catches HTTP error
     └─► Throws error
            │
            ▼
Component/Store
     │
     ├─ Catches error
     ├─ Sets error state
     ├─ Shows toast/modal
     └─► User sees error message
```

---

## Deployment Architecture (Future)

```
                        ┌──────────────┐
                        │  Git Repo    │
                        │  (GitHub)    │
                        └────────┬─────┘
                                 │
                                 │ Push to main
                                 │
                        ┌────────▼─────────┐
                        │   CI/CD Pipeline  │
                        │   (GitHub Actions)│
                        │                   │
                        │ 1. Run tests      │
                        │ 2. Build frontend │
                        │ 3. Build backend  │
                        │ 4. Push to Docker │
                        └────────┬──────────┘
                                 │
                        ┌────────▼──────────┐
                        │  Docker Registry  │
                        │  (Docker Hub/ECR) │
                        └────────┬──────────┘
                                 │
                        ┌────────▼────────────┐
                        │  Deployment Env    │
                        │                    │
                        │ ┌────────────────┐ │
                        │ │ Frontend (S3)  │ │
                        │ │ + CloudFront   │ │
                        │ └────────────────┘ │
                        │                    │
                        │ ┌────────────────┐ │
                        │ │ Backend (ECS)  │ │
                        │ │ Container      │ │
                        │ └────────────────┘ │
                        │                    │
                        │ ┌────────────────┐ │
                        │ │ RDS Database   │ │
                        │ │ (PostgreSQL)   │ │
                        │ └────────────────┘ │
                        │                    │
                        └────────────────────┘
```

---

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Scalability and modularity
- ✅ Type safety with TypeScript
- ✅ Testability at each layer
- ✅ Performance optimizations
- ✅ Easy feature addition
- ✅ Production-ready structure
