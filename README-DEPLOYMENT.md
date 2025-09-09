# Stock Tracker Docker Deployment Guide

This guide will help you deploy your Stock Tracker application using Docker on AWS EC2.

## 🏗️ Architecture Overview

- **Frontend**: React app served by Nginx
- **Backend**: Django REST API with Gunicorn
- **Database**: PostgreSQL (production) / SQLite (development)
- **Media Storage**: AWS S3 (optional) or local storage
- **Machine Learning**: TensorFlow/Keras model for stock predictions

## 📋 Prerequisites

1. **AWS Account** with:
   - EC2 instance (t3.medium or larger recommended)
   - S3 bucket (optional, for media files)
   - IAM user with S3 permissions

2. **Domain** (optional but recommended)

3. **Local Development** (for testing):
   - Docker and Docker Compose installed

## 🚀 Step-by-Step Deployment

### Step 1: Launch AWS EC2 Instance

1. **Create EC2 Instance:**
   - AMI: Ubuntu Server 20.04 LTS
   - Instance Type: t3.medium (minimum for ML model)
   - Storage: 20GB+ EBS volume
   - Security Group: Allow HTTP (80), HTTPS (443), SSH (22)

2. **Security Group Rules:**
   ```
   Type        Protocol    Port    Source
   SSH         TCP         22      Your IP
   HTTP        TCP         80      0.0.0.0/0
   HTTPS       TCP         443     0.0.0.0/0
   Custom      TCP         8000    0.0.0.0/0 (for direct backend access)
   ```

### Step 2: Setup S3 Bucket (Optional)

1. **Create S3 Bucket:**
   ```bash
   # Bucket name example: stocktracker-media-your-unique-id
   # Region: us-east-1 (or your preferred region)
   ```

2. **Create IAM User:**
   - Attach policy: `AmazonS3FullAccess` or custom policy
   - Generate access keys

3. **Bucket Policy Example:**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```

### Step 3: Connect to EC2 and Setup

1. **Connect to EC2:**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-public-ip
   ```

2. **Clone Repository:**
   ```bash
   git clone https://github.com/yourusername/stockerTracker.git
   cd stockerTracker
   ```

3. **Make deployment script executable:**
   ```bash
   chmod +x deploy.sh
   ```

### Step 4: Configure Environment

1. **Create .env file:**
   ```bash
   cp env.example .env
   nano .env
   ```

2. **Update .env with your values:**
   ```env
   SECRET_KEY=your-super-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=your-ec2-ip,your-domain.com,localhost
   
   # Database
   DATABASE_URL=postgresql://postgres:postgres@db:5432/stocktracker
   
   # AWS S3 (optional)
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_STORAGE_BUCKET_NAME=your-bucket-name
   AWS_S3_REGION_NAME=us-east-1
   ```

### Step 5: Deploy Application

1. **Run deployment script:**
   ```bash
   ./deploy.sh
   ```

2. **Or manually deploy:**
   ```bash
   # For development
   docker-compose up --build -d
   
   # For production
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

### Step 6: Post-Deployment Setup

1. **Run migrations:**
   ```bash
   docker-compose exec backend python manage.py migrate
   ```

2. **Create superuser:**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

3. **Check logs:**
   ```bash
   docker-compose logs -f
   ```

## 🌐 Access Your Application

- **Frontend**: `http://your-ec2-public-ip`
- **Backend API**: `http://your-ec2-public-ip/api/v1/`
- **Admin Panel**: `http://your-ec2-public-ip/admin/`

## 🔧 Common Commands

### Docker Management
```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f [service_name]

# Restart services
docker-compose restart [service_name]

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up --build -d
```

### Database Management
```bash
# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Django shell
docker-compose exec backend python manage.py shell

# Backup database
docker-compose exec db pg_dump -U postgres stocktracker > backup.sql
```

### Application Updates
```bash
# Pull latest code
git pull origin main

# Rebuild and deploy
docker-compose up --build -d

# Run any new migrations
docker-compose exec backend python manage.py migrate
```

## 🔒 SSL/HTTPS Setup (Optional)

1. **Install Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Get SSL certificate:**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

## 📊 Monitoring and Maintenance

### Health Checks
```bash
# Check container health
docker-compose ps

# Check disk usage
df -h

# Check memory usage
free -h

# Check logs for errors
docker-compose logs backend | grep ERROR
```

### Backup Strategy
```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T db pg_dump -U postgres stocktracker > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   sudo lsof -i :80
   sudo kill -9 PID
   ```

2. **Permission issues:**
   ```bash
   sudo chown -R $USER:$USER .
   ```

3. **Database connection issues:**
   ```bash
   docker-compose logs db
   docker-compose exec backend python manage.py dbshell
   ```

4. **Media files not loading:**
   - Check S3 bucket permissions
   - Verify AWS credentials
   - Check CORS settings

### Log Locations
- Application logs: `docker-compose logs [service]`
- Nginx logs: Inside frontend container at `/var/log/nginx/`
- Django logs: Configure in settings.py

## 📈 Performance Optimization

1. **Gunicorn workers:** Adjust in docker-compose.prod.yml
2. **Database connections:** Configure in settings.py
3. **Static file serving:** Use CDN for production
4. **Caching:** Add Redis for session/cache storage

## 🔄 CI/CD Setup (Advanced)

Consider setting up GitHub Actions for automated deployment:

```yaml
# .github/workflows/deploy.yml
name: Deploy to EC2
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to EC2
        run: |
          # SSH and deploy commands
```

## 📞 Support

If you encounter issues:
1. Check the logs: `docker-compose logs -f`
2. Verify environment variables
3. Check AWS permissions and configuration
4. Review Django settings for production

Happy deploying! 🚀
