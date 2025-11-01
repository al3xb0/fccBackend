import React, { useState } from 'react'
import type { WhoAmI } from '../services/request-header/types'
import { fetchInfo as apiFetchInfo } from '../services/request-header/api'

export default function ServiceRequestHeader() {
    const [result, setResult] = useState<WhoAmI | null>(null)
    const [loading, setLoading] = useState(false)

    const fetchInfo = async () => {
        setLoading(true)
        setResult(null)
        try {
            const json = await apiFetchInfo()
            setResult(json)
        } catch (err) {
            setResult({ error: 'Network error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page">
            <h1>Request Header Parser</h1>
            <p>Click the button to get your IP address, preferred language, and software information.</p>
            <div style={{ marginTop: 12 }}>
                <button className="btn primary" onClick={fetchInfo}>Get My Info</button>
            </div>

            {loading && <p>Loading...</p>}

            {result && (
                <div className="result">
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    )
}
