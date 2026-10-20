module.exports = (error, _request, response, _next) => {
  if (error.type === 'entity.parse.failed') return response.status(400).json({ error: 'Invalid JSON' })
  if (error.name === 'CastError') return response.status(400).json({ error: 'Invalid person ID' })
  if (error.name === 'ValidationError') return response.status(400).json({ error: error.message })
  if (error.code === 11000) return response.status(400).json({ error: 'Name must be unique' })
  console.error('Phonebook request failed:', error.name)
  response.status(500).json({ error: 'The server could not complete the request' })
}
