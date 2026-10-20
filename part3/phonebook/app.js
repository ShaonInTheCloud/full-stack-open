const express = require('express')
const morgan = require('morgan')
const path = require('node:path')
const Person = require('./models/person')
const errorHandler = require('./middleware/errors')
morgan.token('post-body', request => request.method === 'POST' ? JSON.stringify(request.body) : '')
function createApp({ logStream } = {}) {
  const app = express()
  app.use(express.json())
  // Body logging is an exercise-only option; production logs omit contact data.
  const format = process.env.LOG_REQUEST_BODIES === 'true'
    ? ':method :url :status :res[content-length] - :response-time ms :post-body' : 'tiny'
  app.use(morgan(format, logStream ? { stream: logStream } : {}))
  app.use(express.static(path.join(__dirname, 'dist')))
  app.get('/api/persons', async (_request, response) => response.json(await Person.find({})))
  app.get('/info', async (_request, response) => {
    const count = await Person.countDocuments({})
    response.send(`<p>Phonebook has info for ${count} people</p><p>${new Date().toString()}</p>`)
  })
  app.get('/api/persons/:id', async (request, response) => {
    const person = await Person.findById(request.params.id)
    if (!person) return response.status(404).json({ error: 'Person not found' })
    response.json(person)
  })
  app.post('/api/persons', async (request, response) => {
    const { name, number } = request.body || {}
    if (typeof name !== 'string' || typeof number !== 'string') return response.status(400).json({ error: 'Name and number must be strings' })
    response.status(201).json(await new Person({ name, number }).save())
  })
  app.put('/api/persons/:id', async (request, response) => {
    const person = await Person.findById(request.params.id)
    if (!person) return response.status(404).json({ error: 'Person not found' })
    if (typeof request.body?.number !== 'string') return response.status(400).json({ error: 'Number must be a string' })
    person.number = request.body.number
    response.json(await person.save())
  })
  app.delete('/api/persons/:id', async (request, response) => {
    const person = await Person.findByIdAndDelete(request.params.id)
    if (!person) return response.status(404).json({ error: 'Person not found' })
    response.status(204).end()
  })
  app.use((_request, response) => response.status(404).json({ error: 'Unknown endpoint' }))
  app.use(errorHandler)
  return app
}
module.exports = { createApp }
