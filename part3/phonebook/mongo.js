const mongoose = require('mongoose')
const Person = require('./models/person')
async function main() {
  const [password, name, number] = process.argv.slice(2)
  if (!password || (name && !number) || (!name && number)) throw new Error('Usage: node --env-file=.env mongo.js PASSWORD [NAME NUMBER]')
  const template = process.env.MONGODB_URI_TEMPLATE
  if (!template?.includes('<password>')) throw new Error('Set MONGODB_URI_TEMPLATE with a <password> placeholder in .env')
  await mongoose.connect(template.replace('<password>', encodeURIComponent(password)), { serverSelectionTimeoutMS: 10000 })
  await Person.init()
  if (name) {
    const person = await new Person({ name, number }).save()
    console.log(`added ${person.name} number ${person.number} to phonebook`)
  } else {
    console.log('phonebook:')
    for (const person of await Person.find({})) console.log(`${person.name} ${person.number}`)
  }
}
main().catch(error => { console.error('Command failed:', error.name); process.exitCode = 1 }).finally(() => mongoose.disconnect())
