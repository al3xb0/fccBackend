const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const Recent = require('../models/Recent')

const PER_PAGE = 10
const SAMPLE = require('../sample_images.json')

async function saveRecent(term) {
  if (!term) return
  try {
    await Recent.create({ term })
    const count = await Recent.countDocuments()
    if (count > 10) {
      const docs = await Recent.find({}).sort({ when: -1 }).skip(10).select('_id').lean()
      const ids = docs.map(d => d._id)
      if (ids.length) await Recent.deleteMany({ _id: { $in: ids } })
    }
  } catch {}
}

// GET /api/imagesearch/:query?page=1
router.get('/imagesearch/:query', async (req, res) => {
  const query = req.params.query
  let page = parseInt(req.query.page, 10)
  if (!page || page < 1) page = 1
  const offset = (page - 1) * PER_PAGE

  // Save recent (non-blocking)
  try { saveRecent(query) } catch {}

  const SERP_KEY = process.env.SERPAPI_KEY || process.env.SERPAPI_API_KEY
  if (SERP_KEY) {
    try {
      const searchUrl = `https://serpapi.com/search?engine=google_images_light&api_key=${SERP_KEY}&q=${encodeURIComponent(query)}&start=${offset}`
      const response = await fetch(searchUrl)
      if (!response.ok) {
        const error = await response.text()
        console.error('SerpAPI error:', error)
        return res.status(502).json({ error: 'Error from SerpAPI', details: error })
      }
      const data = await response.json()
      const mapped = (data.images_results || []).slice(0, PER_PAGE).map(item => ({
        url: item.original || item.link,
        snippet: item.title || '',
        thumbnail: item.thumbnail,
        context: item.source
      }))
      return res.json(mapped)
    } catch (err) {
      console.error('Search error:', err)
      return res.status(500).json({ error: 'Search error', details: err.message })
    }
  }

  // Fallback: sample data
  console.warn('SERPAPI key not found. Using sample data fallback.')
  const images = (SAMPLE && SAMPLE.images) ? SAMPLE.images : []
  const sliced = images.slice(offset, offset + PER_PAGE).map(img => ({
    url: img.url,
    snippet: img.description || '',
    thumbnail: (img.thumbnail && img.thumbnail.url) || null,
    context: img.parentPage || null
  }))
  res.json(sliced)
})

module.exports = router
