const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minLength: [3, 'Name must contain at least 3 characters'] },
  number: { type: String, required: true, trim: true, minLength: [8, 'Number must contain at least 8 characters'],
    validate: { validator: value => /^\d{2,3}-\d+$/.test(value), message: 'Use 2 or 3 digits, a hyphen, then digits' } },
})
schema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } })
schema.set('toJSON', { transform: (_document, result) => {
  result.id = result._id.toString(); delete result._id; delete result.__v
} })
module.exports = mongoose.model('Person', schema)
