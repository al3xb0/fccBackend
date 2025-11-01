import type { ShortenResult } from './types'

const API = (import.meta as any).env?.VITE_API_BASE_URL_SHORTENER ?? 'http://localhost:3002'

export async function shortenUrl(url: string): Promise<ShortenResult> {
    try {
        const res = await fetch(`${API}/api/shorturl`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        })
        return res.json()
    } catch {
        return { error: 'Network error' }
    }
}

export function getShortUrl(shortId: number): string {
    return `${API}/api/shorturl/${shortId}`
}
