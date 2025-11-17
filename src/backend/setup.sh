#!/bin/bash

echo "🚀 Ads SaaS Backend - Setup Script"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Copying from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created. Please edit it with your credentials.${NC}"
    echo ""
else
    echo -e "${GREEN}✅ .env file already exists.${NC}"
    echo ""
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

echo -e "${GREEN}✅ Docker is installed.${NC}"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✅ Docker Compose is installed.${NC}"
echo ""

# Ask user if they want to use Docker or local setup
echo "Choose installation method:"
echo "1) Docker (Recommended)"
echo "2) Local (Node.js)"
read -p "Enter your choice (1 or 2): " choice

if [ "$choice" == "1" ]; then
    echo ""
    echo "🐳 Starting Docker setup..."
    echo ""
    
    # Create logs directory
    mkdir -p logs
    
    # Start Docker Compose
    echo "Starting containers..."
    docker-compose up -d
    
    echo ""
    echo "Waiting for database to be ready..."
    sleep 10
    
    # Run migrations
    echo "Running database migrations..."
    docker-compose exec -T app npx prisma migrate deploy
    
    echo ""
    echo -e "${GREEN}✅ Docker setup complete!${NC}"
    echo ""
    echo "Your backend is running at: http://localhost:4000"
    echo "Health check: http://localhost:4000/health"
    echo ""
    echo "View logs with: docker-compose logs -f app"
    echo "Stop with: docker-compose down"
    
elif [ "$choice" == "2" ]; then
    echo ""
    echo "📦 Starting local setup..."
    echo ""
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Node.js $(node -v) is installed.${NC}"
    
    # Install dependencies
    echo "Installing dependencies..."
    npm install
    
    echo ""
    echo "Creating logs directory..."
    mkdir -p logs
    
    echo ""
    echo "Generating Prisma Client..."
    npx prisma generate
    
    echo ""
    echo "Running database migrations..."
    npx prisma migrate dev
    
    echo ""
    echo -e "${GREEN}✅ Local setup complete!${NC}"
    echo ""
    echo "Start development server with: npm run dev"
    echo "Start production server with: npm start"
    echo ""
    echo "⚠️  Make sure PostgreSQL is running and DATABASE_URL in .env is correct!"
    
else
    echo -e "${RED}Invalid choice. Please run the script again.${NC}"
    exit 1
fi

echo ""
echo "📝 Next steps:"
echo "1. Edit .env file with your API credentials"
echo "2. Configure OAuth redirect URIs in Meta/Google/TikTok dashboards"
echo "3. Test the API endpoints"
echo ""
echo "For detailed instructions, see README.md"
