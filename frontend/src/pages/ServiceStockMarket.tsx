import React, { useEffect, useState, useRef } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js'
import '../styles/stock-market.css'
import type { Stock } from '../services/stock-market/types'
import { getStocks as apiGetStocks, addStock as apiAddStock, removeStock as apiRemoveStock, wsUrl } from '../services/stock-market/api'

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend)

const WS_URL = wsUrl()

const colors = ['#4f46e5', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4']

export default function ServiceStockMarket() {
    const [stocks, setStocks] = useState<Stock[]>([])
    const [symbol, setSymbol] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const ws = useRef<WebSocket | null>(null)

    useEffect(() => {
        fetchStocks()
        connectWS()
        return () => { ws.current?.close() }
    }, [])

    function connectWS() {
        const socket = new WebSocket(WS_URL)
        socket.onopen = () => console.log('WS connected')
        socket.onmessage = (e) => {
            try {
                const msg = JSON.parse(e.data)
                if (msg.type === 'add' && msg.stock) {
                    setStocks(prev => [...prev.filter(s => s.symbol !== msg.stock.symbol), msg.stock])
                } else if (msg.type === 'remove' && msg.symbol) {
                    setStocks(prev => prev.filter(s => s.symbol !== msg.symbol))
                }
            } catch (err) { console.error('WS parse error', err) }
        }
        socket.onerror = (err) => console.error('WS error', err)
        socket.onclose = () => console.log('WS closed')
        ws.current = socket
    }

    async function fetchStocks() {
        try {
            const data = await apiGetStocks()
            setStocks(data)
        } catch (err: any) {
            setError(err.message || String(err))
        }
    }

    async function addStock(e?: React.FormEvent) {
        e?.preventDefault()
        if (!symbol.trim()) return
        setLoading(true)
        setError(null)
        try {
            await apiAddStock(symbol.trim().toUpperCase())
            setSymbol('')
        } catch (err: any) {
            setError(err.message || String(err))
        } finally {
            setLoading(false)
        }
    }

    async function removeStock(sym: string) {
        setError(null)
        try {
            await apiRemoveStock(sym)
        } catch (err: any) {
            setError(err.message || String(err))
        }
    }

    const chartData = {
        labels: stocks[0]?.prices.map(p => p.date) || [],
        datasets: stocks.map((s, i) => ({
            label: s.symbol,
            data: s.prices.map(p => p.close),
            borderColor: colors[i % colors.length],
            backgroundColor: colors[i % colors.length] + '33',
            tension: 0.3
        }))
    }

    return (
        <div className="page">
            <h1>Stock Market Chart</h1>
            <p>Track stocks in real-time. Changes sync across all users via WebSocket.</p>

            {error && <div className="error" role="alert">Error: {error}</div>}

            <form className="controls" onSubmit={addStock}>
                <input
                    value={symbol}
                    onChange={e => setSymbol(e.target.value)}
                    placeholder="Stock symbol (e.g., AAPL, MSFT)"
                />
                <button className="btn primary" type="submit" disabled={loading}>
                    {loading ? 'Adding…' : 'Add Stock'}
                </button>
            </form>

            <div className="stocks-row">
                {stocks.map(s => (
                    <div key={s.symbol} className="stock-chip">
                        <span>{s.symbol}</span>
                        <button className="remove-btn" onClick={() => removeStock(s.symbol)} aria-label={`Remove ${s.symbol}`}>×</button>
                    </div>
                ))}
                {stocks.length === 0 && <div>No stocks tracked. Add one above.</div>}
            </div>

            {stocks.length > 0 && (
                <div className="chart-container">
                    <Line
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false } },
                            scales: { y: { beginAtZero: false } }
                        }}
                    />
                </div>
            )}
        </div>
    )
}
