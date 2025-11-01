const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10)
const User = require('../models/User')

function normalizeEmail(email) { return String(email || '').trim().toLowerCase() }
function toPublicUser(user) {
  if (!user) return null
  const { id, username, displayName, avatarUrl, email } = user
  return { id, username, displayName, avatarUrl, email }
}

router.get('/me', async (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    const user = await User.findOne({ id: req.user.id }).lean()
    if (user) return res.json({ user: toPublicUser(user) })
  }
  res.status(401).json({ error: 'Not authenticated' })
})

router.post('/logout', (req, res) => {
  req.logout(() => res.json({ ok: true }))
})

router.post('/register', async (req, res) => {
  const { email, password, displayName } = req.body || {}
  const e = normalizeEmail(email)
  if (!e) return res.status(400).json({ error: 'Email is required' })
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return res.status(400).json({ error: 'Invalid email' })
  if (!password || String(password).length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })

  const existing = await User.findOne({ email: e }).lean()
  if (existing) return res.status(409).json({ error: 'Email already registered' })

  const username = (displayName && String(displayName).trim()) || e.split('@')[0]
  const passwordHash = await bcrypt.hash(String(password), 10)
  const user = await User.create({ id: nanoid(), email: e, passwordHash, username, displayName: displayName?.trim() || username, avatarUrl: '' })

  req.login({ id: user.id }, err => {
    if (err) return res.status(500).json({ error: 'Login after register failed' })
    return res.status(201).json({ user: toPublicUser(user.toObject()) })
  })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {}
  const e = normalizeEmail(email)
  if (!e || !password) return res.status(400).json({ error: 'Email and password are required' })

  const user = await User.findOne({ email: e }).lean()
  if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid email or password' })
  const ok = await bcrypt.compare(String(password), user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid email or password' })

  req.login({ id: user.id }, err => {
    if (err) return res.status(500).json({ error: 'Login failed' })
    return res.json({ user: toPublicUser(user) })
  })
})


router.get('/github', passport.authenticate('github', { scope: ['user:email'] }))
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173/services/pinterest')
})

module.exports = router
