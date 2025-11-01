const mongoose = require('mongoose')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10)

const PinSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, default: () => nanoid() },
  imageUrl: { type: String, required: true },
  description: { type: String, default: '' },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('PT_Pin', PinSchema)
