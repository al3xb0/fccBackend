const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  githubId: { type: String },
  username: { type: String, required: true },
  displayName: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  email: { type: String, default: '' },
  passwordHash: { type: String, default: '' }
}, { timestamps: true })

module.exports = mongoose.model('PT_User', UserSchema)
