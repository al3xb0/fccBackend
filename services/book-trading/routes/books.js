const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth')
const Book = require('../models/Book')
const User = require('../models/User')

router.get('/', async (req, res) => {
  try {
    const books = await Book.find({}).lean()
    const ownerIds = [...new Set(books.map(b => b.ownerId))]
    const users = await User.find({ id: { $in: ownerIds } }).lean()
    const userMap = new Map(users.map(u => [u.id, u]))
    const withOwner = books.map(b => ({ ...b, ownerName: userMap.get(b.ownerId)?.username || 'Unknown' }))
    res.json(withOwner)
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, author } = req.body || {}
    if (!title || typeof title !== 'string') return res.status(400).json({ error: 'title is required' })
    const book = await Book.create({ title: title.trim(), author: (author || '').trim(), ownerId: req.session.user.id })
    const owner = await User.findOne({ id: book.ownerId }).lean()
    res.status(201).json({ ...book.toObject(), ownerName: owner?.username || 'Unknown' })
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params.id }).lean()
    if (!book) return res.status(404).json({ error: 'Not found' })
    if (book.ownerId !== req.session.user.id) return res.status(403).json({ error: 'Forbidden' })
    await Book.deleteOne({ id: req.params.id })
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
