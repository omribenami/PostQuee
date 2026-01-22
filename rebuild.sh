#!/bin/bash
# Postiz Docker Management Script
# Optimized rebuild and restart script with backend health checks

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to check backend health
check_backend_health() {
    print_status "Checking backend health..."

    # Check if container is running
    if ! docker compose ps postiz-app | grep -q "Up"; then
        print_error "Backend container is not running!"
        return 1
    fi

    # Check PM2 processes
    print_status "Checking PM2 processes..."
    if ! docker exec postiz-app pm2 status 2>/dev/null | grep -q "online"; then
        print_error "PM2 processes are not running properly!"
        return 1
    fi

    # Check if backend API is responding
    print_status "Checking API health..."
    sleep 3
    if docker exec postiz-app curl -sf http://localhost:3000/api/health >/dev/null 2>&1 || \
       docker exec postiz-app curl -sf http://localhost:3000/ >/dev/null 2>&1; then
        print_success "Backend is healthy!"
        return 0
    else
        print_warning "Backend API not responding on expected endpoints"
        # Check if any process is listening on port 3000
        if docker exec postiz-app sh -c "netstat -tuln 2>/dev/null | grep -q ':3000'" || \
           docker exec postiz-app sh -c "ss -tuln 2>/dev/null | grep -q ':3000'"; then
            print_success "Backend is listening on port 3000"
            return 0
        else
            print_error "Nothing listening on port 3000!"
            return 1
        fi
    fi
}

# Function to fix backend issues
fix_backend() {
    print_warning "Attempting to fix backend..."

    # Try to restart PM2 processes
    print_status "Restarting PM2 processes..."
    if docker exec postiz-app pm2 restart all 2>/dev/null; then
        sleep 5
        if check_backend_health; then
            print_success "Backend fixed successfully!"
            return 0
        fi
    fi

    # If that didn't work, try full PM2 reload
    print_status "Performing full PM2 reload..."
    docker exec postiz-app sh -c "pm2 delete all 2>/dev/null || true"
    docker exec postiz-app sh -c "cd /app && pnpm run pm2" 2>/dev/null || true
    sleep 5

    if check_backend_health; then
        print_success "Backend fixed successfully!"
        return 0
    fi

    # Last resort: restart the entire container
    print_status "Restarting container as last resort..."
    docker compose restart postiz-app
    sleep 10

    if check_backend_health; then
        print_success "Backend fixed successfully!"
        return 0
    else
        print_error "Could not fix backend automatically. Please check logs:"
        print_error "  docker compose logs postiz-app"
        return 1
    fi
}

# Parse arguments
FORCE_REBUILD=false
NO_CACHE=false
RESTART_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --force|-f)
            FORCE_REBUILD=true
            shift
            ;;
        --no-cache|-n)
            NO_CACHE=true
            shift
            ;;
        --restart|-r)
            RESTART_ONLY=true
            shift
            ;;
        --help|-h)
            echo "Postiz Docker Management Script"
            echo "Automatically pulls latest code and checks backend health"
            echo ""
            echo "Usage: ./rebuild.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -r, --restart     Just restart containers (no rebuild)"
            echo "  -f, --force       Force rebuild even if no changes detected"
            echo "  -n, --no-cache    Build without using cache (slow, clean build)"
            echo "  -h, --help        Show this help message"
            echo ""
            echo "Features:"
            echo "  • Always pulls latest code from git"
            echo "  • Only rebuilds if code changes detected"
            echo "  • Backend health checks after start"
            echo "  • Auto-fixes backend issues"
            echo "  • Ignores WordPress and NPM services"
            echo ""
            echo "Examples:"
            echo "  ./rebuild.sh              # Smart rebuild (pulls & rebuilds if needed)"
            echo "  ./rebuild.sh -r           # Quick restart with health check"
            echo "  ./rebuild.sh -f           # Force full rebuild"
            echo "  ./rebuild.sh -n           # Clean rebuild without cache"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Check if docker-compose is available
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed or not in PATH"
    exit 1
fi

print_status "Postiz Docker Management"
echo ""

# Just restart if requested
if [ "$RESTART_ONLY" = true ]; then
    print_status "Restarting containers..."
    docker compose restart postiz-app
    print_success "Containers restarted!"
    sleep 5

    # Check backend health after restart
    if ! check_backend_health; then
        print_warning "Backend health check failed after restart"
        fix_backend
    fi

    print_status "Container status:"
    docker compose ps postiz-app postiz-redis postiz-postgres
    exit 0
fi

# Always pull latest changes first
print_status "Pulling latest code changes from git..."
SOURCE_DIR="/opt/PostQuee"
if [ -d "$SOURCE_DIR/.git" ]; then
    cd "$SOURCE_DIR"

    # Store the current commit
    OLD_COMMIT=$(git rev-parse HEAD)

    # Pull with auto-merge strategy
    if git pull --no-rebase origin master 2>&1; then
        NEW_COMMIT=$(git rev-parse HEAD)

        if [ "$OLD_COMMIT" = "$NEW_COMMIT" ]; then
            print_success "Already up to date"
            HAS_CHANGES=false
        else
            print_success "Updated to latest code!"
            print_status "Changes: $OLD_COMMIT -> $NEW_COMMIT"
            HAS_CHANGES=true
        fi
    else
        print_warning "Could not pull latest code, will use current version"
        HAS_CHANGES=false
    fi
    cd "$SCRIPT_DIR"
else
    print_error "Source directory $SOURCE_DIR is not a git repository!"
    exit 1
fi
echo ""

# Check if rebuild is needed
if [ "$FORCE_REBUILD" = false ] && [ "$NO_CACHE" = false ]; then
    # If no code changes and image exists, ask user
    if [ "$HAS_CHANGES" = false ] && docker images localhost/postiz-app | grep -q postiz-app; then
        print_warning "No code changes detected and image exists."
        print_status "Use -f to force rebuild, or -r to just restart"
        echo ""
        read -p "Do you want to rebuild anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_status "Skipping rebuild. Use './rebuild.sh -r' to restart."
            exit 0
        fi
    elif [ "$HAS_CHANGES" = true ]; then
        print_status "Code changes detected, rebuild required"
    fi
fi

# Build options
BUILD_OPTS=""
if [ "$NO_CACHE" = true ]; then
    BUILD_OPTS="--no-cache"
    print_warning "Building WITHOUT cache - this will take longer!"
fi

print_status "Stopping containers..."
docker compose rm -fsv postiz-redis postiz-app

print_status "Building Postiz image with your customizations..."
print_warning "This may take several minutes on first build..."
echo ""

# Build with progress
if [ -n "$BUILD_OPTS" ]; then
    docker compose build $BUILD_OPTS postiz-app
else
    docker compose build postiz-app
fi

print_success "Build completed!"
echo ""

print_status "Starting Postiz containers..."
# Only start Postiz services, not WordPress or NPM
docker compose up -d postiz-postgres postiz-redis postiz-app

print_success "Containers started!"
echo ""

print_status "Waiting for services to be ready..."
sleep 10

print_status "Postiz container status:"
docker compose ps postiz-app postiz-redis postiz-postgres

echo ""

# Check backend health and fix if needed
if ! check_backend_health; then
    print_warning "Backend health check failed!"
    if fix_backend; then
        print_success "Backend is now operational"
    else
        print_error "Failed to fix backend automatically"
        print_error "Please check logs: docker compose logs -f postiz-app"
        exit 1
    fi
else
    print_success "Postiz is ready and healthy!"
fi

echo ""
print_status "View logs: docker compose logs -f postiz-app"
print_status "Quick restart: ./rebuild.sh -r"
print_status "PM2 status: docker exec postiz-app pm2 status"
print_status "PM2 logs: docker exec postiz-app pm2 logs"
