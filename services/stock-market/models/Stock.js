const mongoose = require('mongoose')

const PriceSchema = new mongoose.Schema({
  date: { type: String, required: true },
  close: { type: Number, required: true }
}, { _id: false })

const StockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  prices: { type: [PriceSchema], default: [] }
})

StockSchema.pre('save', function(next) {
  if (this.symbol) this.symbol = this.symbol.toUpperCase()
  next()
})

module.exports = mongoose.model('SM_Stock', StockSchema)
