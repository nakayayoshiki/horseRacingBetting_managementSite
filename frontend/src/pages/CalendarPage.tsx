import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import type { RaceRecord } from '../types'
import YearSelector from '../components/YearSelector'
import MonthCalendar from '../components/MonthCalendar'
import DayModal from '../components/DayModal'

function YearlySummaryBar({ records }: { records: RaceRecord[] }) {
  const totalStake = records.reduce((s, r) => s + r.stake, 0)
  const totalPayout = records.reduce((s, r) => s + r.payout, 0)
  const profit = totalPayout - totalStake

  if (records.length === 0) return null

  return (
    <div className="flex gap-6 justify-center bg-white rounded-lg shadow px-6 py-3 my-3 text-sm">
      <div className="text-center">
        <div className="text-xs text-gray-500">掛け金合計</div>
        <div className="font-semibold">{totalStake.toLocaleString('ja-JP')}円</div>
      </div>
      <div className="w-px bg-gray-200" />
      <div className="text-center">
        <div className="text-xs text-gray-500">払い戻し合計</div>
        <div className="font-semibold">{totalPayout.toLocaleString('ja-JP')}円</div>
      </div>
      <div className="w-px bg-gray-200" />
      <div className="text-center">
        <div className="text-xs text-gray-500">収支</div>
        <div className={`font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {profit >= 0 ? '+' : ''}
          {profit.toLocaleString('ja-JP')}円
        </div>
      </div>
    </div>
  )
}

export default function CalendarPage() {
  const [year, setYear] = useState(new Date().getFullYear())
  const [records, setRecords] = useState<RaceRecord[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const loadRecords = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.getRecordsByYear(year)
      setRecords(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [year])

  useEffect(() => {
    loadRecords()
  }, [loadRecords])

  const recordMap = new Map(records.map(r => [r.date, r]))
  const selectedRecord = selectedDate ? recordMap.get(selectedDate) : undefined

  return (
    <main className="max-w-6xl mx-auto p-4">
      <YearSelector year={year} onChange={setYear} />
      <YearlySummaryBar records={records} />

      {loading ? (
        <div className="text-center py-12 text-gray-400">読み込み中...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
            <MonthCalendar
              key={month}
              year={year}
              month={month}
              recordMap={recordMap}
              onDayClick={setSelectedDate}
            />
          ))}
        </div>
      )}

      {selectedDate && (
        <DayModal
          date={selectedDate}
          record={selectedRecord}
          onClose={() => setSelectedDate(null)}
          onSave={async record => {
            await api.saveRecord(record)
            await loadRecords()
            setSelectedDate(null)
          }}
          onDelete={
            selectedRecord
              ? async () => {
                  await api.deleteRecord(selectedDate)
                  await loadRecords()
                  setSelectedDate(null)
                }
              : undefined
          }
        />
      )}
    </main>
  )
}
