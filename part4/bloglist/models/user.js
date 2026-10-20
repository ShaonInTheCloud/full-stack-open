const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minLength: 3, trim: true },
  name: { type: String, default: '' },
  passwordHash: { type: String, required: true, select: false },
})
// A virtual relationship keeps the blog's user field as the single source of truth.
schema.virtual('blogs', { ref: 'Blog', localField: '_id', foreignField: 'user' })
schema.set('toJSON', { virtuals: true, transform: (_doc, result) => {
  result.id = result._id.toString(); delete result._id; delete result.__v; delete result.passwordHash
} })
module.exports = mongoose.model('User', schema)
