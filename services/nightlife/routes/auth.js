const express = require('express')
const router = express.Router()

router.post('/login', (req, res) => {
  const { username } = req.body || {}
  if (!username || typeof username !== 'string') return res.status(400).json({ error: 'username is required' })
  const id = username.toLowerCase().replace(/[^a-z0-9_-]+/g, '-')
  req.session.user = { id, name: username }
  res.json({ user: req.session.user })
})

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }))
})

module.exports = router
