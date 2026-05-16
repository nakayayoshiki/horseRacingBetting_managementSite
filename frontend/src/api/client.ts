import type { RaceRecord, YearlySummary } from '../types'

const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const api = {
  getRecordsByYear: (year: number): Promise<RaceRecord[]> =>
    fetch(`${BASE}/api/records/year/${year}`).then(r => handle<RaceRecord[]>(r)),

  getRecordByDate: (date: string): Promise<RaceRecord | null> =>
    fetch(`${BASE}/api/records/date/${date}`).then(r =>
      r.status === 404 ? null : handle<RaceRecord>(r)
    ),

  saveRecord: (record: Omit<RaceRecord, 'id'>): Promise<RaceRecord> =>
    fetch(`${BASE}/api/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    }).then(r => handle<RaceRecord>(r)),

  deleteRecord: (date: string): Promise<void> =>
    fetch(`${BASE}/api/records/date/${date}`, { method: 'DELETE' }).then(r => {
      if (!r.ok) throw new Error(`API error: ${r.status}`)
    }),

  getYearlySummaries: (): Promise<YearlySummary[]> =>
    fetch(`${BASE}/api/summary/yearly`).then(r => handle<YearlySummary[]>(r)),
}
