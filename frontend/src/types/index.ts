export interface RaceRecord {
  id?: number
  date: string // YYYY-MM-DD
  stake: number
  payout: number
  note?: string
}

export interface YearlySummary {
  year: number
  totalStake: number
  totalPayout: number
  profit: number
  recordCount: number
}
