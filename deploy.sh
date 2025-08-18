#!/bin/bash

# Portfolio Deployment Script
# Author: Nguyen Cong Hieu

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Node.js version: $(node --version)"
print_status "npm version: $(npm --version)"

# Clean previous builds
print_status "Cleaning previous builds..."
npm run clean 2>/dev/null || echo "No previous builds to clean"

# Install dependencies
print_status "Installing dependencies..."
npm install

# Run type checking
print_status "Running type checking..."
npm run type-check

# Run linting
print_status "Running linting..."
npm run lint

# Run tests
print_status "Running tests..."
npm run test:ci

# Build the application
print_status "Building the application..."
npm run build

print_success "Build completed successfully!"

# Check deployment method
echo ""
echo "Choose deployment method:"
echo "1) Vercel"
echo "2) Netlify"
echo "3) Docker"
echo "4) Manual (just build)"
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        print_status "Deploying to Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
            print_success "Deployed to Vercel successfully!"
        else
            print_warning "Vercel CLI not found. Installing..."
            npm install -g vercel
            print_status "Please run 'vercel login' first, then run this script again."
        fi
        ;;
    2)
        print_status "Deploying to Netlify..."
        if command -v netlify &> /dev/null; then
            netlify deploy --prod --dir=.next
            print_success "Deployed to Netlify successfully!"
        else
            print_warning "Netlify CLI not found. Installing..."
            npm install -g netlify-cli
            print_status "Please run 'netlify login' first, then run this script again."
        fi
        ;;
    3)
        print_status "Building Docker image..."
        if command -v docker &> /dev/null; then
            docker build -t hieu-portfolio .
            print_success "Docker image built successfully!"
            print_status "To run: docker run -p 3000:3000 hieu-portfolio"
        else
            print_error "Docker not found. Please install Docker first."
        fi
        ;;
    4)
        print_success "Build completed! You can now manually deploy the .next folder."
        print_status "To test locally: npm start"
        ;;
    *)
        print_error "Invalid choice. Exiting."
        exit 1
        ;;
esac

print_success "Deployment process completed!"
echo ""
print_status "Next steps:"
echo "1. Configure your domain DNS settings"
echo "2. Set up SSL certificate"
echo "3. Monitor your application"
echo ""
print_status "For detailed instructions, check README_DEPLOYMENT.md"