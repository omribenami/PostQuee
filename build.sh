#!/bin/bash

##############################################################################
# Postiz Container Build & Deploy Script
#
# This script builds the Postiz Docker container with various options.
# Usage: ./build.sh [OPTIONS]
#
# Options:
#   -t, --tag TAG        Tag for the image (default: postquee:latest)
#   -r, --registry URL   Push to registry after build
#   -n, --no-cache       Build without using cache
#   -c, --clean          Clean old images before building
#   -v, --version VER    Set NEXT_PUBLIC_VERSION build arg
#   -d, --deploy         Deploy after build (pull git, build, restart container)
#   -h, --help           Show this help message
##############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
IMAGE_TAG="postiz-app:latest"
REGISTRY=""
NO_CACHE=""
CLEAN=false
VERSION=""
DOCKERFILE="Dockerfile.dev"
DEPLOY=false
CONTAINER_NAME="postiz-app"
NETWORK="postiz-network"
PORT_MAPPING="5001:5000"  # 5000 is taken by Frigate, using 5001

# Helper functions
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

show_help() {
    cat << EOF
Postiz Container Build & Deploy Script

Usage: ./build.sh [OPTIONS]

Options:
  -t, --tag TAG        Tag for the image (default: postquee:latest)
  -r, --registry URL   Push to registry after build (e.g., ghcr.io/username)
  -n, --no-cache       Build without using cache
  -c, --clean          Clean old images before building
  -v, --version VER    Set NEXT_PUBLIC_VERSION build arg
  -d, --deploy         Deploy after build (pull git, build, restart container)
  -h, --help           Show this help message

Examples:
  ./build.sh
  ./build.sh -d                                                    # Pull, build, and deploy
  ./build.sh -t postquee:v1.0.0 -v 1.0.0
  ./build.sh -t myregistry.io/postquee:latest -r myregistry.io -c
  ./build.sh --clean --no-cache --deploy

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--tag)
            IMAGE_TAG="$2"
            shift 2
            ;;
        -r|--registry)
            REGISTRY="$2"
            shift 2
            ;;
        -n|--no-cache)
            NO_CACHE="--no-cache"
            shift
            ;;
        -c|--clean)
            CLEAN=true
            shift
            ;;
        -v|--version)
            VERSION="$2"
            shift 2
            ;;
        -d|--deploy)
            DEPLOY=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Start build process
print_info "Starting Postiz container build..."
echo ""

# Pull latest changes from git if deploying
if [ "$DEPLOY" = true ]; then
    print_info "Pulling latest changes from git..."
    if git pull origin main; then
        print_success "Git pull completed"
    else
        print_error "Git pull failed"
        exit 1
    fi
    echo ""
fi

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed or not in PATH"
    exit 1
fi

# Check if Dockerfile exists
if [ ! -f "$DOCKERFILE" ]; then
    print_error "Dockerfile not found: $DOCKERFILE"
    exit 1
fi

# Clean old images if requested
if [ "$CLEAN" = true ]; then
    print_info "Cleaning old images..."
    docker rmi "$IMAGE_TAG" 2>/dev/null || true
    docker rmi localhost/postiz 2>/dev/null || true
    docker rmi localhost/postiz-devcontainer 2>/dev/null || true
    print_success "Cleanup completed"
    echo ""
fi

# Build the Docker image
print_info "Building Docker image: $IMAGE_TAG"
print_info "Dockerfile: $DOCKERFILE"

# Prepare build arguments
BUILD_ARGS=""
if [ -n "$VERSION" ]; then
    BUILD_ARGS="--build-arg NEXT_PUBLIC_VERSION=$VERSION"
    print_info "Version: $VERSION"
fi

echo ""
print_info "This may take several minutes..."
echo ""

# Build command
BUILD_CMD="docker build $NO_CACHE $BUILD_ARGS -t $IMAGE_TAG -f $DOCKERFILE ."

# Show build command
print_info "Build command: $BUILD_CMD"
echo ""

# Execute build
if eval $BUILD_CMD; then
    echo ""
    print_success "Docker image built successfully: $IMAGE_TAG"
else
    echo ""
    print_error "Build failed"
    exit 1
fi

# Get image size
IMAGE_SIZE=$(docker images "$IMAGE_TAG" --format "{{.Size}}" | head -n 1)
print_info "Image size: $IMAGE_SIZE"

# Push to registry if requested
if [ -n "$REGISTRY" ]; then
    echo ""
    print_info "Pushing image to registry: $REGISTRY"

    # Tag for registry if needed
    REGISTRY_TAG="$REGISTRY/$IMAGE_TAG"
    if [ "$IMAGE_TAG" != "$REGISTRY_TAG" ]; then
        print_info "Tagging image: $REGISTRY_TAG"
        docker tag "$IMAGE_TAG" "$REGISTRY_TAG"
    fi

    # Push
    if docker push "$REGISTRY_TAG"; then
        print_success "Image pushed successfully: $REGISTRY_TAG"
    else
        print_error "Failed to push image to registry"
        exit 1
    fi
fi

# Summary
echo ""
print_success "Build completed successfully!"
echo ""
print_info "Image details:"
docker images "$IMAGE_TAG" --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.Size}}\t{{.CreatedSince}}" | head -n 2

# Deploy if requested
if [ "$DEPLOY" = true ]; then
    echo ""
    print_info "Starting deployment..."
    echo ""

    # Stop and remove existing container
    print_info "Stopping existing container..."
    docker stop "$CONTAINER_NAME" 2>/dev/null || true
    docker rm "$CONTAINER_NAME" 2>/dev/null || true
    print_success "Old container removed"
    echo ""

    # Create and start new container
    # Note: .env file is already baked into the image during build
    print_info "Starting new container..."
    docker create \
        --name "$CONTAINER_NAME" \
        --network "$NETWORK" \
        -p "$PORT_MAPPING" \
        "$IMAGE_TAG"

    docker start "$CONTAINER_NAME"
    print_success "Container started"
    echo ""

    # Wait for services to be ready
    print_info "Waiting for services to start..."
    sleep 10

    # Check status
    print_info "Checking container status..."
    if docker exec "$CONTAINER_NAME" pm2 list > /dev/null 2>&1; then
        print_success "All services are running!"
        echo ""
        docker exec "$CONTAINER_NAME" pm2 list
    else
        print_warning "Container started but PM2 not responding yet. Check logs with: docker logs $CONTAINER_NAME"
    fi

    echo ""
    print_success "Deployment completed!"
    print_info "Frontend: http://localhost:${PORT_MAPPING%%:*}"
    print_info "View logs: docker logs -f $CONTAINER_NAME"
else
    echo ""
    print_info "To run the container, use:"
    echo "  docker run -d -p 3000:3000 -p 4200:4200 --name $CONTAINER_NAME $IMAGE_TAG"
    echo ""
    print_info "Or run with deployment:"
    echo "  ./build.sh -d"
fi

echo ""
