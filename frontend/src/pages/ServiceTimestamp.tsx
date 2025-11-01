import React, { useState } from 'react'
import type { TimestampResult } from '../services/timestamp/types'
import { fetchTimestamp as apiFetchTimestamp } from '../services/timestamp/api'

export default function ServiceTimestamp() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<TimestampResult | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchTimestamp = async (dateStr?: string) => {
    setLoading(true)
    setResult(null)
    try {
      const json = await apiFetchTimestamp(dateStr)
      setResult(json)
    } catch (err) {
      setResult({ error: 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h1>Timestamp Microservice</h1>
      <p>Enter a date string or unix milliseconds (e.g. 1451001600000 or 2015-12-25)</p>

      <div className="controls">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter date or unix ms"
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={() => fetchTimestamp(input)}>Get</button>
          <button className="btn secondary" onClick={() => { setInput(''); fetchTimestamp() }}>Now</button>
        </div>
      </div>

      {loading && <p>Loading...</p>}

      {result && (
        <div className="result">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      <h3>Examples</h3>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn" onClick={() => { setInput('1451001600000'); fetchTimestamp('1451001600000') }}>1451001600000</button>
        <button className="btn" onClick={() => { setInput('2015-12-25'); fetchTimestamp('2015-12-25') }}>2015-12-25</button>
      </div>
    </div>
  )
}
