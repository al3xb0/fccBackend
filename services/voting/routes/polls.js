const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth')
const Poll = require('../models/Poll')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8)

router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find({}).lean()
    res.json(polls)
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const poll = await Poll.findOne({ id: req.params.id }).lean()
    if (!poll) return res.status(404).json({ error: 'Not found' })
    res.json(poll)
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, options } = req.body || {}
    if (!title || typeof title !== 'string') return res.status(400).json({ error: 'title is required' })
    if (!Array.isArray(options) || options.length < 1) return res.status(400).json({ error: 'options must be non-empty array' })

    const poll = await Poll.create({
      title: title.trim(),
      ownerId: req.session.user.id,
      options: options.map(t => ({ id: nanoid(), text: String(t), votes: 0 }))
    })
    res.status(201).json(poll.toObject())
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/:id/vote', async (req, res) => {
  try {
    const { optionId, newOptionText } = req.body || {}
    const poll = await Poll.findOne({ id: req.params.id })
    if (!poll) return res.status(404).json({ error: 'Not found' })

    let optId = optionId
    if (!optId && newOptionText) {
      const newOptId = nanoid()
      poll.options.push({ id: newOptId, text: String(newOptionText), votes: 0 })
      optId = newOptId
    }
    const opt = poll.options.find(o => o.id === optId)
    if (!opt) return res.status(400).json({ error: 'Invalid option' })

    const sid = req.sessionID
    const previous = poll.voters.get(sid)
    if (previous && previous === optId) {
      await poll.save()
      return res.json(poll.toObject())
    }
    if (previous) {
      const prevOpt = poll.options.find(o => o.id === previous)
      if (prevOpt) prevOpt.votes = Math.max(0, prevOpt.votes - 1)
    }
    opt.votes += 1
    poll.voters.set(sid, optId)

    await poll.save()
    res.json(poll.toObject())
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const poll = await Poll.findOne({ id: req.params.id }).lean()
    if (!poll) return res.status(404).json({ error: 'Not found' })
    if (poll.ownerId !== req.session.user.id) return res.status(403).json({ error: 'Forbidden' })
    await Poll.deleteOne({ id: req.params.id })
    res.json({ ok: true, removedId: req.params.id })
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
