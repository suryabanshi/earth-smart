const express = require('express')
const postController = require('../controllers/postController')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

router.get('/', postController.getPosts)
router.post('/', authMiddleware, postController.createPost)
router.post('/:postId/like', authMiddleware, postController.likePost)

module.exports = router
