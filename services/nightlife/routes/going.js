const express = require('express')
const router = express.Router()
const Night = require('../models/Night')
const { requireAuth } = require('../middleware/auth')

function todayKey() { return new Date().toISOString().slice(0, 10) }

router.post('/', requireAuth, async (req, res) => {
  const { businessId, date } = req.body || {}
  if (!businessId) return res.status(400).json({ error: 'businessId is required' })
  const dateKey = (date || todayKey()).slice(0, 10)
  const uid = req.session.user.id
  try {
    const doc = await Night.findOneAndUpdate(
      { dateKey, businessId },
      { $addToSet: { users: uid } },
      { upsert: true, new: true }
    ).lean()
    res.json({ ok: true, date: dateKey, businessId, users: doc.users, goingCount: doc.users.length })
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/', requireAuth, async (req, res) => {
  const { businessId, date } = req.body || {}
  if (!businessId) return res.status(400).json({ error: 'businessId is required' })
  const dateKey = (date || todayKey()).slice(0, 10)
  const uid = req.session.user.id
  try {
    const doc = await Night.findOneAndUpdate(
      { dateKey, businessId },
      { $pull: { users: uid } },
      { new: true }
    ).lean()
    const users = doc?.users || []
    res.json({ ok: true, date: dateKey, businessId, users, goingCount: users.length })
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
