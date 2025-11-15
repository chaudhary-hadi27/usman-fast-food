# Usman Fast Food - Enhanced Production Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Environment Setup](#environment-setup)
4. [Database Setup](#database-setup)
5. [Redis Setup](#redis-setup)
6. [Security Configuration](#security-configuration)
7. [Performance Optimization](#performance-optimization)
8. [Monitoring & Analytics](#monitoring--analytics)
9. [Testing](#testing)
10. [Deployment](#deployment)

---

## Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB 6.0+
- Redis 7.0+ (optional but recommended)
- Git

---

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd usman-fast-food

# Install dependencies
npm install

# or
yarn install
```

---

## Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Configure the following variables:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/usman-fast-food

# Redis (optional)
REDIS_URL=redis://username:password@redis-server:6379

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Environment
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Generate Secure JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Database Setup

### MongoDB Atlas (Recommended)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Set up database user with read/write permissions
4. Whitelist your IP addresses (or use 0.0.0.0/0 for all IPs in production)
5. Get connection string and add to `.env.local`

### Local MongoDB

```bash
# Install MongoDB
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Start MongoDB
mongod --dbpath=/path/to/data/directory
```

### Seed Initial Admin User

```bash
# Connect to MongoDB and run:
use usman-fast-food

db.users.insertOne({
  username: "admin",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiTT2eC8W", // bcrypt hash of 'admin123'
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## Redis Setup

### Redis Cloud (Recommended for Production)

1. Create account at [Redis Cloud](https://redis.com/try-free/)
2. Create a database
3. Get connection URL
4. Add to `.env.local`

### Local Redis

```bash
# Install Redis
# macOS
brew install redis

# Ubuntu
sudo apt-get install redis-server

# Start Redis
redis-server
```

### Testing Redis Connection

```bash
redis-cli ping
# Should return: PONG
```

---

## Security Configuration

### 1. Update JWT Secret

Generate a strong JWT secret (minimum 32 characters):

```bash
openssl rand -base64 32
```

### 2. Set Up HTTPS

For production, always use HTTPS. Options:
- Use a reverse proxy (Nginx/Apache) with Let's Encrypt
- Use Vercel/Netlify (HTTPS included)
- Use Cloudflare for DDoS protection + HTTPS

### 3. Environment Variables Security

**Never commit `.env.local` to Git!**

Add to `.gitignore`:
```
.env.local
.env*.local
```

### 4. Rate Limiting

The app includes built-in rate limiting:
- API endpoints: 100 requests/minute
- Auth endpoints: 5 requests/15 minutes
- Order endpoints: 10 requests/minute

Adjust in `lib/rateLimit.ts` if needed.

---

## Performance Optimization

### 1. Image Optimization

Replace image URLs with optimized versions:

```typescript
// Use Next.js Image component
import OptimizedImage from '@/components/OptimizedImage';

<OptimizedImage 
  src="/path/to/image.jpg"
  alt="Description"
  width={400}
  height={400}
/>
```

### 2. Caching Strategy

The app uses multi-layer caching:

**Redis Cache:**
- Menu items: 5 minutes
- Orders: 10 minutes

**Browser Cache:**
- Static assets: 1 year
- API responses: No cache (dynamic)

### 3. Database Indexing

Add indexes to MongoDB:

```javascript
// In MongoDB shell or Compass
db.menuitems.createIndex({ category: 1, available: 1 })
db.orders.createIndex({ orderId: 1 }, { unique: true })
db.orders.createIndex({ createdAt: -1 })
db.users.createIndex({ username: 1 }, { unique: true })
```

### 4. Bundle Size Optimization

The app is configured for optimal bundle splitting:
- Dynamic imports for heavy components
- Tree-shaking enabled
- Image optimization enabled

Check bundle size:
```bash
npm run build
# Review the output for bundle sizes
```

---

## Monitoring & Analytics

### 1. Sentry Setup (Error Tracking)

1. Create account at [Sentry.io](https://sentry.io)
2. Create a Next.js project
3. Copy DSN to `.env.local`
4. Initialize in your app (already configured in `lib/monitoring.ts`)

### 2. Google Analytics

1. Create account at [Google Analytics](https://analytics.google.com)
2. Create a GA4 property
3. Copy Measurement ID to `.env.local`
4. Add to your layout:

```typescript
// In src/app/layout.tsx, add to <head>:
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
  `}
</Script>
```

### 3. Custom Metrics

Track custom events:

```typescript
import { trackEvent, trackOrder } from '@/lib/monitoring';

// Track custom event
trackEvent('menu', 'item_viewed', itemName);

// Track order
trackOrder(orderId, totalAmount);
```

---

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure

```
__tests__/
├── components/
│   ├── Header.test.tsx
│   └── OptimizedImage.test.tsx
├── lib/
│   ├── auth.test.ts
│   └── validation.test.ts
└── api/
    ├── menu.test.ts
    └── orders.test.ts
```

### Writing Tests

```typescript
import { render, screen } from '@testing-library/react';
import YourComponent from '@/components/YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

---

## Deployment

### Option 1: Vercel (Recommended - Easiest)

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

**Vercel automatically handles:**
- HTTPS
- CDN
- Automatic deployments on Git push
- Preview deployments for PRs

### Option 2: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t usman-fast-food .
docker run -p 3000:3000 --env-file .env.local usman-fast-food
```

### Option 3: VPS (DigitalOcean, AWS, etc.)

1. **Set up server:**
```bash
# Update system
sudo apt update && sudo apt upgrade

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx
```

2. **Deploy app:**
```bash
# Clone repository
git clone <your-repo> /var/www/usman-fast-food
cd /var/www/usman-fast-food

# Install dependencies
npm ci --only=production

# Build
npm run build

# Start with PM2
pm2 start npm --name "usman-fast-food" -- start
pm2 save
pm2 startup
```

3. **Configure Nginx:**
```nginx
# /etc/nginx/sites-available/usman-fast-food
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **Enable site and SSL:**
```bash
sudo ln -s /etc/nginx/sites-available/usman-fast-food /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Post-Deployment Checklist

- [ ] All environment variables set correctly
- [ ] Database connected and accessible
- [ ] Redis connected (if using)
- [ ] Admin user created in database
- [ ] HTTPS enabled
- [ ] Error tracking configured (Sentry)
- [ ] Analytics configured (GA)
- [ ] Backups configured for database
- [ ] Domain DNS configured
- [ ] Rate limiting tested
- [ ] Mobile responsiveness verified
- [ ] All pages loading correctly
- [ ] Order flow tested end-to-end
- [ ] Admin dashboard accessible
- [ ] Email notifications working (if implemented)

---

## Maintenance

### Database Backups

**MongoDB Atlas:** Enable automatic backups in dashboard

**Self-hosted:**
```bash
# Backup
mongodump --uri="mongodb://localhost:27017/usman-fast-food" --out=/path/to/backup

# Restore
mongorestore --uri="mongodb://localhost:27017/usman-fast-food" /path/to/backup
```

### Monitor Logs

```bash
# PM2 logs
pm2 logs usman-fast-food

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Update Application

```bash
cd /var/www/usman-fast-food
git pull origin main
npm ci --only=production
npm run build
pm2 restart usman-fast-food
```

---

## Performance Benchmarks

Expected performance after optimization:

- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3.5s
- **Cumulative Layout Shift:** < 0.1
- **API Response Time:** < 200ms (cached), < 500ms (uncached)

Test with:
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

---

## Support & Troubleshooting

### Common Issues

**1. MongoDB Connection Failed**
- Check MONGODB_URI format
- Verify network access in MongoDB Atlas
- Ensure IP is whitelisted

**2. Redis Connection Failed**
- Verify REDIS_URL format
- Check Redis server is running
- App will work without Redis (caching disabled)

**3. JWT Token Invalid**
- Clear cookies and login again
- Verify JWT_SECRET is set correctly
- Check token expiration (24 hours default)

**4. Images Not Loading**
- Verify image URLs are accessible
- Check Next.js image domains in `next.config.js`
- Ensure fallback images are available

---

## License

This project is private and proprietary.

---

## Contact

For issues or questions, contact: info@usmanfastfood.com