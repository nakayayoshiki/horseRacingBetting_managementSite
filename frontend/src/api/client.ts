import type { RaceRecord, YearlySummary } from '../types'
import { getToken, removeToken } from '../auth'

const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

function authHeaders(): HeadersInit {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handle<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    removeToken()
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const api = {
  login: async (username: string, password: string): Promise<string> => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) throw new Error('Invalid credentials')
    const data = await res.json()
    return data.token
  },

  getRecordsByYear: (year: number): Promise<RaceRecord[]> =>
    fetch(`${BASE}/api/records/year/${year}`, { headers: authHeaders() }).then(r => handle<RaceRecord[]>(r)),

  getRecordByDate: (date: string): Promise<RaceRecord | null> =>
    fetch(`${BASE}/api/records/date/${date}`, { headers: authHeaders() }).then(r =>
      r.status === 404 ? null : handle<RaceRecord>(r)
    ),

  saveRecord: (record: Omit<RaceRecord, 'id'>): Promise<RaceRecord> =>
    fetch(`${BASE}/api/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(record),
    }).then(r => handle<RaceRecord>(r)),

  deleteRecord: (date: string): Promise<void> =>
    fetch(`${BASE}/api/records/date/${date}`, { method: 'DELETE', headers: authHeaders() }).then(r => {
      if (r.status === 401) { removeToken(); window.location.href = '/login'; return }
      if (!r.ok) throw new Error(`API error: ${r.status}`)
    }),

  getYearlySummaries: (): Promise<YearlySummary[]> =>
    fetch(`${BASE}/api/summary/yearly`, { headers: authHeaders() }).then(r => handle<YearlySummary[]>(r)),
}
