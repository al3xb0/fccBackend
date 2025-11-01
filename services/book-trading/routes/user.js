const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth')
const User = require('../models/User')

router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.session.user.id }).lean()
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { fullName, city, state } = req.body || {}
    const update = {
      fullName: String(fullName || '').trim(),
      city: String(city || '').trim(),
      state: String(state || '').trim()
    }
    const user = await User.findOneAndUpdate({ id: req.session.user.id }, update, { new: true, lean: true })
    if (!user) return res.status(404).json({ error: 'User not found' })
    // keep minimal user in session
    req.session.user = { id: user.id, username: user.username }
    res.json(user)
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
