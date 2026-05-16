import type { RaceRecord, YearlySummary } from '../types'

// 開発: VITE_API_URL未設定 → Viteプロキシ経由で /api/... をバックエンドに転送
// 本番: VITE_API_URL=https://your-backend.onrender.com
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
    fetch(`${BASE}/api/records/date/${date}`, { method: 'DELETE' }).then(r =>
      handle<void>(r)
    ),

  getYearlySummaries: (): Promise<YearlySummary[]> =>
    fetch(`${BASE}/api/summary/yearly`).then(r => handle<YearlySummary[]>(r)),
}
