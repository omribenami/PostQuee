#!/bin/bash
# Postiz DEV Environment Management Script
# Targets docker-compose.dev.yaml specifically

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# הגדרת שם קובץ ה-Compose של סביבת הפיתוח
COMPOSE_FILE="docker-compose.dev.yaml"
APP_SERVICE="postiz-app-dev"
DB_SERVICE="postiz-postgres-dev"
REDIS_SERVICE="postiz-redis-dev"

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
            echo "Postiz DEV Management Script"
            echo "Targeting: $COMPOSE_FILE"
            echo ""
            echo "Usage: ./rebuild-dev.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -r, --restart     Just restart containers (no rebuild)"
            echo "  -f, --force       Force rebuild (needed if you changed package.json)"
            echo "  -n, --no-cache    Build without using cache (clean build)"
            echo "  -h, --help        Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Check if docker-compose is available
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed"
    exit 1
fi

print_status "Postiz DEV Environment Manager"
echo ""

# Just restart if requested
if [ "$RESTART_ONLY" = true ]; then
    print_status "Restarting DEV containers..."
    docker compose -f $COMPOSE_FILE restart $APP_SERVICE
    print_success "Containers restarted!"
    exit 0
fi

# Check if rebuild is needed
if [ "$FORCE_REBUILD" = false ] && [ "$NO_CACHE" = false ]; then
    print_status "Checking environment..."

    # Check if image exists
    if docker images localhost/$APP_SERVICE | grep -q $APP_SERVICE; then
        print_warning "Dev Image exists."
        print_status "REMINDER: In DEV mode, code changes update automatically via Volume Mapping!"
        print_status "You only need to rebuild if you changed 'package.json' or 'Dockerfile.dev'."
        echo ""
        read -p "Do you want to rebuild anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_status "Skipping rebuild. Restarting services just in case..."
            docker compose -f $COMPOSE_FILE restart $APP_SERVICE
            exit 0
        fi
    fi
fi

# Build options
BUILD_OPTS=""
if [ "$NO_CACHE" = true ]; then
    BUILD_OPTS="--no-cache"
    print_warning "Building WITHOUT cache - this will take longer!"
fi

# NOTE: Git pull removed intentionally for DEV to protect local work-in-progress
# print_status "Skipping Git Pull to protect local dev changes..."

print_status "Stopping DEV containers..."
# עוצר רק את הקונטיינרים של הפיתוח
docker compose -f $COMPOSE_FILE down

print_status "Building DEV image..."
print_warning "Using $COMPOSE_FILE..."
echo ""

# Build command pointing to the dev file
docker compose -f $COMPOSE_FILE build $BUILD_OPTS

print_success "Build completed!"
echo ""

print_status "Starting DEV containers..."
docker compose -f $COMPOSE_FILE up -d

print_success "Containers started!"
echo ""

print_status "Waiting for services..."
sleep 5

print_status "DEV Environment Status:"
docker compose -f $COMPOSE_FILE ps

echo ""
print_success "Postiz DEV is ready!"
print_status "URL: https://dev.postquee.com (or localhost:4201)"
print_status "DB Port: 5433 | Redis Port: 6380"
print_status "Logs: docker compose -f $COMPOSE_FILE logs -f"
