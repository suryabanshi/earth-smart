const express = require('express')
const authMiddleware = require('../middleware/auth')
const pool = require('../config/db')

const router = express.Router()

router.get('/:userId', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [req.params.userId])
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user' })
  }
})

router.post('/:userId/follow', authMiddleware, async (req, res) => {
  try {
    const followerId = req.userId
    const followingId = req.params.userId

    if (followerId === parseInt(followingId)) {
      return res.status(400).json({ message: 'Cannot follow yourself' })
    }

    const result = await pool.query(
      'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
      [followerId, followingId]
    )

    res.json({ following: result.rows.length > 0 })
  } catch (err) {
    res.status(500).json({ message: 'Failed to follow user' })
  }
})

module.exports = router
