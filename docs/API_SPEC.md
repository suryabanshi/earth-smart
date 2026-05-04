# Earth Smart API Specification

**Base URL:** `http://localhost:5000` (development) | `https://api.earthsmart.com` (production)

## Authentication

All authenticated endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Auth

#### POST /api/auth/register
Register a new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST /api/auth/login
Authenticate user and get JWT token.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### Posts

#### GET /api/posts
Get recent posts from all users (public).

**Query Parameters:**
- `limit` (number): Max results (default: 50)
- `offset` (number): Pagination offset (default: 0)

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "content": "Hello world!",
    "author": "John Doe",
    "likes": 5,
    "comments": 2,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

#### POST /api/posts
Create a new post (authenticated).

**Request:**
```json
{
  "content": "My first post on Earth Smart!"
}
```

**Response (201):**
```json
{
  "id": 1,
  "user_id": 1,
  "content": "My first post on Earth Smart!",
  "likes": 0,
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### POST /api/posts/:postId/like
Like a post (authenticated).

**Response (200):**
```json
{
  "liked": true
}
```

---

### Users

#### GET /api/users/:userId
Get user profile by ID.

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "bio": "Web developer & entrepreneur",
  "avatar_url": "https://...",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### POST /api/users/:userId/follow
Follow a user (authenticated).

**Response (200):**
```json
{
  "following": true
}
```

---

### Courses

#### GET /api/courses
Get all available courses.

**Query Parameters:**
- `level` (string): Filter by level (Beginner, Intermediate, Advanced)
- `category` (string): Filter by category

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Web Development Basics",
    "instructor": "John Doe",
    "level": "Beginner",
    "price": 29.99,
    "description": "Learn HTML, CSS, and JavaScript fundamentals"
  }
]
```

#### POST /api/courses/:courseId/enroll
Enroll in a course (authenticated).

**Response (200):**
```json
{
  "enrolled": true,
  "message": "Successfully enrolled in course"
}
```

---

### News

#### GET /api/news
Get latest news articles.

**Query Parameters:**
- `category` (string): Filter by category
- `limit` (number): Max results (default: 20)

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "New AI Tools Launch",
    "author": "Tech News Daily",
    "category": "AI",
    "url": "https://...",
    "published_at": "2024-01-15T10:30:00Z"
  }
]
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials" or "No token provided"
}
```

### 404 Not Found
```json
{
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting (Future)

Endpoints will be rate-limited to prevent abuse:
- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated users

Headers returned:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

---

## WebSocket Events

Real-time updates via Socket.io connection.

### Client → Server Events
- `post_created`: New post created
- `comment_added`: Comment added to post
- `user_followed`: User followed another user
- `post_liked`: Post liked

### Server → Client Events
- `new_post`: Broadcast new post to followers
- `new_comment`: Notify post author
- `follower_added`: Notify followed user
- `notification`: Generic notification

---

## Pagination

List endpoints support cursor-based pagination:

```
GET /api/posts?limit=20&offset=0

Response headers:
X-Total-Count: 150
X-Limit: 20
X-Offset: 0
```

---

## Versioning

Current API version: `v1` (in URL: `/api/v1/...`)

Future versions will use versioned endpoints for backward compatibility.
