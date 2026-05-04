# Contributing to Earth Smart

Thank you for your interest in contributing to Earth Smart! We're building the future of digital creation together.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
4. **Make your changes**
5. **Commit your work** (`git commit -m 'Add amazing feature'`)
6. **Push to your branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git

### Install & Run

```bash
# Clone repo
git clone https://github.com/yourusername/earth-smart.git
cd earth-smart

# Install dependencies
npm run install:all

# Setup environment
cp .env.example .env.local
# Edit .env.local with your config

# Setup database
npm run db:migrate
npm run db:seed

# Start dev servers
npm run dev

# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

## Code Standards

### Style Guide

- **JavaScript/TypeScript:** Use ES6+, follow ESLint rules
- **React:** Functional components with hooks
- **CSS:** Tailwind CSS utility classes
- **Comments:** Only for "why", not "what"
- **Naming:** camelCase for variables/functions, PascalCase for components

### Example

```typescript
// ❌ Avoid
// Get the user by id
const getUser = async (id) => { ... }

// ✅ Good
const fetchUserById = async (id: number): Promise<User> => { ... }
```

### Commit Messages

Follow conventional commits:

```
feat: add new feature
fix: fix a bug
docs: update documentation
style: code style changes
refactor: refactor code
test: add tests
chore: dependency updates
```

Example:
```
feat: implement user messaging system

- Add message model to database
- Create messaging API endpoints
- Add real-time notifications via Socket.io
- Update frontend with chat UI
```

## Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure all tests pass** (`npm run test`)
4. **Request review** from maintainers
5. **Address review comments** promptly
6. **Merge only** when approved

### PR Title Format
```
[Type] Brief description (under 50 chars)

Examples:
[Feature] Add user messaging system
[Fix] Resolve feed pagination bug
[Docs] Update API documentation
```

## Testing

### Frontend
```bash
cd frontend
npm test
```

### Backend
```bash
cd backend
npm test
```

### Integration Tests
```bash
npm run test:integration
```

## Bug Reports

Found a bug? Please create an issue with:

1. **Descriptive title**
2. **Steps to reproduce**
3. **Expected behavior**
4. **Actual behavior**
5. **Screenshots** (if applicable)
6. **Environment** (OS, browser, Node version)

Template:
```markdown
## Description
Brief description of the bug

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
[If applicable]

## Environment
- OS: 
- Browser:
- Node Version:
```

## Feature Requests

Have an idea? Open an issue with:

1. **Clear description** of the feature
2. **Use case** and motivation
3. **Proposed solution** (if any)
4. **Alternatives considered**

## Coding Practices

### Backend
```javascript
// Use middleware for shared logic
router.post('/', authMiddleware, controller.create);

// Use async/await consistently
const handler = async (req, res) => {
  try {
    // logic
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
};

// Database queries should be in models
const query = 'SELECT * FROM users WHERE id = $1';
const result = await pool.query(query, [userId]);
```

### Frontend
```typescript
// Use functional components
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState('');

  const handleAction = useCallback(() => {
    setState('value');
  }, []);

  return <div>{state}</div>;
};

export default MyComponent;
```

## Performance

- Keep bundle size < 500KB (gzipped)
- Lighthouse score > 90
- API response time < 200ms (p95)
- Database queries should have indexes

## Security

- Never commit `.env` files
- Use parameterized queries for SQL
- Validate all user inputs
- Use HTTPS in production
- Keep dependencies updated

## Documentation

- Update README for major changes
- Add JSDoc comments for functions
- Document API changes in API_SPEC.md
- Update ROADMAP if applicable

## Community

- Be respectful and inclusive
- Help others in discussions
- Share knowledge and experiences
- Report issues responsibly

## Resources

- [Architecture Guide](ARCHITECTURE.md)
- [API Documentation](API_SPEC.md)
- [Product Roadmap](ROADMAP.md)
- [GitHub Issues](https://github.com/sumanxyz/earth-smart/issues)
- [GitHub Discussions](https://github.com/sumanxyz/earth-smart/discussions)

## Questions?

- Open an issue for bugs/features
- Start a discussion for questions
- Email: suman.suryabanshi@gmail.com
- Discord: [Join our community]

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making Earth Smart better!** 🌍✨
