const mongoose = require('mongoose')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10)

const TradeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, default: () => nanoid() },
  bookId: { type: String, required: true },
  fromUserId: { type: String, required: true },
  toUserId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('BT_Trade', TradeSchema)
