# Environment Configuration Guide

This project uses a structured approach to manage environment variables across development and production environments.

## File Structure

```
/opt/PostQuee-dev/ (Development)
├── .env                           # Shared environment variables (NOT in git)
├── .env.example                   # Example shared variables (IN git)
├── docker-compose.dev.yaml        # Dev-specific Docker config (NOT in git)
├── docker-compose.dev.yaml.example # Dev Docker example (IN git)
└── ...

/opt/PostQuee/ (Production)
├── .env                           # Shared environment variables (NOT in git)
├── docker-compose.yaml            # Prod-specific Docker config (NOT in git)
└── ...
```

## Environment Variable Structure

### Shared Variables (.env)
These variables are **identical across both environments**:
- Social media API keys (Facebook, Instagram, TikTok, LinkedIn, X, YouTube, Pinterest, Slack, Discord)
- Payment provider keys (Stripe)
- AI API keys (OpenAI)
- Email provider settings (Resend)
- Storage configuration (Cloudflare R2)
- WordPress database credentials
- Encryption secrets (ENCRYPTION_SECRET, MASTER_INTERNAL_KEY)
- General settings (IS_GENERAL, NODE_ENV, API_LIMIT)

### Environment-Specific Variables (docker-compose.yaml)
These variables are **different between environments**:

#### Production (`docker-compose.yaml`)
- `DATABASE_URL`: Supabase PostgreSQL connection
- `REDIS_URL`: Production Redis instance
- `MAIN_URL`, `FRONTEND_URL`, `NEXT_PUBLIC_BACKEND_URL`: Production domain (https://app.postquee.com)
- `JWT_SECRET`: Production-specific JWT secret
- `COOKIE_NAME`, `NEXT_PUBLIC_COOKIE_NAME`: "auth-prod"

#### Development (`docker-compose.dev.yaml`)
- `DATABASE_URL`: Local PostgreSQL container connection
- `REDIS_URL`: Development Redis instance
- `MAIN_URL`, `FRONTEND_URL`, `NEXT_PUBLIC_BACKEND_URL`: Development domain (https://dev.postquee.com)
- `JWT_SECRET`: Development-specific JWT secret
- `COOKIE_NAME`, `NEXT_PUBLIC_COOKIE_NAME`: "auth-dev"
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`: Local database credentials

## Database Configuration

### Production
- **Provider**: Supabase (managed PostgreSQL)
- **Connection**: Remote connection to Supabase instance
- **No local PostgreSQL container needed**

### Development
- **Provider**: Local PostgreSQL container
- **Connection**: Local container (postiz-postgres-dev)
- **Isolated data from production**

## Setup Instructions

### For Development Environment

1. **Copy example files**:
   ```bash
   cd /opt/PostQuee-dev
   cp .env.example .env
   cp docker-compose.dev.yaml.example docker-compose.dev.yaml
   ```

2. **Edit .env** with your actual API keys and secrets

3. **Edit docker-compose.dev.yaml** with your development-specific values:
   - Development domain URLs
   - JWT secret for development
   - Local database credentials (if changing defaults)

4. **Start services**:
   ```bash
   docker-compose -f docker-compose.dev.yaml up -d
   ```

### For Production Environment

1. **Copy example files**:
   ```bash
   cd /opt/PostQuee
   cp .env.example .env
   cp docker-compose.yaml.example docker-compose.yaml
   ```

2. **Edit .env** with your actual API keys and secrets (same as development)

3. **Edit docker-compose.yaml** with your production-specific values:
   - Supabase DATABASE_URL
   - Production domain URLs
   - Production JWT secret
   - Production cookie names

4. **Deploy using the rebuild script**:
   ```bash
   /opt/PostQuee/rebuild.sh
   ```

## Security Notes

- **NEVER commit** `.env` or `docker-compose.yaml` files to git
- These files contain sensitive credentials and must remain local only
- The `.gitignore` is configured to exclude these files automatically
- Only `.example` files should be committed to git as templates

## Workflow Reminder

1. **Develop in** `/opt/PostQuee-dev/`
2. **Test thoroughly** in development
3. **Commit changes** to git (excluding sensitive files)
4. **Deploy to production** using `/opt/PostQuee/rebuild.sh`

## Troubleshooting

### Connection Issues
- Verify DATABASE_URL format in docker-compose files
- Check Redis container is running: `docker ps | grep redis`
- Ensure network connectivity between containers

### Environment Variable Not Loading
- Verify `.env` file exists in the correct directory
- Check `env_file` reference in docker-compose files
- Restart containers: `docker-compose restart`

### Database Connection Errors
- **Production**: Verify Supabase credentials and connection string
- **Development**: Ensure PostgreSQL container is healthy: `docker ps`
- Check logs: `docker-compose logs postiz-app`
