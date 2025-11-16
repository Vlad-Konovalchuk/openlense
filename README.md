# OpenLense

**Universal Open Data Aggregator** — A full-stack application for dynamically querying and filtering data from multiple API sources with a unified interface.

## Overview

OpenLense allows users to:
- **Search** across multiple data sources (e.g., CoinMarketCap, AUTO.RIA, OLX)
- **Filter** results with type-safe operators (equals, contains, regex, range comparisons, etc.)
- **Manage** data sources and their configurations via an admin panel
- **Extend** with new API sources without code changes

## Tech Stack

### Backend
- **FastAPI** — Async Python web framework
- **SQLite/PostgreSQL** — Data persistence
- **Pydantic** — Request/response validation
- **JMESPath** — Flexible field extraction from nested API responses
- **SQLModel/SQLAlchemy** — ORM

### Frontend
- **React 19** — UI library
- **TypeScript** — Type safety
- **TanStack Router** — File-based routing
- **TanStack React Query** — Server state management
- **React Hook Form** — Form state & validation
- **Material-UI** — Component library
- **TailwindCSS** — Styling
- **Zod** — Schema validation

## Project Structure

```
openlense/
├── apps/
│   ├── backend/              # FastAPI application
│   │   ├── src/
│   │   │   ├── main.py       # FastAPI app entry
│   │   │   ├── types.py      # Pydantic models (QueryParamDescriptor, FilterDescriptor)
│   │   │   ├── routers/      # API endpoints (search, sources, filters)
│   │   │   ├── services/     # Business logic (SearchService, SourceService)
│   │   │   ├── db/           # Database models & connection
│   │   │   ├── utils/        # Utilities (filtering_engine, request_builder, data.py)
│   │   │   └── core/         # Core configs & constants
│   │   ├── tests/            # Unit & integration tests
│   │   ├── seeds/            # Database seed data (e.g., CoinMarketCap)
│   │   ├── pyproject.toml    # Poetry dependencies
│   │   └── Dockerfile
│   │
│   └── frontend/             # React + TypeScript application
│       ├── src/
│       │   ├── routes/       # Page components (search, admin, knowledge-base)
│       │   ├── components/   # Reusable UI components
│       │   ├── services/     # API client & hooks (useSearch, useSourcesList, useInternalFilters)
│       │   ├── types/        # TypeScript types & Zod schemas
│       │   ├── utils/        # Helpers (errorFormatter, etc.)
│       │   └── validation/   # Form validation schemas
│       ├── package.json
│       ├── tsconfig.json
│       ├── tailwind.config.ts
│       └── Dockerfile
│
├── docs/
│   ├── be-spec.md           # Backend specification
│   ├── fe-spec.md           # Frontend specification
│   └── ARCHITECTURE.md      # System architecture diagrams
│
├── scripts/
│   ├── backend.sh           # Backend startup script
│   ├── frontend.sh          # Frontend startup script
│   └── start.sh             # Full-stack startup with GNU Screen
│
├── docker-compose.yml       # Multi-container setup
└── start.sh                 # Main entry point
```

## Key Features

### 1. **Dynamic Data Source Management**
- Define API endpoints, HTTP methods, authentication, pagination
- Configure field mappings via JMESPath for nested data extraction
- Store in database for runtime flexibility

### 2. **Advanced Filtering**
- **Field Types:** string, number, boolean, select
- **Operators:** eq, neq, contains, startswith, endswith, regex, gt, gte, lt, lte
- **Type-Safe:** Operators validated per field type
- **Backend Filtering:** Applied server-side for consistency

### 3. **API Filters (User Input)**
- Defined per source as `QueryParamDescriptor` objects
- Map to HTTP query parameters
- Support required/optional, defaults, dropdown options

### 4. **Backend Filters (Server-Side)**
- Defined per source as `FilterDescriptor` objects
- Applied after data fetch for consistency
- Support custom operator selection per field

### 5. **Admin Panel**
- Add/edit/delete data sources
- Form + JSON view for flexibility
- Real-time operator catalog from backend

## Quick Start

### Prerequisites
- **Node.js** 18+ & pnpm
- **Python** 3.13+
- **Poetry** (or venv)
- **GNU Screen** (for multi-window startup)

### Setup & Run

<!-- #### Option 0: Full Stack (Recommended) WIP
```bash
# Clone and navigate
git clone <repo>
cd openlense

# Start both frontend & backend with GNU Screen
chmod +x start.sh
./start.sh
``` -->
<!-- 
**Keyboard shortcuts:**
- `Ctrl+A then 0` — Frontend window
- `Ctrl+A then 1` — Backend window
- `Ctrl+A then d` — Detach (keep running)
- `screen -r openlense` — Reattach later -->

#### Option 1: Backend Only
```bash
cd apps/backend

# Install dependencies
poetry install

# Run dev server
poetry run uvicorn src.main:app --reload

# API available at http://localhost:8000
# Docs at http://localhost:8000/docs
```

#### Option 2: Frontend Only
```bash
cd apps/frontend

# Install dependencies
pnpm install

# Run dev server
pnpm run dev

# App available at http://localhost:3000
```
<!-- 
#### Option 4: Docker Compose WIP
```bash
docker-compose up -d
# Backend: http://localhost:8000
# Frontend: http://localhost:3000
``` -->

## API Endpoints

### Sources
- `GET /api/sources` — List all sources
- `GET /api/sources/{id}` — Get source config
- `POST /api/sources` — Create source
- `PATCH /api/sources/{id}` — Update source
- `DELETE /api/sources/{id}` — Delete source

### Search
- `POST /api/search/{source_id}` — Search with filters
  - Body: `{ "api_filters": {...}, "default_filters": {...} }`
  - Returns: `{ "results": [...] }`

### Filters
- `GET /api/filters/` — Get all operator catalogs by field type
  - Returns: `{ "string": [{label, operators}, ...], "number": [...], ... }`

### Health
- `GET /health` — Health check

## Data Flow

```
User Search (Frontend)
    ↓
POST /api/search/{source_id} with filters
    ↓
Backend: Load Source Config
    ↓
Build External API Request (auth, headers, query params)
    ↓
Fetch from External API
    ↓
Apply Backend Filters (JMESPath + operators)
    ↓
Map Fields (JMESPath extraction)
    ↓
Return Unified Results
    ↓
Display in UI
```

## Configuration

### Environment Variables

**Backend** (`.env` in `apps/backend`):
```
DATABASE_URL=postgresql://user:password@localhost:5432/openlense
CMC_API_KEY=<your-coinmarketcap-api-key>
```

**Frontend** (`.env` in `apps/frontend`):
```
VITE_API_URL=http://localhost:8000
```

## Testing

### Backend
```bash
cd apps/backend

# Run all tests
pytest

# Run with coverage
pytest --cov=src

# Watch mode
pytest-watch
```

### Frontend
```bash
cd apps/frontend

# Run linter
pnpm run lint

# Fix formatting
pnpm run lint:fix

# Format check
pnpm run format:check
```

## Development

### Backend Code Style
- **Linter:** Ruff
- **Formatter:** Black
- **Type Checker:** mypy

```bash
cd apps/backend
ruff check --fix src
ruff format src
```

### Frontend Code Style
- **Linter:** ESLint
- **Formatter:** Prettier

```bash
cd apps/frontend
pnpm run lint:fix
pnpm run format
```

## Architecture Highlights

### Filtering Engine
- Operator registry with type safety
- JMESPath for flexible field mapping
- Cached operator catalogs for performance
- Readable debug logging

### Service Layer
- `SearchService` — Fetch & process external data
- `SourceService` — CRUD operations
- `RequestBuilder` — Construct HTTP requests
- Clean separation of concerns

### Type Safety
- Pydantic models for all requests/responses
- Zod schemas on frontend
- Literal types for operators and field types

## Troubleshooting
WIP
## License

MIT