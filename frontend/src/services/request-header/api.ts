import type { WhoAmI } from './types'

const API = (import.meta as any).env?.VITE_API_BASE_REQUEST_HEADER ?? 'http://localhost:3001'

export async function fetchInfo(): Promise<WhoAmI> {
    try {
        const res = await fetch(`${API}/api/whoami`)
        return res.json()
    } catch {
        return { error: 'Network error' } as any
    }
}
