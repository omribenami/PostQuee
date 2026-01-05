# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Postiz is an open-source AI social media scheduling tool that supports multiple platforms (Instagram, YouTube, LinkedIn, X/Twitter, Facebook, TikTok, Reddit, Discord, Slack, Mastodon, Bluesky, and more). It provides scheduling, analytics, marketplace features, and AI-powered content generation.

**Tech Stack:**
- Monorepo architecture managed by pnpm workspaces
- Backend: NestJS with Prisma ORM (PostgreSQL)
- Frontend: Next.js 14 with React 18
- Queue/Cache: Redis with BullMQ
- Email: Resend
- Testing: Jest
- Node.js: >=22.12.0 <23.0.0
- Package Manager: pnpm 10.6.1

## Repository Structure

```
apps/
├── backend/       - NestJS REST API server (port 3000)
├── frontend/      - Next.js application (port 4200)
├── workers/       - BullMQ background job processors
├── cron/          - Scheduled task runners
├── extension/     - Browser extension (Vite + React)
├── commands/      - CLI commands
└── sdk/           - NodeJS SDK for public API

libraries/
├── nestjs-libraries/   - Shared NestJS modules (database, integrations, etc.)
├── react-shared-libraries/ - Shared React components and utilities
└── helpers/            - Shared utility functions
```

## Development Commands

### Setup & Installation
```bash
pnpm install                    # Install dependencies (also runs prisma-generate)
```

### Running Services
```bash
# Run all services in development
pnpm run dev                    # Runs backend, frontend, workers, cron, extension concurrently

# Run individual services
pnpm run dev:backend            # Backend API only
pnpm run dev:frontend           # Frontend only
pnpm run dev:workers            # Workers only
pnpm run dev:cron               # Cron only

# Production mode
pnpm run start:prod:backend
pnpm run start:prod:frontend
pnpm run start:prod:workers
pnpm run start:prod:cron

# PM2 (production process manager)
pnpm run pm2                    # Run all services with PM2 and tail logs
```

### Building
```bash
pnpm run build                  # Build all apps (frontend, backend, workers, cron)
pnpm run build:backend          # Build backend only
pnpm run build:frontend         # Build frontend only
pnpm run build:workers          # Build workers only
pnpm run build:cron             # Build cron only
pnpm run build:extension        # Build browser extension
```

### Database (Prisma)
```bash
pnpm run prisma-generate        # Generate Prisma client
pnpm run prisma-db-push         # Push schema changes to database
pnpm run prisma-db-pull         # Pull schema from database
pnpm run prisma-reset           # Reset database (WARNING: destructive)
```

**Important:** Prisma schema is located at `libraries/nestjs-libraries/src/database/prisma/schema.prisma`

### Testing
```bash
pnpm test                       # Run all tests with coverage
```

### Docker
```bash
pnpm run dev:docker             # Start PostgreSQL and Redis for local development
```

### Filtering to Specific Apps
Use pnpm's `--filter` flag to run commands for specific apps:
```bash
pnpm --filter ./apps/backend run dev
pnpm --filter ./apps/frontend run build
```

## Architecture Patterns

### Service Communication
- **Backend** (`apps/backend`): Main NestJS API server handling HTTP requests
- **Workers** (`apps/workers`): BullMQ microservice for background jobs (social media posting, processing)
- **Cron** (`apps/cron`): Scheduled tasks (e.g., triggering scheduled posts)
- Communication between backend and workers uses BullMQ queues via Redis

### Module Organization (NestJS)
- Backend uses modular architecture with guards, pipes, and filters
- `PoliciesGuard`: CASL-based authorization (apps/backend/services/auth/permissions/permissions.guard.ts)
- `ThrottlerBehindProxyGuard`: Rate limiting with proxy support
- Global exception filters: `SubscriptionExceptionFilter`, `HttpExceptionFilter`

### Shared Libraries Pattern
The monorepo uses shared libraries to avoid code duplication:

**nestjs-libraries/** contains:
- `database/`: Prisma client and database module
- `integrations/`: Social media platform integrations (20+ providers)
- `bull-mq-transport-new/`: Custom BullMQ transport strategy
- `dtos/`: Shared data transfer objects
- `openai/`: AI integration utilities
- `redis/`: Redis client configuration
- `upload/`: File upload handling
- `videos/`: Video processing
- `chat/`: Chat/MCP (Model Context Protocol) integration
- `agent/`: AI agent functionality
- `3rdparties/`: Third-party service integrations (Make.com, N8N)
- `newsletter/`: Newsletter integrations
- `short-linking/`: URL shortening services (Dub, Short.io, Kutt, LinkDrip)
- `sentry/`: Error tracking and logging

**react-shared-libraries/** contains:
- Shared React components
- Translation utilities (i18next)
- Common helpers

**helpers/** contains:
- Framework-agnostic utilities
- Swagger configuration

### Frontend Architecture (Next.js)
- Uses App Router (Next.js 14)
- Route structure:
  - `(app)/`: Main application routes
  - `(app)/auth/`: Authentication pages (login, register, activate, forgot password)
  - `(app)/(site)/`: Protected app pages (analytics, launches, media, settings, billing, agents, plugs, third-party)
  - `(app)/(preview)/p/[id]/`: Preview page for posts
  - `(extension)/`: Extension-specific routes
- Styling: Tailwind CSS + SCSS modules
- State Management: Zustand, SWR for data fetching
- UI Libraries: Mantine, custom components

### Database Schema (Prisma)
Key models:
- `Organization`: Multi-tenant organization structure
- `User`: User accounts with OAuth support (provider-based)
- `Post`: Scheduled and published social media posts
- `Integration`: Social media account connections
- `Tags`: Post categorization
- `Subscription`: Payment/billing data (Stripe)
- `Media`: Uploaded media files
- `AutoPost`: AI-powered auto-posting configuration
- `Plugs`: Marketplace posts for buying/selling content
- `Webhooks`: Webhook configurations
- `Credits`: User credit system

All models use UUID primary keys and include `createdAt`/`updatedAt` timestamps.

### Environment Configuration
- Configuration reference: https://docs.postiz.com/configuration/reference
- Required variables: `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `FRONTEND_URL`, `NEXT_PUBLIC_BACKEND_URL`, `BACKEND_INTERNAL_URL`
- Storage: Supports both Cloudflare R2 and local file storage (controlled by `STORAGE_PROVIDER`)
- OAuth integrations require client ID/secret for each platform
- Payment processing: Stripe integration
- Email: Resend (optional, auto-activates users if not configured)
- AI features: OpenAI API key optional
- **IMPORTANT**: Always update `.env.example` when adding new environment variables

### Logging & Error Tracking
- Sentry integration for error tracking and logging
- Import pattern: `import * as Sentry from "@sentry/nextjs"`
- Enable logs: `Sentry.init({ enableLogs: true })`
- Logger usage: `const { logger } = Sentry`
- Structured logging examples:
  ```javascript
  logger.trace("Starting database connection", { database: "users" });
  logger.debug(logger.fmt`Cache miss for user: ${userId}`);
  logger.info("Updated profile", { profileId: 345 });
  logger.warn("Rate limit reached", { endpoint: "/api/results/" });
  logger.error("Failed to process payment", { orderId: "order_123" });
  logger.fatal("Database connection pool exhausted", { database: "users" });
  ```
- Use `logger.fmt` template literal for bringing variables into structured logs
- Console integration available: `Sentry.consoleLoggingIntegration({ levels: ["log", "error", "warn"] })`

## Development Conventions

### Git Commits
- Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, etc.
- Pull requests should include:
  - Clear descriptions
  - Related issue links
  - UI screenshots/GIFs for visual changes

### Code Style
- TypeScript throughout the codebase
- Complex logic requires comments
- Use class-transformer and class-validator for DTOs
- Swagger/OpenAPI documentation for API endpoints

### Import Aliases
The monorepo uses TypeScript path aliases:
- `@gitroom/backend/*` → `apps/backend/src/*`
- `@gitroom/nestjs-libraries/*` → `libraries/nestjs-libraries/src/*`
- `@gitroom/helpers/*` → `libraries/helpers/src/*`
- `@gitroom/react-shared-libraries/*` → `libraries/react-shared-libraries/src/*`

### Integration Points
- **Social Media APIs**: OAuth flows for 14+ platforms via `nestjs-libraries/integrations/`
- **Public API**: RESTful API with rate limiting (default 30 req/hour, configurable via `API_LIMIT`)
- **SDK**: NodeJS SDK published to npm (`@postiz/node`)
- **Automation**: N8N custom node, Make.com integration
- **Webhooks**: Event-driven integrations for third parties
- **Payment**: Stripe for subscriptions and marketplace (fee: 5% default via `FEE_AMOUNT`)

## Common Workflows

### Adding a New Social Media Integration
1. Create integration class in `libraries/nestjs-libraries/src/integrations/social/[platform]/`
2. Implement the social provider interface (posting, auth, profile fetching)
3. Add OAuth credentials to `.env.example` and documentation
4. Register provider in the integrations module
5. Add frontend UI components for connection flow
6. Update database schema if needed (new fields in `Integration` model)

### Adding a New API Endpoint
1. Create controller in `apps/backend/src/api/routes/`
2. Add to `api.module.ts` imports
3. Use DTOs from `libraries/nestjs-libraries/src/dtos/`
4. Apply guards: `@UseGuards(AuthGuard)`, `@CheckPolicies()`
5. Document with Swagger decorators: `@ApiOperation()`, `@ApiResponse()`

### Adding Background Jobs
1. Create worker processor in `apps/workers/src/app/`
2. Define job in BullMQ queue (name and payload structure)
3. Enqueue from backend using BullMQ client
4. Workers automatically process jobs from Redis queue

### Database Schema Changes
1. Modify `libraries/nestjs-libraries/src/database/prisma/schema.prisma`
2. Run `pnpm run prisma-db-push` to apply changes
3. Prisma client regenerates automatically via postinstall hook
4. Update related DTOs and types

## Testing
- Jest configuration uses NX workspace setup
- Coverage reports in `./reports/junit.xml`
- Test command: `pnpm test` (runs with `--detectOpenHandles` and coverage)

## Documentation
- Main docs: https://docs.postiz.com/
- Developer guide: https://docs.postiz.com/developer-guide
- Public API: https://docs.postiz.com/public-api
- Quick start: https://docs.postiz.com/quickstart

## License
AGPL-3.0
