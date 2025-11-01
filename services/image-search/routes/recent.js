const express = require('express')
const router = express.Router()
const Recent = require('../models/Recent')

router.get('/recent', async (req, res) => {
  try {
    const arr = await Recent.find({}).sort({ when: -1 }).limit(10).lean()
    res.json(arr.map(item => ({ term: item.term, when: item.when })))
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
