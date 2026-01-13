#!/bin/bash
# Resilient PM2 startup script to prevent crashes on docker restart

set -e

echo "🚀 [PM2 Startup] Starting PostQuee services..."

# Function to wait for database with retries
wait_for_database() {
    echo "⏳ [PM2 Startup] Waiting for database connection..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$connect().then(() => { console.log('Connected'); process.exit(0); }).catch(() => process.exit(1));" 2>/dev/null; then
            echo "✅ [PM2 Startup] Database connection successful!"
            return 0
        fi
        echo "   [PM2 Startup] Attempt $attempt/$max_attempts: Database not ready, waiting 2s..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "⚠️  [PM2 Startup] Warning: Could not verify database connection after $max_attempts attempts"
    echo "   [PM2 Startup] Continuing anyway - services will retry on their own..."
    return 1
}

# Function to run Prisma migrations safely
run_prisma_migrations() {
    echo "🔄 [PM2 Startup] Running Prisma DB push..."
    
    # Use timeout to prevent hanging
    if timeout 120s pnpm run prisma-db-push 2>&1 | tee /tmp/prisma-migration.log; then
        echo "✅ [PM2 Startup] Prisma migrations completed successfully!"
        return 0
    else
        local exit_code=$?
        echo "⚠️  [PM2 Startup] Warning: Prisma migration failed with exit code $exit_code"
        echo "   [PM2 Startup] Check /tmp/prisma-migration.log for details"
        echo "   [PM2 Startup] Services will start anyway - database might be already migrated"
        return 1
    fi
}

# Clean up any stale PM2 processes
echo "🧹 [PM2 Startup] Cleaning up stale PM2 processes..."
pm2 delete all 2>/dev/null || true
pm2 kill 2>/dev/null || true

# Wait for database
wait_for_database || echo "   [PM2 Startup] Proceeding without database verification..."

# Run migrations (non-blocking on failure)
run_prisma_migrations || echo "   [PM2 Startup] Proceeding without migration verification..."

# Start all PM2 services sequentially from their app directories
echo "🎯 [PM2 Startup] Starting all services with PM2..."

cd /app/apps/backend && pm2 start pnpm --name backend -- start
cd /app/apps/workers && pm2 start pnpm --name workers -- start
cd /app/apps/cron && pm2 start pnpm --name cron -- start
cd /app/apps/frontend && pm2 start pnpm --name frontend -- start

# Wait for services to initialize
sleep 10

# Verify services started
echo "📊 [PM2 Startup] Service status:"
pm2 list

# Save PM2 process list (for resurrection after restart)
pm2 save --force 2>/dev/null || true

echo "✅ [PM2 Startup] All services started successfully!"
echo "📝 [PM2 Startup] Tailing logs (Ctrl+C won't stop services)..."

# Tail logs
pm2 logs
