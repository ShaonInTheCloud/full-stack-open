const express = require('express')
const morgan = require('morgan')

const samplePersons = [
  { id: '1', name: 'Arto Hellas', number: '040-123456' },
  { id: '2', name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: '3', name: 'Dan Abramov', number: '12-43-234345' },
  { id: '4', name: 'Mary Poppendieck', number: '39-23-6423122' },
]

morgan.token('post-body', request => request.method === 'POST' ? JSON.stringify(request.body) : '')

function createApp({ logStream } = {}) {
  const app = express()
  let persons = samplePersons.map(person => ({ ...person }))
  app.use(express.json())
  // Morgan's tiny fields, followed by the request body required in exercise 3.8.
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-body',
    logStream ? { stream: logStream } : {}))

  app.get('/api/persons', (request, response) => response.json(persons))
  app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date().toString()}</p>`)
  })
  app.get('/api/persons/:id', (request, response) => {
    const person = persons.find(person => person.id === request.params.id)
    if (!person) return response.status(404).json({ error: 'person not found' })
    response.json(person)
  })
  app.delete('/api/persons/:id', (request, response) => {
    persons = persons.filter(person => person.id !== request.params.id)
    response.status(204).end()
  })
  app.post('/api/persons', (request, response) => {
    const name = typeof request.body?.name === 'string' ? request.body.name.trim() : ''
    const number = typeof request.body?.number === 'string' ? request.body.number.trim() : ''
    if (!name || !number) return response.status(400).json({ error: 'name and number are required' })
    if (persons.some(person => person.name.toLowerCase() === name.toLowerCase())) {
      return response.status(400).json({ error: 'name must be unique' })
    }
    let id
    do { id = String(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) }
    while (persons.some(person => person.id === id))
    const person = { id, name, number }
    persons = persons.concat(person)
    response.status(201).json(person)
  })
  app.use((request, response) => response.status(404).json({ error: 'unknown endpoint' }))
  app.use((error, request, response, next) => {
    if (error.type === 'entity.parse.failed') return response.status(400).json({ error: 'invalid JSON' })
    next(error)
  })
  return app
}

module.exports = { createApp }
