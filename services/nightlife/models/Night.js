const mongoose = require('mongoose')

const NightSchema = new mongoose.Schema({
  dateKey: { type: String, required: true },
  businessId: { type: String, required: true },
  users: { type: [String], default: [] }
}, { timestamps: true })

NightSchema.index({ dateKey: 1, businessId: 1 }, { unique: true })

module.exports = mongoose.model('NL_Night', NightSchema)
