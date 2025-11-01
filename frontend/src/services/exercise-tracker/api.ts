import type { User, Exercise, Log } from './types'

const API = (import.meta as any).env?.VITE_EXERCISE_TRACKER_API || 'http://localhost:3010'

async function jsonOrThrow(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `HTTP ${res.status}`)
  }
  return res.json()
}

export async function createUser(username: string): Promise<User> {
  const body = new URLSearchParams()
  body.set('username', username)
  const res = await fetch(`${API}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  })
  return jsonOrThrow(res)
}

export async function listUsers(): Promise<User[]> {
  const res = await fetch(`${API}/api/users`)
  return jsonOrThrow(res)
}

export async function addExercise(userId: string, description: string, duration: number, date?: string): Promise<Exercise> {
  const body = new URLSearchParams()
  body.set('description', description)
  body.set('duration', String(duration))
  if (date) body.set('date', date)
  const res = await fetch(`${API}/api/users/${userId}/exercises`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  })
  return jsonOrThrow(res)
}

export async function getLogs(userId: string, params?: { from?: string; to?: string; limit?: number }): Promise<Log> {
  const q = new URLSearchParams()
  if (params?.from) q.set('from', params.from)
  if (params?.to) q.set('to', params.to)
  if (typeof params?.limit === 'number') q.set('limit', String(params.limit))
  const url = `${API}/api/users/${userId}/logs${q.toString() ? `?${q.toString()}` : ''}`
  const res = await fetch(url)
  return jsonOrThrow(res)
}
