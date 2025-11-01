const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth')
const Trade = require('../models/Trade')
const Book = require('../models/Book')
const User = require('../models/User')

router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id
    const trades = await Trade.find({ $or: [{ fromUserId: userId }, { toUserId: userId }] }).lean()
    const bookIds = [...new Set(trades.map(t => t.bookId))]
    const userIds = [...new Set(trades.flatMap(t => [t.fromUserId, t.toUserId]))]
    const [books, users] = await Promise.all([
      Book.find({ id: { $in: bookIds } }).lean(),
      User.find({ id: { $in: userIds } }).lean()
    ])
    const bookMap = new Map(books.map(b => [b.id, b]))
    const userMap = new Map(users.map(u => [u.id, u]))
    const enriched = trades.map(t => ({
      ...t,
      bookTitle: bookMap.get(t.bookId)?.title || 'Unknown',
      fromUsername: userMap.get(t.fromUserId)?.username || 'Unknown',
      toUsername: userMap.get(t.toUserId)?.username || 'Unknown'
    }))
    res.json(enriched)
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', requireAuth, async (req, res) => {
  try {
    const { bookId } = req.body || {}
    if (!bookId) return res.status(400).json({ error: 'bookId is required' })
    const book = await Book.findOne({ id: bookId }).lean()
    if (!book) return res.status(404).json({ error: 'Book not found' })
    if (book.ownerId === req.session.user.id) return res.status(400).json({ error: 'Cannot trade your own book' })
    const trade = await Trade.create({ bookId, fromUserId: req.session.user.id, toUserId: book.ownerId })
    res.status(201).json(trade.toObject())
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/:id/accept', requireAuth, async (req, res) => {
  try {
    const trade = await Trade.findOne({ id: req.params.id }).lean()
    if (!trade) return res.status(404).json({ error: 'Not found' })
    if (trade.toUserId !== req.session.user.id) return res.status(403).json({ error: 'Forbidden' })
    await Trade.updateOne({ id: req.params.id }, { $set: { status: 'accepted' } })
    const updated = await Trade.findOne({ id: req.params.id }).lean()
    res.json(updated)
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/:id/reject', requireAuth, async (req, res) => {
  try {
    const trade = await Trade.findOne({ id: req.params.id }).lean()
    if (!trade) return res.status(404).json({ error: 'Not found' })
    if (trade.toUserId !== req.session.user.id) return res.status(403).json({ error: 'Forbidden' })
    await Trade.updateOne({ id: req.params.id }, { $set: { status: 'rejected' } })
    const updated = await Trade.findOne({ id: req.params.id }).lean()
    res.json(updated)
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
