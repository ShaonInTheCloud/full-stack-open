const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, default: '' },
  url: { type: String, required: true, trim: true },
  likes: { type: Number, default: 0, min: 0, validate: Number.isInteger },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
})
schema.set('toJSON', { transform: (_doc, result) => {
  result.id = result._id.toString(); delete result._id; delete result.__v
} })
module.exports = mongoose.model('Blog', schema)
