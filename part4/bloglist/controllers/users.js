const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
router.get('/', async (_request, response) => {
  response.json(await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 }))
})
router.post('/', async (request, response) => {
  const { username, name, password } = request.body || {}
  if (typeof username !== 'string' || username.trim().length < 3 || typeof password !== 'string' || password.length < 3) {
    return response.status(400).json({ error: 'Username and password must each contain at least 3 characters' })
  }
  if (Buffer.byteLength(password, 'utf8') > 72) return response.status(400).json({ error: 'Password must be at most 72 UTF-8 bytes' })
  if (name !== undefined && typeof name !== 'string') return response.status(400).json({ error: 'Name must be a string' })
  const passwordHash = await bcrypt.hash(password, 10)
  response.status(201).json(await new User({ username: username.trim(), name, passwordHash }).save())
})
module.exports = router
