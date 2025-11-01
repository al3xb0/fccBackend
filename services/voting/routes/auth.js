const express = require('express')
const router = express.Router()
const User = require('../models/User')

router.post('/login', async (req, res) => {
  try {
    const { username } = req.body || {}
    if (!username || typeof username !== 'string') return res.status(400).json({ error: 'username is required' })
    const id = username.toLowerCase().replace(/[^a-z0-9_-]+/g, '-')
    let user = await User.findOne({ id }).lean()
    if (!user) {
      user = (await User.create({ id, name: username })).toObject()
    }
    req.session.user = { id, name: username }
    res.json({ user: req.session.user })
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }))
})

module.exports = router
