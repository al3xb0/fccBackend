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
      user = await User.create({ id, username, fullName: '', city: '', state: '' })
      user = user.toObject()
    }
    req.session.user = { id: user.id, username: user.username }
    res.json({ user })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }))
})

router.get('/me', async (req, res) => {
  try {
    if (!req.session || !req.session.user) return res.status(401).json({ error: 'Not authenticated' })
    const user = await User.findOne({ id: req.session.user.id }).lean()
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ user })
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
