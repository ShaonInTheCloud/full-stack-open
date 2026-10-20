const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../models/user')
const config = require('./config')
const tokenExtractor = (request, _response, next) => {
  const header = request.get('authorization') || ''
  request.token = /^Bearer /i.test(header) ? header.slice(7).trim() : null
  next()
}
const userExtractor = async (request, response, next) => {
  if (!request.token) return response.status(401).json({ error: 'Token required' })
  const decoded = jwt.verify(request.token, config.secret, { algorithms: ['HS256'] })
  if (!mongoose.isObjectIdOrHexString(decoded.id)) return response.status(401).json({ error: 'Invalid token' })
  const user = await User.findById(decoded.id)
  if (!user) return response.status(401).json({ error: 'User no longer exists' })
  request.user = user
  next()
}
const unknownEndpoint = (_request, response) => response.status(404).json({ error: 'Unknown endpoint' })
const errorHandler = (error, _request, response, _next) => {
  if (['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(error.name)) return response.status(401).json({ error: 'Invalid or expired token' })
  if (error.name === 'ValidationError') return response.status(400).json({ error: error.message })
  if (error.name === 'CastError') return response.status(400).json({ error: 'Invalid ID or field value' })
  if (error.code === 11000) return response.status(400).json({ error: 'Username must be unique' })
  if (error.type === 'entity.parse.failed') return response.status(400).json({ error: 'Invalid JSON' })
  console.error('Request failed:', error.name)
  response.status(500).json({ error: 'The server could not complete the request' })
}
module.exports = { tokenExtractor, userExtractor, unknownEndpoint, errorHandler }
