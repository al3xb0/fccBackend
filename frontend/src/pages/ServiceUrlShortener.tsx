import React, { useState } from 'react'
import type { ShortenResult } from '../services/url-shortener/types'
import { shortenUrl as apiShortenUrl, getShortUrl as apiGetShortUrl } from '../services/url-shortener/api'

export default function ServiceUrlShortener() {
    const [url, setUrl] = useState('')
    const [result, setResult] = useState<ShortenResult | null>(null)
    const [loading, setLoading] = useState(false)

    const shortenUrl = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setResult(null)

        try {
            const json = await apiShortenUrl(url)
            setResult(json)
        } catch (err) {
            setResult({ error: 'Network error' })
        } finally {
            setLoading(false)
        }
    }

    const getShortUrl = (shortId: number) => apiGetShortUrl(shortId)

    return (
        <div className="page">
            <h1>URL Shortener</h1>
            <p>Enter a URL to get a shortened version. The URL must be in valid format (e.g., https://www.example.com).</p>

            <form onSubmit={shortenUrl} className="url-form">
                <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://www.example.com"
                    required
                    pattern="https?://.*"
                    title="Please enter a URL starting with http:// or https://"
                    className="full"
                />
                <button type="submit" className="btn primary full" disabled={loading}>
                    {loading ? 'Creating...' : 'Shorten URL'}
                </button>
            </form>

            {loading && <p>Loading...</p>}

            {result?.error && (
                <div className="result error">
                    <p>Error: {result.error}</p>
                    {result.error === 'invalid url' && (
                        <p className="hint">Make sure the URL includes http:// or https:// and points to a valid website.</p>
                    )}
                </div>
            )}

            {result?.short_url && (
                <div className="result success">
                    <h3>URL Shortened!</h3>
                    <div className="url-display">
                        <div>
                            <strong>Original URL:</strong>
                            <div className="url-text">{result.original_url}</div>
                        </div>
                        <div>
                            <strong>Short URL:</strong>
                            <a
                                href={getShortUrl(result.short_url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="url-text"
                            >
                                {getShortUrl(result.short_url)}
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <div className="examples" style={{ marginTop: 24 }}>
                <h3>Example URLs to try:</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                        className="btn"
                        onClick={() => setUrl('https://www.freecodecamp.org')}
                    >
                        freecodecamp.org
                    </button>
                    <button
                        className="btn"
                        onClick={() => setUrl('https://www.github.com')}
                    >
                        github.com
                    </button>
                </div>
            </div>
        </div>
    )
}