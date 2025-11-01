import type { TimestampResult } from './types'

const API = (import.meta as any).env?.VITE_API_BASE_TIMESTAMP ?? 'http://localhost:3000'

export async function fetchTimestamp(dateStr?: string): Promise<TimestampResult> {
    try {
        const param = dateStr === undefined || dateStr === '' ? '' : encodeURIComponent(dateStr)
        const url = `${API}/api/${param}`
        const res = await fetch(url)
        return res.json()
    } catch {
        return { error: 'Network error' }
    }
}
