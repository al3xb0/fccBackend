const mongoose = require('mongoose')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10)

const OptionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
}, { _id: false })

const PollSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, default: () => nanoid() },
  title: { type: String, required: true },
  ownerId: { type: String, required: true },
  options: { type: [OptionSchema], default: [] },
  voters: { type: Map, of: String, default: {} },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('VT_Poll', PollSchema)
