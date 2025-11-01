const mongoose = require('mongoose')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10)

const BookSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, default: () => nanoid() },
  title: { type: String, required: true },
  author: { type: String, default: '' },
  ownerId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('BT_Book', BookSchema)
