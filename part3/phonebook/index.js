const { createApp } = require('./app')
const port = process.env.PORT || 3001
createApp().listen(port, () => console.log(`Phonebook API listening on port ${port}`))
