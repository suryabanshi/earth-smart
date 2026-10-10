const express = require('express')
const pool = require('../config/db')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// GET /api/courses — list courses with instructor name
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.name AS instructor
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      ORDER BY c.created_at DESC
      LIMIT 50
    `)
    res.json(result.rows)
  } catch (err) {
    console.error('Get courses error:', err)
    res.status(500).json({ message: 'Failed to fetch courses' })
  }
})

// POST /api/courses/:courseId/enroll — enroll the authenticated user
router.post('/:courseId/enroll', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId
    const { courseId } = req.params

    const result = await pool.query(
      `INSERT INTO course_enrollments (user_id, course_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, course_id) DO NOTHING
       RETURNING *`,
      [userId, courseId]
    )

    const alreadyEnrolled = result.rows.length === 0
    res.json({
      enrolled: true,
      alreadyEnrolled,
      message: alreadyEnrolled
        ? 'Already enrolled in course'
        : 'Successfully enrolled in course',
    })
  } catch (err) {
    console.error('Enroll error:', err)
    res.status(500).json({ message: 'Failed to enroll in course' })
  }
})

module.exports = router
