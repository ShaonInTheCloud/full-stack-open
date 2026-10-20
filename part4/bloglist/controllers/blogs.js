const router = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')
router.get('/', async (_request, response) => response.json(await Blog.find({}).populate('user', { username: 1, name: 1 })))
router.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body || {}
  response.status(201).json(await new Blog({ title, author, url, likes, user: request.user._id }).save())
})
router.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).json({ error: 'Blog not found' })
  if (blog.user.toString() !== request.user.id) return response.status(403).json({ error: 'Only the creator can delete this blog' })
  await blog.deleteOne()
  response.status(204).end()
})
// The course permits updating likes without transferring ownership or editing other fields.
router.put('/:id', async (request, response) => {
  const likes = request.body?.likes
  if (!Number.isInteger(likes) || likes < 0) return response.status(400).json({ error: 'Likes must be a non-negative integer' })
  const blog = await Blog.findByIdAndUpdate(request.params.id, { likes }, { new: true, runValidators: true })
  if (!blog) return response.status(404).json({ error: 'Blog not found' })
  response.json(blog)
})
module.exports = router
