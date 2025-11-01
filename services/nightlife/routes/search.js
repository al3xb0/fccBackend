const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const crypto = require('crypto')
const Night = require('../models/Night')

const SERP_KEY = process.env.SERPAPI_KEY || process.env.SERPAPI_API_KEY || ''

function todayKey() { return new Date().toISOString().slice(0, 10) }
function hashId(s) { try { return crypto.createHash('sha1').update(String(s)).digest('hex').slice(0,16) } catch { return String(Math.random()).slice(2,10) } }

async function getGoingCounts(businessIds, dateKey) {
  const docs = await Night.find({ dateKey, businessId: { $in: businessIds } }).lean()
  const map = new Map(docs.map(d => [d.businessId, (d.users || []).length]))
  return businessIds.reduce((acc, id) => { acc[id] = map.get(id) || 0; return acc }, {})
}

router.get('/', async (req, res) => {
  const location = (req.query.location || '').toString().trim()
  if (!location) return res.status(400).json({ error: 'location is required' })
  const dateKey = todayKey()

  if (!SERP_KEY) {
    console.warn('SERPAPI key not found; using sample data fallback')
    const sample = require('../sample_bars.json')
    const items = (sample.businesses || []).map(b => ({
      id: b.id,
      name: b.name,
      rating: b.rating,
      address: (b.location && b.location.display_address) ? b.location.display_address.join(', ') : '',
      image_url: b.image_url || ''
    }))
    const ids = items.map(i => i.id)
    const counts = await getGoingCounts(ids, dateKey)
    const merged = items.map(i => ({ ...i, goingCount: counts[i.id] || 0 }))
    return res.json({ source: 'sample', items: merged })
  }

  try {
    const params = new URLSearchParams({ engine: 'yelp', find_desc: 'bars', find_loc: location, api_key: SERP_KEY })
    const url = `https://serpapi.com/search?${params.toString()}`
    const resp = await fetch(url)
    if (!resp.ok) {
      const text = await resp.text()
      console.error('SerpApi Yelp error:', text)
      return res.status(502).json({ error: 'Error from SerpApi Yelp', details: text })
    }
    const data = await resp.json()
    const organic = Array.isArray(data.organic_results) ? data.organic_results : []
    const items = organic.map(it => {
      const link = it.link || it.url || ''
      const id = hashId(link || (it.title || 'item'))
      const name = it.title || it.name || 'Unknown'
      const rating = typeof it.rating === 'number' ? it.rating : (parseFloat(it.rating) || undefined)
      const address = it.address || it.neighborhood || it.snippet || ''
      const image_url = it.image || it.thumbnail || ''
      return { id, name, rating, address, image_url }
    })
    const ids = items.map(i => i.id)
    const counts = await getGoingCounts(ids, dateKey)
    const merged = items.map(i => ({ ...i, goingCount: counts[i.id] || 0 }))
    res.json({ source: 'serpapi:yelp', items: merged })
  } catch (err) {
    console.error('Search error:', err)
    res.status(500).json({ error: 'Search error', details: err.message })
  }
})

module.exports = router
