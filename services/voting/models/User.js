const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('VT_User', UserSchema)
