# Earth Smart Setup Guide

Complete guide to set up Earth Smart for development or production.

## Prerequisites

- **Node.js:** 18.x or higher
- **npm:** 9.x or higher
- **PostgreSQL:** 14.x or higher
- **Git:** Latest version
- **VS Code** (recommended IDE)

## Local Development Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/sumanxyz/earth-smart.git
cd earth-smart
```

### Step 2: Install Dependencies

```bash
npm run install:all
```

This installs dependencies for both frontend and backend.

### Step 3: Setup Database

#### Using Local PostgreSQL

1. **Create database:**
```sql
CREATE DATABASE earth_smart;
```

2. **Run schema:**
```bash
psql -U postgres -d earth_smart -f database/schema.sql
```

3. **Seed data (optional):**
```bash
psql -U postgres -d earth_smart -f database/seed.sql
```

#### Using Docker

```bash
docker run --name earth-smart-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=earth_smart \
  -p 5432:5432 \
  -d postgres:14
```

Then run schema:
```bash
docker exec -it earth-smart-postgres psql -U postgres -d earth_smart -f database/schema.sql
```

### Step 4: Environment Configuration

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/earth_smart

# Backend
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-here

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 5: Start Development Servers

```bash
npm run dev
```

This starts both frontend and backend servers:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

### Step 6: Verify Setup

1. Open http://localhost:3000 in your browser
2. Click "Sign Up" and create a test account
3. Try posting on the feed
4. Check backend health: http://localhost:5000/health

## Production Deployment

### Docker Deployment

#### Build Images

```bash
# Frontend
docker build -f frontend/Dockerfile -t earth-smart-frontend .

# Backend
docker build -f backend/Dockerfile -t earth-smart-backend .
```

#### Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: earth_smart
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/earth_smart
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    depends_on:
      - postgres
    ports:
      - "5000:5000"

  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000
    ports:
      - "3000:3000"

volumes:
  postgres_data:
```

Run:
```bash
docker-compose up -d
```

### Cloud Deployment (Recommended)

#### Vercel (Frontend)

1. Push code to GitHub
2. Connect GitHub to Vercel
3. Set environment variables
4. Deploy

```bash
# Or use Vercel CLI
vercel
```

#### Railway/Render (Backend + Database)

1. Create account on Railway/Render
2. Connect GitHub repository
3. Configure environment variables
4. Deploy

Environment variables needed:
- `DATABASE_URL`
- `JWT_SECRET`
- `NODE_ENV=production`

#### AWS (Full Stack)

1. **RDS:** Managed PostgreSQL
2. **EC2/Elastic Beanstalk:** Backend
3. **CloudFront + S3:** Frontend
4. **Route 53:** DNS
5. **ALB:** Load balancing

See AWS documentation for detailed setup.

## Database Migrations

### Create New Migration

```bash
cat > database/migrations/001_create_posts_table.sql << 'EOF'
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
EOF
```

### Run Migration

```bash
psql -U postgres -d earth_smart -f database/migrations/001_create_posts_table.sql
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000  # or :5000

# Kill process
kill -9 <PID>
```

### Database Connection Error

```bash
# Test connection
psql -U postgres -h localhost -d earth_smart

# Check PostgreSQL is running
pg_isready
```

### npm Install Fails

```bash
# Clear cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm run build
```

## Performance Optimization

### Frontend
- Enable code splitting
- Use Next.js Image optimization
- Implement lazy loading
- Use Service Workers

### Backend
- Enable connection pooling
- Add Redis caching
- Use database indexes
- Monitor slow queries

### Database
- Regular VACUUM and ANALYZE
- Monitor disk space
- Set up automated backups
- Monitor query performance

## Monitoring & Logs

### Frontend Logs
```bash
# Browser console
F12 → Console tab

# Deployment logs (Vercel)
vercel logs
```

### Backend Logs
```bash
# Development
npm run dev:backend

# Production (check hosting service)
# Railway: View logs in dashboard
# Render: View logs in dashboard
```

### Database Logs
```bash
# PostgreSQL logs
tail -f /var/log/postgresql/postgresql.log
```

## Backup & Recovery

### Database Backup

```bash
# Full backup
pg_dump -U postgres earth_smart > backup.sql

# Restore
psql -U postgres -d earth_smart < backup.sql
```

### Automated Backups

Set up CRON job:
```bash
0 2 * * * pg_dump -U postgres earth_smart > /backups/earth_smart_$(date +\%Y\%m\%d).sql
```

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use HTTPS everywhere
- [ ] Enable PostgreSQL password authentication
- [ ] Set up firewall rules
- [ ] Enable 2FA for admin accounts
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Set up rate limiting
- [ ] Enable CORS only for trusted domains
- [ ] Use environment variables for secrets

## Getting Help

- **GitHub Issues:** Report bugs or request features
- **Discussions:** Ask questions
- **Documentation:** See ARCHITECTURE.md and API_SPEC.md
- **Email:** suman.suryabanshi@gmail.com

## Next Steps

1. Read [ARCHITECTURE.md](ARCHITECTURE.md) for system design
2. Check [API_SPEC.md](API_SPEC.md) for API endpoints
3. Review [ROADMAP.md](ROADMAP.md) for future features
4. Start contributing! See [CONTRIBUTING.md](CONTRIBUTING.md)

---

Happy coding! 🚀
