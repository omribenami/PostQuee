#!/bin/bash

##############################################################################
# Postiz Container Build Script
#
# This script builds the Postiz Docker container with various options.
# Usage: ./build.sh [OPTIONS]
#
# Options:
#   -t, --tag TAG        Tag for the image (default: postiz:latest)
#   -r, --registry URL   Push to registry after build
#   -n, --no-cache       Build without using cache
#   -c, --clean          Clean old images before building
#   -v, --version VER    Set NEXT_PUBLIC_VERSION build arg
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
IMAGE_TAG="postiz:latest"
REGISTRY=""
NO_CACHE=""
CLEAN=false
VERSION=""
DOCKERFILE="Dockerfile.dev"

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
Postiz Container Build Script

Usage: ./build.sh [OPTIONS]

Options:
  -t, --tag TAG        Tag for the image (default: postiz:latest)
  -r, --registry URL   Push to registry after build (e.g., ghcr.io/username)
  -n, --no-cache       Build without using cache
  -c, --clean          Clean old images before building
  -v, --version VER    Set NEXT_PUBLIC_VERSION build arg
  -h, --help           Show this help message

Examples:
  ./build.sh
  ./build.sh -t postiz:v1.0.0 -v 1.0.0
  ./build.sh -t myregistry.io/postiz:latest -r myregistry.io -c
  ./build.sh --clean --no-cache

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

echo ""
print_info "To run the container, use:"
echo "  docker run -d -p 3000:3000 -p 4200:4200 --name postiz $IMAGE_TAG"
echo ""
print_info "Or use the existing create script:"
echo "  ./var/docker/docker-create.sh"
echo ""
