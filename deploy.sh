#!/bin/bash

echo "🚀 Starting Stock Tracker Deployment on AWS EC2"

# Update system packages
echo "📦 Updating system packages..."
sudo apt-get update

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo "🔧 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your actual values before continuing!"
    echo "   Run: nano .env"
    exit 1
fi

# Build and start containers
echo "🏗️  Building and starting containers..."
docker-compose down --remove-orphans
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Run database migrations
echo "🗃️  Running database migrations..."
docker-compose exec -T backend python manage.py migrate

# Create superuser (optional)
echo "👤 Do you want to create a Django superuser? (y/n)"
read -r create_superuser
if [ "$create_superuser" = "y" ]; then
    docker-compose exec backend python manage.py createsuperuser
fi

# Show running containers
echo "📊 Checking running containers..."
docker-compose ps

echo "✅ Deployment complete!"
echo "🌐 Your application should be available at:"
echo "   Frontend: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'your-ec2-ip')"
echo "   Backend API: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'your-ec2-ip')/api/v1/"
echo "   Admin Panel: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'your-ec2-ip')/admin/"
