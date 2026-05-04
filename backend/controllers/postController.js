const pool = require('../config/db')

exports.getPosts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.name as author
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 50
    `)
    res.json(result.rows)
  } catch (err) {
    console.error('Get posts error:', err)
    res.status(500).json({ message: 'Failed to fetch posts' })
  }
}

exports.createPost = async (req, res) => {
  try {
    const { content } = req.body
    const userId = req.userId

    if (!content) {
      return res.status(400).json({ message: 'Content is required' })
    }

    const result = await pool.query(
      'INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *',
      [userId, content]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Create post error:', err)
    res.status(500).json({ message: 'Failed to create post' })
  }
}

exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params
    const userId = req.userId

    const result = await pool.query(
      'INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
      [postId, userId]
    )

    res.json({ liked: result.rows.length > 0 })
  } catch (err) {
    console.error('Like post error:', err)
    res.status(500).json({ message: 'Failed to like post' })
  }
}
