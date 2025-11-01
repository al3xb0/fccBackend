const mongoose = require('mongoose')

const RecentSchema = new mongoose.Schema({
  term: { type: String, required: true },
  when: { type: Date, default: Date.now }
})

RecentSchema.index({ when: -1 })

module.exports = mongoose.model('IS_Recent', RecentSchema)
