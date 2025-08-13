# Deployment Guide

This guide covers all deployment options for the Transformer Asset Dashboard.

## 🚀 Quick Start Deployment

### Option 1: Docker Compose (Recommended)

```bash
# Start the application
docker-compose up -d

# Access at http://localhost:8080
```

### Option 2: Manual Docker

```bash
# Build the image
docker build -t transformer-dashboard .

# Run the container
docker run -p 8080:80 transformer-dashboard

# Access at http://localhost:8080
```

## 🏗️ Build Process

### 1. Development Build

```bash
# Install dependencies
npm install

# Start development server
npm run serve
```

### 2. Production Build

```bash
# Build for production
npm run build

# The dist/ folder contains your production files
```

### 3. Production Build with Scripts

#### Linux/macOS
```bash
# Make scripts executable (first time only)
chmod +x scripts/*.sh

# Run production build
./scripts/production-build.sh
```

#### Windows
```bash
# Run production build
scripts\production-build.sh
```

## 🐳 Docker Deployment

### Prerequisites

- Docker Desktop installed and running
- Docker Compose available

### Step-by-Step Docker Deployment

1. **Clone and navigate to project**
   ```bash
   cd transformer-app
   ```

2. **Build and start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Verify deployment**
   ```bash
   docker-compose ps
   ```

4. **Access application**
   Open http://localhost:8080 in your browser

5. **View logs**
   ```bash
   docker-compose logs -f
   ```

6. **Stop application**
   ```bash
   docker-compose down
   ```

### Docker Commands Reference

```bash
# Build image
docker build -t transformer-dashboard .

# Run container
docker run -p 8080:80 transformer-dashboard

# View running containers
docker ps

# View logs
docker logs <container-id>

# Stop container
docker stop <container-id>

# Remove container
docker rm <container-id>

# Remove image
docker rmi transformer-dashboard
```

## 🌐 Production Server Deployment

### Option 1: Static File Server

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Upload dist/ folder to your server**

3. **Configure web server (Apache example)**
   ```apache
   <VirtualHost *:80>
       DocumentRoot /var/www/transformer-dashboard
       ServerName your-domain.com
       
       <Directory /var/www/transformer-dashboard>
           AllowOverride All
           Require all granted
       </Directory>
   </VirtualHost>
   ```

4. **Create .htaccess file in dist/ folder**
   ```apache
   RewriteEngine On
   RewriteBase /
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

### Option 2: Nginx Server

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Upload dist/ folder to your server**

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/transformer-dashboard;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

## 📱 Cloud Platform Deployment

### Netlify

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Drag and drop dist/ folder to Netlify**

3. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

### Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

### AWS S3 + CloudFront

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Upload to S3 bucket**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name
   ```

3. **Configure CloudFront distribution**

## 🔧 Environment Configuration

### Development Environment

```bash
# .env.development
NODE_ENV=development
VUE_APP_API_URL=http://localhost:3000
VUE_APP_CHART_ANIMATION=true
```

### Production Environment

```bash
# .env.production
NODE_ENV=production
VUE_APP_API_URL=https://your-api-domain.com
VUE_APP_CHART_ANIMATION=false
```

## 📊 Monitoring and Logs

### Docker Logs

```bash
# View real-time logs
docker-compose logs -f

# View specific service logs
docker-compose logs transformer-dashboard

# View last 100 lines
docker-compose logs --tail=100
```

### Application Monitoring

- **Health Check**: http://localhost:8080/health
- **Status Page**: http://localhost:8080/status
- **Performance Metrics**: Browser DevTools

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port 8080
   netstat -ano | findstr :8080
   
   # Kill process
   taskkill /PID <process-id> /F
   ```

2. **Docker build fails**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker build --no-cache -t transformer-dashboard .
   ```

3. **Application not accessible**
   ```bash
   # Check container status
   docker-compose ps
   
   # Check container logs
   docker-compose logs transformer-dashboard
   ```

### Performance Optimization

1. **Enable Gzip compression**
2. **Use CDN for static assets**
3. **Implement caching strategies**
4. **Monitor bundle size**

## 📋 Deployment Checklist

- [ ] All tests pass
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Production build successful
- [ ] Docker image builds successfully
- [ ] Application starts without errors
- [ ] All features work correctly
- [ ] Performance meets requirements
- [ ] Security headers configured
- [ ] Monitoring and logging configured

## 🎯 Next Steps

After successful deployment:

1. **Set up monitoring** (e.g., New Relic, DataDog)
2. **Configure CI/CD pipeline**
3. **Set up automated testing**
4. **Implement backup strategies**
5. **Plan scaling strategies**

---

**Need help?** Check the main README.md or create an issue in the repository.
