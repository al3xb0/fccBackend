import type { User, Book, Trade } from './types'

const API = (import.meta as any).env?.VITE_BOOK_TRADING_API || 'http://localhost:3015'

async function jsonOrThrow(res: Response) {
    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || `HTTP ${res.status}`)
    }
    return res.json()
}

export async function getMe(): Promise<User> {
    try {
        const res = await fetch(`${API}/auth/me`, { credentials: 'include' })
        if (!res.ok) return null
        const data = await res.json()
        return data.user as User
    } catch {
        return null
    }
}

export async function login(username: string): Promise<User> {
    const res = await fetch(`${API}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ username })
    })
    const data = await jsonOrThrow(res)
    return data.user as User
}

export async function logout(): Promise<void> {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' })
}

export async function getBooks(): Promise<Book[]> {
    const res = await fetch(`${API}/api/books`)
    return jsonOrThrow(res)
}

export async function getProfile(): Promise<{ fullName: string; city: string; state: string } | null> {
    const res = await fetch(`${API}/api/user/profile`, { credentials: 'include' })
    if (!res.ok) return null
    return res.json()
}

export async function getTrades(): Promise<Trade[]> {
    const res = await fetch(`${API}/api/trades`, { credentials: 'include' })
    if (!res.ok) return []
    return res.json()
}

export async function addBook(title: string, author?: string): Promise<void> {
    const res = await fetch(`${API}/api/books`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ title, author })
    })
    await jsonOrThrow(res)
}

export async function deleteBook(id: string): Promise<void> {
    const res = await fetch(`${API}/api/books/${id}`, { method: 'DELETE', credentials: 'include' })
    await jsonOrThrow(res)
}

export async function saveProfile(fullName: string, city: string, state: string): Promise<void> {
    const res = await fetch(`${API}/api/user/profile`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ fullName, city, state })
    })
    await jsonOrThrow(res)
}

export async function proposeTrade(bookId: string): Promise<void> {
    const res = await fetch(`${API}/api/trades`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ bookId })
    })
    await jsonOrThrow(res)
}

export async function acceptTrade(id: string): Promise<void> {
    const res = await fetch(`${API}/api/trades/${id}/accept`, { method: 'PUT', credentials: 'include' })
    await jsonOrThrow(res)
}

export async function rejectTrade(id: string): Promise<void> {
    const res = await fetch(`${API}/api/trades/${id}/reject`, { method: 'PUT', credentials: 'include' })
    await jsonOrThrow(res)
}
