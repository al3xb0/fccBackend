import React, { useState, useEffect } from 'react'
import '../styles/image-search.css'
import type { ImageResult, RecentEntry } from '../services/image-search/types'
import { recent as apiRecent, search as apiSearch } from '../services/image-search/api'

export default function ServiceImageSearch() {
  const [query, setQuery] = useState('lolcats')
  const [page, setPage] = useState(1)
  const [results, setResults] = useState<ImageResult[]>([])
  const [recent, setRecent] = useState<RecentEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRecent()
  }, [])

  async function fetchRecent() {
    try {
      const data = await apiRecent()
      setRecent(data)
    } catch {
      setRecent([])
    }
  }

  async function runSearch(p = page) {
    setLoading(true)
    setError(null)
    try {
      const data = await apiSearch(query, p)
      setResults(data)
      await fetchRecent()
    } catch (err: any) {
      setError(err.message || String(err))
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  function handleEnterKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      runSearch()
    }
  }

  return (
    <div className="page">
      <h1>Image Search</h1>

      <div className="search-controls">
        <div className="input-group">
          <label htmlFor="searchInput">Search images</label>
          <input
            id="searchInput"
            className="search-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleEnterKey}
            placeholder="Enter keywords to search for..."
            aria-label="Search terms"
          />
        </div>

        <div className="input-group">
          <label htmlFor="pageInput">Page</label>
          <input
            id="pageInput"
            type="number"
            className="page-input"
            value={page}
            min={1}
            onChange={e => setPage(Number(e.target.value) || 1)}
            onKeyDown={handleEnterKey}
            aria-label="Page number"
          />
        </div>

        <button
          className="btn primary search-button"
          onClick={() => runSearch()}
          aria-label="Search images"
        >
          Search
        </button>
      </div>

      {error && <div className="error" role="alert">Error: {error}</div>}

      <div className="results-container">
        <div>
          {loading ? (
            <div className="loading">Loading results...</div>
          ) : (
            <ul className="image-grid">
              {results.length === 0 ? (
                <div>No results yet. Try a search.</div>
              ) : (
                results.map((r, i) => (
                  <li key={i} className="image-card">
                    {r.thumbnail ? (
                      <img src={r.thumbnail} alt={r.snippet} className="image-thumb" />
                    ) : (
                      <div className="image-placeholder">No preview</div>
                    )}
                    <div className="image-info">
                      <h3 className="image-title">{r.snippet || 'Untitled'}</h3>
                      <div className="image-links">
                        <a href={r.url} target="_blank" rel="noreferrer" className="image-link">View Image</a>
                        {r.context && (
                          <a href={r.context} target="_blank" rel="noreferrer" className="image-link">Source</a>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <aside className="recent-searches">
          <h4>Recent Searches</h4>
          {recent.length === 0 ? (
            <div>No recent searches</div>
          ) : (
            <ul className="recent-list">
              {recent.map((r, i) => (
                <li key={i} className="recent-item">
                  <button
                    className="recent-term"
                    onClick={() => { setQuery(r.term); setPage(1); runSearch(1) }}
                  >
                    {r.term}
                  </button>
                  <div className="recent-date">{new Date(r.when).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  )
}
