import React, { useEffect, useMemo, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import '../styles/voting.css'
import type { Poll, User } from '../services/voting/types'
import { getPolls as apiGetPolls, login as apiLogin, logout as apiLogout, createPoll as apiCreatePoll, vote as apiVote, deletePoll as apiDeletePoll } from '../services/voting/api'
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function ServiceVoting() {
    const [user, setUser] = useState<User>(null)
    const [polls, setPolls] = useState<Poll[]>([])
    const [title, setTitle] = useState('My first poll')
    const [newOptions, setNewOptions] = useState<string[]>(['Option A', 'Option B'])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null)

    const chartData = useMemo(() => {
        if (!selectedPoll) return null
        const labels = selectedPoll.options.map(o => o.text)
        const data = selectedPoll.options.map(o => o.votes)
        return {
            labels,
            datasets: [
                {
                    label: 'Votes',
                    data,
                    backgroundColor: '#4f46e5',
                    borderRadius: 6,
                }
            ]
        }
    }, [selectedPoll])

    async function fetchPolls() {
        setError(null)
        try {
            const data = await apiGetPolls()
            setPolls(data)
        } catch (e: any) {
            setError(e.message || String(e))
        }
    }

    useEffect(() => { fetchPolls() }, [])
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const pid = params.get('poll')
        if (pid) {
            const found = polls.find(p => p.id === pid)
            if (found) setSelectedPoll(found)
        }
    }, [polls])

    async function login(name?: string) {
        const username = name || prompt('Enter a username:') || ''
        if (!username) return
        const me = await apiLogin(username)
        setUser(me)
    }

    async function logout() {
        await apiLogout()
        setUser(null)
    }

    function addOptionField() {
        setNewOptions(prev => [...prev, ''])
    }

    function updateOption(i: number, value: string) {
        setNewOptions(prev => prev.map((v, idx) => (idx === i ? value : v)))
    }

    async function createPoll() {
        setLoading(true)
        setError(null)
        try {
            const opts = newOptions.map(o => o).filter(Boolean)
            if (!title.trim() || opts.length < 1) alert('Please provide a title and at least one option')
            await apiCreatePoll(title.trim(), opts)
            await fetchPolls()
            setTitle('')
            setNewOptions([''])
        } catch (e: any) {
            setError(e.message || String(e))
        } finally {
            setLoading(false)
        }
    }

    async function vote(pollId: string, optionId?: string, newOptionText?: string) {
        setError(null)
        try {
            const updated = await apiVote(pollId, optionId, newOptionText)
            await fetchPolls()
            setSelectedPoll(updated)
        } catch (e: any) {
            setError(`Vote failed: ${e.message || String(e)}`)
        }
    }

    async function removePoll(pollId: string) {
        if (!confirm('Delete this poll?')) return
        try {
            await apiDeletePoll(pollId)
            await fetchPolls()
            if (selectedPoll?.id === pollId) setSelectedPoll(null)
        } catch (e: any) {
            setError(`Delete failed: ${e.message || String(e)}`)
        }
    }

    return (
        <div className="page">
            <h1>Voting App</h1>
            <p>Create polls, vote, and share results. Demo auth via username.</p>

            <div className="auth-bar">
                {user ? (
                    <>
                        <span>Signed in as <b>{user.name}</b></span>
                        <button className="btn" onClick={logout}>Sign out</button>
                    </>
                ) : (
                    <button className="btn primary" onClick={() => login()}>Sign in</button>
                )}
            </div>

            {error && <div className="error" role="alert">Error: {error}</div>}

            <div className="voting-layout">
                <section>
                    <h3>Create a poll</h3>
                    <div className="create-card">
                        <label>Title</label>
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Poll title" />
                        <label>Options</label>
                        {newOptions.map((opt, i) => (
                            <input key={i} value={opt} onChange={e => updateOption(i, e.target.value)} placeholder={`Option ${i + 1}`} />
                        ))}
                        <div className="controls">
                            <button className="btn" onClick={addOptionField}>Add option</button>
                            <button className="btn primary" disabled={!user || loading} onClick={createPoll}>
                                {loading ? 'Creating…' : 'Create poll'}
                            </button>
                        </div>
                    </div>

                    <h3 style={{ marginTop: 16 }}>All polls</h3>
                    <ul className="poll-list">
                        {polls.map(p => (
                            <li key={p.id} className="poll-item">
                                <div className="poll-title" onClick={() => setSelectedPoll(p)}>{p.title}</div>
                                <div className="poll-actions">
                                    <button className="btn" onClick={() => setSelectedPoll(p)}>Open</button>
                                    {user && user.id === p.ownerId && (
                                        <button className="btn secondary" onClick={() => removePoll(p.id)}>Delete</button>
                                    )}
                                </div>
                            </li>
                        ))}
                        {polls.length === 0 && <div>No polls yet.</div>}
                    </ul>
                </section>

                <aside>
                    <h3>Poll details</h3>
                    {selectedPoll ? (
                        <div className="poll-detail">
                            <h4>{selectedPoll.title}</h4>
                            <div className="options">
                                {selectedPoll.options.map(o => (
                                    <button key={o.id} className="btn option" onClick={() => vote(selectedPoll.id, o.id)}>
                                        {o.text} <span className="badge">{o.votes}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="new-option">
                                <input placeholder="Add a new option" onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const v = (e.target as HTMLInputElement).value
                                        if (v.trim()) {
                                            vote(selectedPoll.id, undefined, v.trim())
                                                ; (e.target as HTMLInputElement).value = ''
                                        }
                                    }
                                }} />
                            </div>

                            {chartData && (
                                <div className="chart-container" role="img" aria-label="Poll results bar chart">
                                    <Bar
                                        data={chartData}
                                        options={{
                                            responsive: true,
                                            plugins: { legend: { display: false }, tooltip: { enabled: true } },
                                            scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
                                        }}
                                    />
                                </div>
                            )}

                            <div className="share-url">
                                <label>Share URL</label>
                                <input readOnly value={window.location.origin + '/services/voting?poll=' + selectedPoll.id} onFocus={(e) => e.currentTarget.select()} />
                            </div>
                        </div>
                    ) : (
                        <div>Select a poll to see details and vote.</div>
                    )}
                </aside>
            </div>
        </div>
    )
}
