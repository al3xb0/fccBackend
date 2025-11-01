import type { ImageResult, RecentEntry } from './types'

const API = (import.meta as any).env?.VITE_IMAGE_SEARCH_API || 'http://localhost:3010'

async function jsonOrThrow(res: Response) {
    if (!res.ok) {
        let detail = ''
        try { const j = await res.json(); detail = j.error || JSON.stringify(j) } catch { try { detail = await res.text() } catch { /* ignore */ } }
        throw new Error(detail || `HTTP ${res.status}`)
    }
    return res.json()
}

export async function recent(): Promise<RecentEntry[]> {
    const res = await fetch(`${API}/api/recent`)
    if (!res.ok) return []
    return res.json()
}

export async function search(query: string, page = 1): Promise<ImageResult[]> {
    const res = await fetch(`${API}/api/imagesearch/${encodeURIComponent(query)}?page=${page}`)
    return jsonOrThrow(res)
}
