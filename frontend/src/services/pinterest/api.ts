import type { User, Pin, SearchImage } from './types'

const API = (import.meta as any).env?.VITE_PINTEREST_API || 'http://localhost:3016'

async function jsonOrThrow(res: Response) {
    if (!res.ok) {
        let detail = ''
        try { const j = await res.json(); detail = j.error || JSON.stringify(j) } catch { try { detail = await res.text() } catch { /* ignore */ } }
        throw new Error(detail || `HTTP ${res.status}`)
    }
    return res.json()
}

export async function getServiceInfo() {
    const res = await fetch(`${API}/`)
    return jsonOrThrow(res)
}

export async function getMe(): Promise<{ user: User } | { error: string }> {
    const res = await fetch(`${API}/auth/me`, { credentials: 'include' })
    if (!res.ok) return { error: String(res.status) }
    return res.json()
}

export async function logout(): Promise<void> {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' })
}

export async function getPins(userId?: string): Promise<Pin[]> {
    const url = userId ? `${API}/api/pins?userId=${userId}` : `${API}/api/pins`
    const res = await fetch(url, { credentials: 'include' })
    return jsonOrThrow(res)
}

export async function addPin(imageUrl: string, description: string): Promise<Pin> {
    const res = await fetch(`${API}/api/pins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ imageUrl, description })
    })
    return jsonOrThrow(res)
}

export async function deletePin(id: string): Promise<void> {
    const res = await fetch(`${API}/api/pins/${id}`, { method: 'DELETE', credentials: 'include' })
    await jsonOrThrow(res)
}

export async function searchImages(q: string): Promise<SearchImage[]> {
    const res = await fetch(`${API}/api/search?q=${encodeURIComponent(q)}`, { credentials: 'include' })
    const data = await jsonOrThrow(res)
    return data.images || []
}

export async function register(email: string, password: string, displayName?: string): Promise<User> {
    const res = await fetch(`${API}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ email, password, displayName })
    })
    const data = await jsonOrThrow(res)
    return data.user
}

export async function login(email: string, password: string): Promise<User> {
    const res = await fetch(`${API}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ email, password })
    })
    const data = await jsonOrThrow(res)
    return data.user
}
