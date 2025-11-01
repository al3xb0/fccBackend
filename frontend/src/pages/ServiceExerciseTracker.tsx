import React, { useEffect, useMemo, useState } from 'react'
import { addExercise, createUser, getLogs, listUsers } from '../services/exercise-tracker/api'
import type { User, Log } from '../services/exercise-tracker/types'

export default function ServiceExerciseTracker() {
  const [users, setUsers] = useState<User[]>([])
  const [username, setUsername] = useState('')
  const [selectedUser, setSelectedUser] = useState<string>('')

  const [desc, setDesc] = useState('')
  const [duration, setDuration] = useState<number>(30)
  const [date, setDate] = useState<string>('')

  const [logs, setLogs] = useState<Log | null>(null)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [limit, setLimit] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selected = useMemo(() => users.find(u => u._id === selectedUser) || null, [users, selectedUser])

  useEffect(() => {
    refreshUsers()
  }, [])

  async function refreshUsers() {
    try {
      setError(null)
      const data = await listUsers()
      setUsers(data)
      if (!selectedUser && data.length) setSelectedUser(data[0]._id)
    } catch (e: any) {
      setError(e?.message || 'Failed to load users')
    }
  }

  async function onCreateUser(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim()) return
    try {
      setLoading(true)
      const u = await createUser(username.trim())
      setUsername('')
      await refreshUsers()
      setSelectedUser(u._id)
    } catch (e: any) {
      setError(e?.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  async function onAddExercise(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedUser) return
    if (!desc.trim()) return setError('Description is required')
    if (!Number.isFinite(Number(duration))) return setError('Duration must be a number')
    try {
      setLoading(true)
      setError(null)
      const ex = await addExercise(selectedUser, desc.trim(), Number(duration), date || undefined)
      setDesc('')
      setDuration(30)
      setDate('')
      await loadLogs()
    } catch (e: any) {
      setError(e?.message || 'Failed to add exercise')
    } finally {
      setLoading(false)
    }
  }

  async function loadLogs() {
    if (!selectedUser) return
    try {
      setError(null)
      setLoading(true)
      const l = await getLogs(selectedUser, {
        from: from || undefined,
        to: to || undefined,
        limit: typeof limit === 'number' ? limit : undefined
      })
      setLogs(l)
    } catch (e: any) {
      setError(e?.message || 'Failed to load logs')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h1>Exercise Tracker</h1>
      <p>Create users, add exercises, and inspect logs with optional filters.</p>

      <div className="two-col">
        <section>
          <h3>Create User</h3>
          <form onSubmit={onCreateUser} className="form">
            <label>
              Username
              <input value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g., fcc_test" />
            </label>
            <button className="btn primary" disabled={loading || !username.trim()}>Create</button>
          </form>

          <h3 style={{ marginTop: 24 }}>Users</h3>
          <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
            {users.map(u => (
              <option key={u._id} value={u._id}>{u.username}</option>
            ))}
          </select>
          <div style={{ marginTop: 8 }}>
            <button className="btn" onClick={refreshUsers}>Refresh</button>
          </div>

          <h3 style={{ marginTop: 24 }}>Add Exercise</h3>
          <form onSubmit={onAddExercise} className="form">
            <label>
              Description
              <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g., Running" />
            </label>
            <label>
              Duration (minutes)
              <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} min={1} />
            </label>
            <label>
              Date (yyyy-mm-dd, optional)
              <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </label>
            <button className="btn primary" disabled={loading || !selectedUser}>Add Exercise</button>
          </form>
        </section>

        <section>
          <h3>Logs</h3>
          <div className="form" style={{ marginBottom: 12 }}>
            <label>
              From
              <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
            </label>
            <label>
              To
              <input type="date" value={to} onChange={e => setTo(e.target.value)} />
            </label>
            <label>
              Limit
              <input type="number" value={limit} onChange={e => setLimit(e.target.value === '' ? '' : Number(e.target.value))} min={1} />
            </label>
            <div>
              <button className="btn" onClick={loadLogs} disabled={!selectedUser || loading}>Load Logs</button>
            </div>
          </div>

          {logs && (
            <div className="card">
              <div className="row"><strong>User:</strong> {logs.username}</div>
              <div className="row"><strong>Count:</strong> {logs.count}</div>
              <div className="list" style={{ marginTop: 12 }}>
                {logs.log.map((item, idx) => (
                  <div key={idx} className="list-item">
                    <div><strong>{item.date}</strong></div>
                    <div>{item.description} — {item.duration} min</div>
                  </div>
                ))}
                {logs.log.length === 0 && <div>No entries.</div>}
              </div>
            </div>
          )}
        </section>
      </div>

      {error && <div className="error" style={{ marginTop: 12 }}>{error}</div>}
    </div>
  )
}
