const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  fullName: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' }
}, { timestamps: true })

module.exports = mongoose.model('BT_User', UserSchema)
