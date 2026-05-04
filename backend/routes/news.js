const express = require('express')
const pool = require('../config/db')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    // Mock news data
    const newsData = [
      { id: 1, title: 'New AI Tools Launch', author: 'Tech News Daily', category: 'AI', url: '#' },
      { id: 2, title: 'Web Dev Trends 2024', author: 'Dev Weekly', category: 'Web', url: '#' },
      { id: 3, title: 'Startup Funding Report', author: 'Business Insider', category: 'Business', url: '#' },
    ]
    res.json(newsData)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch news' })
  }
})

module.exports = router
