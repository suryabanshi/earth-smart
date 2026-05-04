# Earth Smart 🌍

**A next-generation mega platform for design, building, social networking, news, tools, and learning.**

By **Suman Suryabanshi**

---

## Vision

Earth Smart is an all-in-one ecosystem platform designed to empower creators, builders, and learners. It combines:

- 🛠️ **Design & Build** – Collaborative workspace for creating projects and products
- 👥 **Social Network** – Connect with builders, share ideas, and grow communities
- 📰 **News & Insights** – Curated content and trending topics
- 📚 **Learning Platform** – Structured courses and skill development
- 🔧 **Tools Marketplace** – Integrations, APIs, and productivity tools
- 🌐 **Everything Else** – Extensible platform for future innovations

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/earth-smart.git
cd earth-smart

# Install dependencies
npm run install:all

# Setup environment
cp .env.example .env.local
# Edit .env.local with your config

# Run migrations
npm run db:migrate

# Start dev server
npm run dev
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## Project Structure

```
earth-smart/
├── frontend/          # Next.js React app
├── backend/           # Node.js/Express API
├── database/          # PostgreSQL schemas & migrations
├── docs/              # Architecture & specs
└── README.md
```

---

## Key Features (MVP)

- ✅ User authentication & profiles
- ✅ Social feed (posts, likes, comments)
- ✅ User connections (follow/unfollow)
- ✅ Real-time notifications
- ✅ Basic design workspace
- ✅ News aggregation feed
- ✅ Learning resources directory

---

## Architecture

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed system design.

---

## API Documentation

See [API_SPEC.md](docs/API_SPEC.md) for full API endpoints and usage.

---

## Roadmap

See [ROADMAP.md](docs/ROADMAP.md) for features, phases, and timelines.

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Redux Toolkit
- **Real-time:** Socket.io

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Cache:** Redis
- **Auth:** JWT + Bcrypt
- **Deployment:** Docker

---

## Environment Variables

See `.env.example` for all required variables.

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/earth_smart

# JWT
JWT_SECRET=your-secret-key

# Backend
PORT=5000
NODE_ENV=development

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Development

### Install all dependencies
```bash
npm run install:all
```

### Start development server
```bash
npm run dev
```

### Run tests
```bash
npm run test
```

### Build for production
```bash
npm run build
```

---

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

---

## License

MIT License - See LICENSE file

---

## Contact

**Created by:** Suman Suryabanshi  
**Email:** suman.suryabanshi@gmail.com

---

**Status:** 🚀 MVP in active development
