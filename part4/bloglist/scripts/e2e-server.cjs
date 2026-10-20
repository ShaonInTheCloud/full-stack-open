// A dedicated loopback-only test server; never imports deployment database credentials.
const { randomBytes } = require('node:crypto')
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const express = require('express')
async function start() {
  process.env.NODE_ENV = 'test'
  process.env.SECRET = randomBytes(48).toString('hex')
  const mongo = await MongoMemoryServer.create()
  await mongoose.connect(mongo.getUri(), { dbName: 'bloglist_e2e' })
  const User = require('../models/user')
  const Blog = require('../models/blog')
  await User.init()
  const app = express()
  app.post('/api/testing/reset', async (_request, response) => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    response.status(204).end()
  })
  app.use(require('../app'))
  const server = app.listen(3003, '127.0.0.1', () =>
    console.log('Isolated Blog List E2E server ready'),
  )
  const stop = () =>
    server.close(async () => {
      await mongoose.disconnect()
      await mongo.stop()
      process.exit(0)
    })
  process.on('SIGTERM', stop)
  process.on('SIGINT', stop)
}
start().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
