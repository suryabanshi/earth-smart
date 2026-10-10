const express = require('express')
const pool = require('../config/db')

const router = express.Router()

// GET /api/news — latest news, optionally filtered by ?category=
router.get('/', async (req, res) => {
  try {
    const { category } = req.query
    const result = category
      ? await pool.query(
          'SELECT * FROM news WHERE category = $1 ORDER BY published_at DESC NULLS LAST LIMIT 50',
          [category]
        )
      : await pool.query(
          'SELECT * FROM news ORDER BY published_at DESC NULLS LAST LIMIT 50'
        )
    res.json(result.rows)
  } catch (err) {
    console.error('Get news error:', err)
    res.status(500).json({ message: 'Failed to fetch news' })
  }
})

module.exports = router
