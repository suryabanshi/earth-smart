# Earth Smart Architecture

## System Overview

Earth Smart is a full-stack, scalable platform with clear separation between frontend and backend. It's designed to support multiple features and thousands of concurrent users.

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                     │
│  - React components                                       │
│  - TypeScript for type safety                            │
│  - Tailwind CSS for styling                              │
│  - Socket.io client for real-time updates               │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTPS/WS
┌──────────────────▼──────────────────────────────────────┐
│               Backend (Node.js/Express)                  │
│  - RESTful API endpoints                                 │
│  - JWT authentication                                    │
│  - WebSocket support via Socket.io                       │
│  - Real-time notifications                              │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│           Database (PostgreSQL)                          │
│  - Relational data model                                 │
│  - Optimized indexes                                     │
│  - ACID compliance                                       │
└──────────────────────────────────────────────────────────┘
```

## Tech Stack

### Frontend
- **Framework:** Next.js 14 with React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Real-time:** Socket.io client
- **State:** Zustand (for scalable state management)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** JavaScript (ES6+)
- **Authentication:** JWT + Bcrypt
- **WebSocket:** Socket.io
- **Database:** PostgreSQL 14+
- **Caching:** Redis (optional, for scalability)

### Infrastructure
- **Frontend Hosting:** Vercel (recommended for Next.js)
- **Backend Hosting:** Railway, Render, or AWS EC2
- **Database:** Managed PostgreSQL (AWS RDS, Supabase, Heroku Postgres)
- **CDN:** Cloudflare (optional, for static assets)

## Database Schema

### Core Tables

1. **users** - User profiles and authentication
   - id, name, email, password_hash, avatar_url, bio
   - Indexes: email (unique)

2. **posts** - User-generated content
   - id, user_id, content, likes_count, created_at
   - Indexes: user_id, created_at

3. **post_likes** - Post engagement tracking
   - id, post_id, user_id
   - Unique constraint: (post_id, user_id)

4. **follows** - User relationships
   - id, follower_id, following_id
   - Indexes: follower_id, following_id

5. **courses** - Learning content
   - id, title, instructor_id, level, price, description

6. **course_enrollments** - User course progress
   - id, user_id, course_id, progress, enrolled_at

7. **comments** - Post comments
   - id, post_id, user_id, content, created_at

8. **news** - News articles
   - id, title, category, author, url, published_at

9. **tools** - Tool marketplace
   - id, name, description, category, api_key

## API Architecture

### Authentication Flow

```
Client (Login) → Server (/api/auth/login)
                 ↓
             Verify password (bcrypt)
                 ↓
             Generate JWT token
                 ↓
             Return token to client
                 ↓
Client stores token → Subsequent requests include token
                 ↓
             Server validates token (authMiddleware)
                 ↓
             Grant access to protected routes
```

### Real-time Updates (WebSocket)

```
Client connects → Socket.io server
↓
Listen for events:
- post_created
- comment_added
- user_followed
- notification

Server broadcasts to relevant clients
↓
UI updates in real-time
```

## Scalability Considerations

### Database Optimization
- Connection pooling for efficient DB usage
- Indexed queries for fast lookups
- Partitioning posts table by date (future)
- Read replicas for analytics queries (future)

### Caching Strategy
- Redis caching for:
  - User profiles (frequently accessed)
  - Feed data (paginated)
  - Course listings
  - News articles

### Load Balancing
- Multiple backend instances behind load balancer
- Sticky sessions for WebSocket connections
- Horizontal scaling via container orchestration

### Security
- JWT tokens with expiration
- Bcrypt password hashing (10 rounds)
- CORS configuration
- Helmet.js for HTTP headers
- Input validation on all endpoints
- Rate limiting (future)

## Project Structure

```
earth-smart/
├── frontend/
│   ├── pages/              # Next.js pages
│   ├── components/         # Reusable React components
│   ├── styles/            # CSS files
│   ├── utils/             # Helper functions
│   ├── lib/               # Libraries and configs
│   ├── public/            # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── next.config.js
│
├── backend/
│   ├── routes/            # API route handlers
│   ├── controllers/       # Business logic
│   ├── middleware/        # Express middleware
│   ├── config/            # Configuration files
│   ├── models/            # Database queries
│   ├── utils/             # Helper functions
│   ├── server.js          # Entry point
│   └── package.json
│
├── database/
│   ├── schema.sql         # Database schema
│   ├── seed.sql           # Sample data
│   └── migrations/        # Migration scripts
│
├── docs/
│   ├── ARCHITECTURE.md    # This file
│   ├── API_SPEC.md        # API documentation
│   ├── ROADMAP.md         # Feature roadmap
│   └── CONTRIBUTING.md    # Contribution guide
│
└── package.json           # Monorepo config
```

## Performance Targets

- **Frontend:**
  - Initial load: < 3 seconds
  - Time to interactive: < 5 seconds
  - Lighthouse score: > 90

- **Backend:**
  - API response time: < 200ms (p95)
  - 99.9% uptime
  - Support 10,000+ concurrent users

## Security Architecture

1. **Authentication:** JWT-based with refresh tokens
2. **Authorization:** Role-based access control (RBAC) - future
3. **Data encryption:** HTTPS/TLS for all communication
4. **Password security:** Bcrypt hashing, minimum 10 rounds
5. **Rate limiting:** Prevent brute force attacks - future
6. **Input validation:** Sanitize all user inputs
7. **CSRF protection:** SameSite cookies
8. **Secrets management:** Environment variables for sensitive data

## Monitoring & Logging

- **Frontend:** Sentry for error tracking
- **Backend:** Morgan for HTTP logging
- **Database:** Native PostgreSQL logs
- **Performance:** Datadog or New Relic integration
- **Uptime:** Healthcheck endpoint at `/health`
