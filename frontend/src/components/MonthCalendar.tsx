import type { RaceRecord } from '../types'

interface Props {
  year: number
  month: number
  recordMap: Map<string, RaceRecord>
  onDayClick: (date: string) => void
}

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

function firstDayOfWeek(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay()
}

export default function MonthCalendar({ year, month, recordMap, onDayClick }: Props) {
  const mm = String(month).padStart(2, '0')
  const totalDays = daysInMonth(year, month)
  const startDow = firstDayOfWeek(year, month)

  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]

  return (
    <div className="bg-white rounded-lg shadow p-3">
      <h3 className="text-center font-semibold text-gray-700 mb-2">{month}月</h3>
      <div className="grid grid-cols-7 gap-0.5">
        {DAY_LABELS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-xs font-medium py-1 ${
              i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
            }`}
          >
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />
          const col = i % 7
          const dateStr = `${year}-${mm}-${String(day).padStart(2, '0')}`
          const record = recordMap.get(dateStr)
          const profit = record ? record.payout - record.stake : 0

          const today = new Date()
          const isToday =
            today.getFullYear() === year &&
            today.getMonth() + 1 === month &&
            today.getDate() === day

          return (
            <button
              key={day}
              onClick={() => onDayClick(dateStr)}
              className={[
                'text-xs rounded py-1 text-center transition-colors',
                isToday ? 'ring-1 ring-blue-400' : '',
                record
                  ? profit >= 0
                    ? 'bg-green-100 hover:bg-green-200'
                    : 'bg-red-100 hover:bg-red-200'
                  : 'hover:bg-gray-100',
                col === 0 ? 'text-red-500' : col === 6 ? 'text-blue-500' : 'text-gray-700',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
