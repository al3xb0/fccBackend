const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')

const IMAGE_SEARCH_API = process.env.IMAGE_SEARCH_API || process.env.IMAGE_SEARCH_API_BASE || 'http://localhost:3003'

router.get('/', async (req, res) => {
  const q = (req.query.q || '').toString().trim()
  if (!q) return res.status(400).json({ error: 'q is required' })
  try {
    const url = `${IMAGE_SEARCH_API.replace(/\/$/, '')}/api/imagesearch/${encodeURIComponent(q)}?page=1`
    const resp = await fetch(url)
    if (!resp.ok) {
      let info = ''
      try { info = await resp.text() } catch {}
      return res.status(502).json({ error: 'Image Search service error', details: info || `${resp.status}` })
    }
    const data = await resp.json()
    const images = (Array.isArray(data) ? data : []).slice(0, 20).map(r => ({ url: r.url, thumbnail: r.thumbnail || null, title: r.snippet || '' }))
    return res.json({ images })
  } catch (err) {
    console.error('Search proxy error:', err)
    return res.status(500).json({ error: 'Search proxy error', details: err.message })
  }
})

module.exports = router
