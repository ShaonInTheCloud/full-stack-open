const mongoose = require('mongoose')
const config = require('./utils/config')
const app = require('./app')
const User = require('./models/user')
async function start() {
  if (!config.mongoUri || !config.secret || config.secret.length < 32) throw new Error('Set MONGODB_URI and a SECRET of at least 32 characters')
  await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 10000 })
  await User.init()
  const server = app.listen(config.port, () => console.log(`Blog List listening on port ${config.port}`))
  const stop = () => server.close(async () => { await mongoose.disconnect(); process.exit(0) })
  process.on('SIGTERM', stop); process.on('SIGINT', stop)
}
start().catch(async error => { console.error('Startup failed:', error.name); await mongoose.disconnect(); process.exitCode = 1 })
