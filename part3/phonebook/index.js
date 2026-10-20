const mongoose = require('mongoose')
const { createApp } = require('./app')
const Person = require('./models/person')
async function start() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI must be configured')
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  await Person.init()
  const port = process.env.PORT || 3001
  const server = createApp().listen(port, () => console.log(`Phonebook listening on port ${port}`))
  const stop = () => server.close(async () => { await mongoose.disconnect(); process.exit(0) })
  process.on('SIGTERM', stop); process.on('SIGINT', stop)
}
start().catch(async error => { console.error('Startup failed:', error.name); await mongoose.disconnect(); process.exitCode = 1 })
