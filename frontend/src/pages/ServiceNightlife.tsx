import React, { useEffect, useState } from 'react'
import '../styles/nightlife.css'
import type { Bar, User } from '../services/nightlife/types'
import { login as apiLogin, logout as apiLogout, search as apiSearch, going as apiGoing } from '../services/nightlife/api'

export default function ServiceNightlife() {
    const [user, setUser] = useState<User>(null)
    const [location, setLocation] = useState<string>(() => new URLSearchParams(window.location.search).get('q') || 'New York')
    const [bars, setBars] = useState<Bar[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (location) search()
    }, [])

    function updateQueryParam(q: string) {
        const url = new URL(window.location.href)
        url.searchParams.set('q', q)
        window.history.replaceState({}, '', url.toString())
    }

    async function login(name?: string) {
        const username = name || prompt('Enter a username:') || ''
        if (!username) return
        const me = await apiLogin(username)
        setUser(me)
    }

    async function logout() {
        await apiLogout()
        setUser(null)
    }

    async function search(e?: React.FormEvent) {
        e?.preventDefault()
        if (!location.trim()) return
        setLoading(true)
        setError(null)
        try {
            const data = await apiSearch(location)
            setBars(data.items || [])
            updateQueryParam(location)
        } catch (err: any) {
            setError(err.message || String(err))
            setBars([])
        } finally {
            setLoading(false)
        }
    }

    async function goingToggle(barId: string, action: 'join' | 'leave') {
        setError(null)
        try {
            await apiGoing(barId, action)
        } catch (e: any) {
            setError(e.message || String(e))
            return
        }
        await search()
    }

    return (
        <div className="page">
            <h1>Nightlife Coordination</h1>
            <p>Search bars in your city and mark that you are going tonight. Data from SerpApi Yelp (if configured).</p>

            <div className="auth-bar">
                {user ? (
                    <>
                        <span>Signed in as <b>{user.name}</b></span>
                        <button className="btn" onClick={logout}>Sign out</button>
                    </>
                ) : (
                    <button className="btn primary" onClick={() => login()}>Sign in</button>
                )}
            </div>

            <form className="controls" onSubmit={search}>
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City or area (e.g., New York)" />
                <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Searching…' : 'Search'}</button>
            </form>

            {error && <div className="error" role="alert">Error: {error}</div>}

            <ul className="bars-list">
                {bars.map(b => (
                    <li key={b.id} className="bar-item">
                        <div className="bar-main">
                            <div className="bar-name">{b.name}</div>
                            <div className="bar-meta">{b.rating ? `Rating: ${b.rating}` : ''} {b.address ? `• ${b.address}` : ''}</div>
                        </div>
                        <div className="bar-actions">
                            <div className="going-count">{b.goingCount || 0} going</div>
                            <button className="btn" onClick={() => goingToggle(b.id, 'leave')} disabled={!user}>Cancel</button>
                            <button className="btn primary" onClick={() => goingToggle(b.id, 'join')} disabled={!user}>I'm going</button>
                        </div>
                    </li>
                ))}
                {bars.length === 0 && !loading && (
                    <div>No results. Try searching for a city.</div>
                )}
            </ul>
        </div>
    )
}
