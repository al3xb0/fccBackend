import React, { useEffect, useState } from 'react'
import '../styles/book-trading.css'
import type { User, Book, Trade } from '../services/book-trading/types'
import { getMe, login as apiLogin, logout as apiLogout, getBooks, getProfile, getTrades, addBook as apiAddBook, deleteBook as apiDeleteBook, saveProfile as apiSaveProfile, proposeTrade as apiProposeTrade, acceptTrade as apiAcceptTrade, rejectTrade as apiRejectTrade } from '../services/book-trading/api'

export default function ServiceBookTrading() {
    const [user, setUser] = useState<User>(null)
    const [books, setBooks] = useState<Book[]>([])
    const [trades, setTrades] = useState<Trade[]>([])
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [fullName, setFullName] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [view, setView] = useState<'all' | 'mine' | 'settings' | 'trades'>('all')

    useEffect(() => {
        checkAuth()
        fetchBooks()
    }, [])

    useEffect(() => {
        if (user) {
            fetchProfile()
            fetchTrades()
        }
    }, [user?.id])

    async function checkAuth() {
        const me = await getMe()
        if (me) setUser(me)
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
        setTrades([])
    }

    async function fetchBooks() {
        try {
            const data = await getBooks()
            setBooks(data)
        } catch (err: any) {
            setError(err.message || String(err))
        }
    }

    async function fetchProfile() {
        try {
            const data = await getProfile()
            if (!data) return
            setFullName(data.fullName || '')
            setCity(data.city || '')
            setState(data.state || '')
        } catch (e) {
            alert(`Failed to load profile: ${e}`)
        }
    }

    async function fetchTrades() {
        try {
            const data = await getTrades()
            setTrades(data)
        } catch (e) {
            alert(`Failed to load trades: ${e}`)
        }
    }

    async function addBook(e?: React.FormEvent) {
        e?.preventDefault()
        if (!title.trim()) return
        setLoading(true)
        setError(null)
        try {
            await apiAddBook(title, author)
            await fetchBooks()
            setTitle('')
            setAuthor('')
        } catch (err: any) {
            setError(err.message || String(err))
        } finally {
            setLoading(false)
        }
    }

    async function deleteBook(id: string) {
        if (!confirm('Delete this book?')) return
        try {
            await apiDeleteBook(id)
            await fetchBooks()
        } catch (err: any) {
            setError(err.message || String(err))
        }
    }

    async function saveSettings(e?: React.FormEvent) {
        e?.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await apiSaveProfile(fullName, city, state)
            alert('Settings saved!')
        } catch (err: any) {
            setError(err.message || String(err))
        } finally {
            setLoading(false)
        }
    }

    async function proposeTrade(bookId: string) {
        setError(null)
        try {
            await apiProposeTrade(bookId)
            await fetchTrades()
            alert('Trade proposal sent!')
        } catch (err: any) {
            setError(err.message || String(err))
        }
    }

    async function acceptTrade(id: string) {
        try {
            await apiAcceptTrade(id)
            await fetchTrades()
        } catch (err: any) {
            setError(err.message || String(err))
        }
    }

    async function rejectTrade(id: string) {
        try {
            await apiRejectTrade(id)
            await fetchTrades()
        } catch (err: any) {
            setError(err.message || String(err))
        }
    }

    const myBooks = books.filter(b => b.ownerId === user?.id)
    const receivedTrades = trades.filter(t => t.toUserId === user?.id && t.status === 'pending')
    const sentTrades = trades.filter(t => t.fromUserId === user?.id)

    return (
        <div className="page">
            <h1>Book Trading Club</h1>
            <p>View books, add your own, update your profile, and propose trades with other members.</p>

            <div className="auth-bar">
                {user ? (
                    <>
                        <span>Signed in as <b>{user.username}</b></span>
                        <button className="btn" onClick={logout}>Sign out</button>
                    </>
                ) : (
                    <button className="btn primary" onClick={() => login()}>Sign in</button>
                )}
            </div>

            {error && <div className="error" role="alert">Error: {error}</div>}

            <div className="tabs">
                <button className={view === 'all' ? 'tab active' : 'tab'} onClick={() => setView('all')}>All Books</button>
                {user && <button className={view === 'mine' ? 'tab active' : 'tab'} onClick={() => setView('mine')}>My Books</button>}
                {user && <button className={view === 'settings' ? 'tab active' : 'tab'} onClick={() => setView('settings')}>Settings</button>}
                {user && <button className={view === 'trades' ? 'tab active' : 'tab'} onClick={() => setView('trades')}>Trades ({receivedTrades.length})</button>}
            </div>

            {view === 'all' && (
                <div>
                    <h3>All Books</h3>
                    <ul className="books-list">
                        {books.map(b => (
                            <li key={b.id} className="book-item">
                                <div>
                                    <div className="book-title">{b.title}</div>
                                    <div className="book-meta">by {b.author || 'Unknown'} • Owner: {b.ownerName}</div>
                                </div>
                                {user && b.ownerId !== user.id && (
                                    <button className="btn primary" onClick={() => proposeTrade(b.id)}>Request Trade</button>
                                )}
                            </li>
                        ))}
                        {books.length === 0 && <div>No books yet.</div>}
                    </ul>
                </div>
            )}

            {view === 'mine' && user && (
                <div>
                    <h3>My Books</h3>
                    <form className="controls" onSubmit={addBook}>
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Book title" />
                        <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author (optional)" />
                        <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Adding…' : 'Add Book'}</button>
                    </form>
                    <ul className="books-list">
                        {myBooks.map(b => (
                            <li key={b.id} className="book-item">
                                <div>
                                    <div className="book-title">{b.title}</div>
                                    <div className="book-meta">by {b.author || 'Unknown'}</div>
                                </div>
                                <button className="btn secondary" onClick={() => deleteBook(b.id)}>Delete</button>
                            </li>
                        ))}
                        {myBooks.length === 0 && <div>You haven't added any books yet.</div>}
                    </ul>
                </div>
            )}

            {view === 'settings' && user && (
                <div>
                    <h3>Settings</h3>
                    <form className="settings-form" onSubmit={saveSettings}>
                        <label>Full Name</label>
                        <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" />
                        <label>City</label>
                        <input value={city} onChange={e => setCity(e.target.value)} placeholder="Your city" />
                        <label>State</label>
                        <input value={state} onChange={e => setState(e.target.value)} placeholder="Your state" />
                        <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Saving…' : 'Save Settings'}</button>
                    </form>
                </div>
            )}

            {view === 'trades' && user && (
                <div>
                    <h3>Trade Requests</h3>
                    <h4>Received ({receivedTrades.length})</h4>
                    <ul className="trades-list">
                        {receivedTrades.map(t => (
                            <li key={t.id} className="trade-item">
                                <div>
                                    <div className="trade-title">{t.fromUsername} wants to trade for "{t.bookTitle}"</div>
                                    <div className="trade-meta">Status: {t.status}</div>
                                </div>
                                <div className="trade-actions">
                                    <button className="btn primary" onClick={() => acceptTrade(t.id)}>Accept</button>
                                    <button className="btn secondary" onClick={() => rejectTrade(t.id)}>Reject</button>
                                </div>
                            </li>
                        ))}
                        {receivedTrades.length === 0 && <div>No pending trade requests.</div>}
                    </ul>

                    <h4>Sent ({sentTrades.length})</h4>
                    <ul className="trades-list">
                        {sentTrades.map(t => (
                            <li key={t.id} className="trade-item">
                                <div>
                                    <div className="trade-title">You requested "{t.bookTitle}" from {t.toUsername}</div>
                                    <div className="trade-meta">Status: {t.status}</div>
                                </div>
                            </li>
                        ))}
                        {sentTrades.length === 0 && <div>No sent trade requests.</div>}
                    </ul>
                </div>
            )}
        </div>
    )
}
