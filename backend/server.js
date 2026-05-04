require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { createServer } = require('http')
const { Server } = require('socket.io')

const authRoutes = require('./routes/auth')
const postsRoutes = require('./routes/posts')
const usersRoutes = require('./routes/users')
const newsRoutes = require('./routes/news')
const coursesRoutes = require('./routes/courses')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
})

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/courses', coursesRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Socket.io events
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`🚀 Earth Smart API running on http://localhost:${PORT}`)
  console.log(`📱 WebSocket server ready`)
})
