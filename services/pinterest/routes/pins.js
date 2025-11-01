const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth')
const Pin = require('../models/Pin')
const User = require('../models/User')

router.get('/', async (req, res) => {
  try {
    const userId = (req.query.userId || '').toString().trim() || null
    const q = userId ? { userId } : {}
    const pins = await Pin.find(q).sort({ createdAt: -1 }).lean()
    const userIds = [...new Set(pins.map(p => p.userId))]
    const users = await User.find({ id: { $in: userIds } }).lean()
    const map = new Map(users.map(u => [u.id, u]))
    const enriched = pins.map(p => ({ ...p, username: map.get(p.userId)?.username || 'Unknown', avatarUrl: map.get(p.userId)?.avatarUrl || '' }))
    res.json(enriched)
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', requireAuth, async (req, res) => {
  try {
    const { imageUrl, description } = req.body || {}
    if (!imageUrl || typeof imageUrl !== 'string') return res.status(400).json({ error: 'imageUrl is required' })
    try { new URL(imageUrl) } catch { return res.status(400).json({ error: 'Invalid imageUrl' }) }

    const pin = await Pin.create({ imageUrl: imageUrl.trim(), description: (description || '').trim(), userId: req.user.id })
    const user = await User.findOne({ id: req.user.id }).lean()
    res.status(201).json({ ...pin.toObject(), username: user?.username || '', avatarUrl: user?.avatarUrl || '' })
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const pin = await Pin.findOne({ id: req.params.id }).lean()
    if (!pin) return res.status(404).json({ error: 'Not found' })
    if (pin.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' })
    await Pin.deleteOne({ id: req.params.id })
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
