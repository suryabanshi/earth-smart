const express = require('express')
const pool = require('../config/db')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    // Mock courses data
    const coursesData = [
      { id: 1, title: 'Web Development Basics', instructor: 'John Doe', level: 'Beginner', price: 29.99 },
      { id: 2, title: 'Advanced JavaScript', instructor: 'Jane Smith', level: 'Intermediate', price: 49.99 },
      { id: 3, title: 'Full Stack Development', instructor: 'Mike Wilson', level: 'Advanced', price: 79.99 },
    ]
    res.json(coursesData)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch courses' })
  }
})

router.post('/:courseId/enroll', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId
    const courseId = req.params.courseId

    res.json({ enrolled: true, message: 'Successfully enrolled in course' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to enroll in course' })
  }
})

module.exports = router
