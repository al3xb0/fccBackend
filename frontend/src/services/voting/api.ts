import type { Poll, User } from './types'

const API = (import.meta as any).env?.VITE_VOTING_API || 'http://localhost:3012'

async function jsonOrThrow(res: Response) {
    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || `HTTP ${res.status}`)
    }
    return res.json()
}

export async function getPolls(): Promise<Poll[]> {
    const res = await fetch(`${API}/api/polls`, { credentials: 'include' })
    return jsonOrThrow(res)
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

export async function createPoll(title: string, options: string[]): Promise<void> {
    const res = await fetch(`${API}/api/polls`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ title, options })
    })
    await jsonOrThrow(res)
}

export async function vote(pollId: string, optionId?: string, newOptionText?: string): Promise<Poll> {
    const res = await fetch(`${API}/api/polls/${pollId}/vote`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ optionId, newOptionText })
    })
    return jsonOrThrow(res)
}

export async function deletePoll(pollId: string): Promise<void> {
    const res = await fetch(`${API}/api/polls/${pollId}`, { method: 'DELETE', credentials: 'include' })
    await jsonOrThrow(res)
}
