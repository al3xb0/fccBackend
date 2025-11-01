import type { Bar, User } from './types'

const API = (import.meta as any).env?.VITE_NIGHTLIFE_API || 'http://localhost:3013'

async function jsonOrThrow(res: Response) {
    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || `HTTP ${res.status}`)
    }
    return res.json()
}

export async function login(username: string): Promise<User> {
    await fetch(`${API}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ username })
    })
    return { id: username.toLowerCase(), name: username }
}

export async function logout(): Promise<void> {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' })
}

export async function search(location: string): Promise<{ items: Bar[] }> {
    const res = await fetch(`${API}/api/search?location=${encodeURIComponent(location)}`, { credentials: 'include' })
    return jsonOrThrow(res)
}

export async function going(barId: string, action: 'join' | 'leave'): Promise<void> {
    const res = await fetch(`${API}/api/going`, {
        method: action === 'leave' ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ businessId: barId })
    })
    await jsonOrThrow(res)
}
