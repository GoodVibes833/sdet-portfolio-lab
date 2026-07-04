# sdet-portfolio-lab

A production-grade SDET portfolio monorepo. Contains both the product under test and the full test suite — mirroring the real-world SDET workflow where source and tests evolve together.

## Architecture

```
sdet-portfolio-lab/
├── apps/
│   ├── whatodo/                # [Product] WhatToDo app — Next.js + Supabase + Leaflet
│   │                           #   Explore activities, map view, auth, missions
│   └── target-server/          # [Test Target] Fault-injection API — Node.js + Express
│       ├── /health, /users, /products  # Clean CRUD endpoints
│       └── /fault/*            # Latency, error-rate, memory-leak, cpu-spike injection
├── tests/
│   ├── api/                    # [Phase 1 ✅] Jest + SuperTest → target-server
│   ├── e2e/                    # [Phase 2] Playwright → whatodo UI
│   ├── performance/            # [Phase 3] k6 → whatodo + target-server
│   └── contract/               # [Phase 4] Pact contract tests
├── monitoring/                 # [Phase 3] Prometheus + Grafana (Docker Compose)
└── .github/workflows/          # [Phase 4] CI/CD (PR-triggered)
```

## Tech Stack

| Layer | Tool | Why |
|-------|------|-----|
| API Testing | Jest + SuperTest | Industry standard; in-process import avoids network flakiness |
| E2E Testing | Playwright | Cross-browser; built-in auto-wait; modern Selenium alternative |
| Performance | k6 | JS-native scripts; cloud-ready; CI-friendly thresholds |
| Contract | Pact | Consumer-driven; decouples service team deployments |
| Observability | Prometheus + Grafana | De facto metrics stack; correlate load test results |
| CI/CD | GitHub Actions | Native PR integration; matrix strategy for parallel jobs |

## Quick Start

```bash
# Install all workspace dependencies
npm install

# Start the WhatToDo app (http://localhost:3000)
npm run dev:whatodo

# Start the fault-injection target server (http://localhost:3001)
npm run dev:target

# Run API tests (Phase 1 — target-server)
npm run test:api

# Run E2E tests (Phase 2 — whatodo)
npm run test:e2e

# Run performance tests (Phase 3)
npm run test:perf
```

## Target Server Endpoints

### Health
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness check |
| GET | `/health/detailed` | Readiness check with memory stats |

### Users CRUD
| Method | Path | Description |
|--------|------|-------------|
| GET | `/users` | List users (`?limit`, `?offset`) |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create user (`name`, `email`, `role`) |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

### Products CRUD
| Method | Path | Description |
|--------|------|-------------|
| GET | `/products` | List products (`?category`, `?minPrice`, `?maxPrice`) |
| GET | `/products/:id` | Get product by ID |
| POST | `/products` | Create product (`name`, `price`, `category`, `stock`) |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |

### Fault Injection
| Method | Path | Description |
|--------|------|-------------|
| GET | `/fault/slow` | Artificial delay (`?delay=ms`, default 2000) |
| GET | `/fault/error-rate` | Random 500s (`?rate=0.0–1.0`, default 0.5) |
| GET | `/fault/memory-leak` | Allocates 1MB/request to heap |
| GET | `/fault/cpu-spike` | Fibonacci CPU pressure (`?n=`, default 40) |
| GET | `/fault/timeout` | Hangs indefinitely (`?duration=ms`) |

## Design Decisions

**Why in-memory store?** Eliminates DB setup overhead for portfolio demos. The `reset()` helper enables deterministic test isolation without mocking.

**Why SuperTest with direct app import?** Avoids starting a real HTTP server—faster CI, no port conflicts, and the test imports the same Express app object that production uses.

**Why separate `app.js` from `index.js`?** The app factory pattern lets tests import `app.js` without side-effect (no `listen()`). `index.js` only starts the server in production.

**Why fault endpoints?** Real SDET work involves testing how systems behave under degraded conditions. These endpoints let performance and resilience tests run without infrastructure dependencies.

## Phases

| Phase | Status | Contents |
|-------|--------|----------|
| 1 | ✅ Complete | target-server + API tests (Jest + SuperTest) |
| 2 | 🔜 Planned | Playwright E2E (admin dashboard UI) |
| 3 | 🔜 Planned | k6 performance tests + Prometheus/Grafana |
| 4 | 🔜 Planned | GitHub Actions CI/CD pipeline |
