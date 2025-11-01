import type { Stock } from './types'

const API = (import.meta as any).env?.VITE_STOCK_MARKET_API || 'http://localhost:3014'

async function jsonOrThrow(res: Response) {
    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || `HTTP ${res.status}`)
    }
    return res.json()
}

export async function getStocks(): Promise<Stock[]> {
    const res = await fetch(`${API}/api/stocks`)
    return jsonOrThrow(res)
}

export async function addStock(symbol: string): Promise<void> {
    const res = await fetch(`${API}/api/stocks`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol })
    })
    await jsonOrThrow(res)
}

export async function removeStock(symbol: string): Promise<void> {
    const res = await fetch(`${API}/api/stocks/${symbol}`, { method: 'DELETE' })
    await jsonOrThrow(res)
}

export function wsUrl(): string {
    return API.replace(/^http/, 'ws')
}
