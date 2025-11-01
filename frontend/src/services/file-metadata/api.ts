import type { AnalyseResult } from './types'

const API = (import.meta as any).env?.VITE_FILE_METADATA_API || 'http://localhost:3011'

async function jsonOrThrow(res: Response) {
    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || `HTTP ${res.status}`)
    }
    return res.json()
}

export async function uploadFile(file: File): Promise<AnalyseResult> {
    const form = new FormData()
    form.append('upfile', file)
    const res = await fetch(`${API}/api/fileanalyse`, { method: 'POST', body: form })
    return jsonOrThrow(res)
}
