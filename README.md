# PostQuee

<p align="center">
  <strong>Your Ultimate AI-Powered Social Media Scheduling Platform</strong>
</p>

<p align="center">
<a href="https://opensource.org/license/agpl-v3">
  <img src="https://img.shields.io/badge/License-AGPL%203.0-blue.svg" alt="License">
</a>
<a href="https://github.com/omribenami/PostQuee">
  <img src="https://img.shields.io/github/stars/omribenami/PostQuee?style=social" alt="GitHub stars">
</a>
</p>

## Overview

**PostQuee** is a powerful, open-source social media management platform that helps you schedule, manage, and analyze your content across multiple social networks. Built on the solid foundation of Postiz, PostQuee offers an enhanced experience with advanced features for content creators, marketers, and businesses.

### Supported Platforms

<div align="center">
  <img alt="Instagram" src="https://postiz.com/svgs/socials/Instagram.svg" width="32">
  <img alt="YouTube" src="https://postiz.com/svgs/socials/Youtube.svg" width="32">
  <img alt="LinkedIn" src="https://postiz.com/svgs/socials/Linkedin.svg" width="32">
  <img alt="X (Twitter)" src="https://postiz.com/svgs/socials/X.svg" width="32">
  <img alt="Facebook" src="https://postiz.com/svgs/socials/Facebook.svg" width="32">
  <img alt="TikTok" src="https://postiz.com/svgs/socials/TikTok.svg" width="32">
  <img alt="Reddit" src="https://postiz.com/svgs/socials/Reddit.svg" width="32">
  <img alt="Discord" src="https://postiz.com/svgs/socials/Discord.svg" width="32">
  <img alt="Slack" src="https://postiz.com/svgs/socials/Slack.svg" width="32">
  <img alt="Mastodon" src="https://postiz.com/svgs/socials/Mastodon.svg" width="32">
  <img alt="Bluesky" src="https://postiz.com/svgs/socials/Bluesky.svg" width="32">
  <img alt="Pinterest" src="https://postiz.com/svgs/socials/Pinterest.svg" width="32">
  <img alt="Threads" src="https://postiz.com/svgs/socials/Threads.svg" width="32">
  <img alt="Dribbble" src="https://postiz.com/svgs/socials/Dribbble.svg" width="32">
</div>

## Features

### Core Capabilities
- **Multi-Platform Scheduling**: Schedule posts across 14+ social media platforms from a single dashboard
- **AI-Powered Content**: Generate engaging content with integrated AI capabilities
- **Analytics & Insights**: Track performance metrics and optimize your social media strategy
- **Team Collaboration**: Invite team members, assign roles, and collaborate on content
- **Content Marketplace**: Exchange or purchase posts with other users
- **Media Management**: Upload and organize images, videos, and other media assets
- **Calendar View**: Visualize your content schedule with an intuitive calendar interface
- **Bulk Scheduling**: Schedule multiple posts at once to save time
- **Auto-Posting**: Set up automated posting schedules for consistent engagement
- **Draft Management**: Save drafts and work on posts at your own pace

### Advanced Features
- **API & Webhooks**: Integrate with automation platforms (N8N, Make.com, Zapier)
- **Custom Integrations**: Build custom workflows with our public API
- **Third-Party Plugins**: Connect with popular tools and services
- **URL Shortening**: Integrated support for Dub, Short.io, Kutt, and LinkDrip
- **Newsletter Integration**: Publish to newsletter platforms
- **Browser Extension**: Quick posting from anywhere on the web
- **Multi-Organization**: Manage multiple brands or clients

## Tech Stack

PostQuee is built with modern, production-ready technologies:

- **Monorepo**: NX workspace for scalable architecture
- **Frontend**: Next.js 14 with React 18, Tailwind CSS
- **Backend**: NestJS with RESTful API
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Queue**: Redis with BullMQ
- **Email**: Resend for transactional emails
- **AI**: OpenAI integration for content generation
- **Testing**: Jest with comprehensive test coverage
- **Monitoring**: Sentry for error tracking
- **Package Manager**: pnpm 10.6.1

### Architecture

```
PostQuee/
├── apps/
│   ├── backend/       - NestJS API server (port 3000)
│   ├── frontend/      - Next.js application (port 4200)
│   ├── workers/       - BullMQ job processors
│   ├── cron/          - Scheduled tasks
│   ├── extension/     - Browser extension
│   ├── commands/      - CLI utilities
│   └── sdk/           - NodeJS SDK
├── libraries/
│   ├── nestjs-libraries/      - Shared backend modules
│   ├── react-shared-libraries/ - Shared React components
│   └── helpers/               - Utility functions
└── CLAUDE.md          - AI development guide
```

## Quick Start

### Prerequisites

- Node.js >= 22.12.0 < 23.0.0
- pnpm 10.6.1
- PostgreSQL database
- Redis server

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/omribenami/PostQuee.git
   cd PostQuee
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   - `DATABASE_URL`: PostgreSQL connection string
   - `REDIS_URL`: Redis connection string
   - `JWT_SECRET`: Secret for JWT token generation
   - `FRONTEND_URL`: Frontend URL (default: http://localhost:4200)
   - `NEXT_PUBLIC_BACKEND_URL`: Backend API URL (default: http://localhost:3000)
   - `BACKEND_INTERNAL_URL`: Internal backend URL (default: http://localhost:3000)

4. **Set up the database**
   ```bash
   pnpm run prisma-generate
   pnpm run prisma-db-push
   ```

5. **Start the development server**
   ```bash
   pnpm run dev
   ```

   This will start:
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3000
   - Workers: Background job processors
   - Cron: Scheduled task runners

### Using Docker (Recommended for Local Development)

Start PostgreSQL and Redis with Docker:
```bash
pnpm run dev:docker
```

## Development

### Available Commands

```bash
# Development
pnpm run dev                    # Run all services
pnpm run dev:backend            # Backend only
pnpm run dev:frontend           # Frontend only
pnpm run dev:workers            # Workers only
pnpm run dev:cron               # Cron only

# Building
pnpm run build                  # Build all apps
pnpm run build:backend          # Build backend
pnpm run build:frontend         # Build frontend
pnpm run build:extension        # Build browser extension

# Production
pnpm run start:prod:backend     # Start backend in production
pnpm run start:prod:frontend    # Start frontend in production
pnpm run pm2                    # Run with PM2 process manager

# Database
pnpm run prisma-generate        # Generate Prisma client
pnpm run prisma-db-push         # Push schema changes
pnpm run prisma-db-pull         # Pull schema from database

# Testing
pnpm test                       # Run tests with coverage
```

### Project Structure

- **Backend Services**: Located in `apps/backend/src/api/routes/`
- **Frontend Pages**: Using Next.js App Router in `apps/frontend/src/app/`
- **Shared Libraries**: Reusable modules in `libraries/`
- **Database Schema**: Prisma schema at `libraries/nestjs-libraries/src/database/prisma/schema.prisma`

## Configuration

PostQuee supports extensive configuration through environment variables:

### Essential Configuration
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis connection
- `JWT_SECRET` - Authentication secret
- `FRONTEND_URL` - Frontend application URL
- `NEXT_PUBLIC_BACKEND_URL` - Backend API URL

### Optional Integrations
- **Storage**: Cloudflare R2 or local storage (`STORAGE_PROVIDER`)
- **Email**: Resend API key
- **AI**: OpenAI API key
- **Payment**: Stripe keys for subscriptions
- **OAuth**: Client credentials for each social platform
- **Monitoring**: Sentry DSN

See `.env.example` for a complete list of configuration options.

## API & Integrations

### Public API
PostQuee provides a RESTful API for programmatic access:
- Rate limiting: 30 requests/hour (configurable via `API_LIMIT`)
- Authentication: Bearer token
- Documentation: Available in the application

### SDK & Integrations
- **NodeJS SDK**: `@postiz/node` on npm
- **N8N**: Custom node available
- **Make.com**: Official integration
- **Webhooks**: Event-driven integrations

### Automation Examples
```javascript
// NodeJS SDK example
import { PostizClient } from '@postiz/node';

const client = new PostizClient({ apiKey: 'your-api-key' });

await client.posts.create({
  content: 'Hello from PostQuee!',
  platforms: ['twitter', 'linkedin'],
  scheduledAt: '2024-01-15T10:00:00Z'
});
```

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Use TypeScript throughout
- Follow conventional commits (feat:, fix:, docs:, etc.)
- Add tests for new features
- Document API changes
- Update `.env.example` for new environment variables

## Security

PostQuee takes security seriously:

- All user authentication uses official OAuth flows
- No API keys or tokens are stored insecurely
- Direct platform authentication ensures compliance
- Regular security audits and updates
- AGPL-3.0 license ensures transparency

Found a security issue? Please email security@postquee.com (do not open a public issue).

## Platform Compliance

- Uses official, platform-approved OAuth flows
- No scraping or unauthorized automation
- No proxy of API keys or access tokens
- Users authenticate directly with platforms
- Full compliance with platform terms of service

## Acknowledgments

PostQuee is built on the excellent foundation of [Postiz](https://github.com/gitroomhq/postiz-app), an open-source social media scheduling tool. We're grateful to the Postiz team and community for their amazing work.

## License

This project is licensed under the [AGPL-3.0 License](LICENSE) - see the LICENSE file for details.

## Support

- **Documentation**: Coming soon
- **Issues**: [GitHub Issues](https://github.com/omribenami/PostQuee/issues)
- **Discussions**: [GitHub Discussions](https://github.com/omribenami/PostQuee/discussions)

---

## Legal Disclosure & Credits

PostQuee is a customized distribution of the open-source project **Postiz**, developed by Gitroom. This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

As PostQuee is provided as a network service (SaaS), the complete source code for this version is made available via this repository in compliance with the AGPL-3.0 requirements.

**Original project credit**: [https://github.com/gitroomhq/postiz-app](https://github.com/gitroomhq/postiz-app)

All modifications and customizations made to create PostQuee are also licensed under AGPL-3.0 and are available in this repository. Users interacting with PostQuee over a network have the right to receive the complete corresponding source code.

---

<p align="center">
  Made with ❤️ by the PostQuee Team
</p>
