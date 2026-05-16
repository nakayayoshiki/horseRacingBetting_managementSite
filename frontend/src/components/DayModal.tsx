import { useState, useEffect } from 'react'
import type { RaceRecord } from '../types'

interface Props {
  date: string
  record?: RaceRecord
  onClose: () => void
  onSave: (record: Omit<RaceRecord, 'id'>) => Promise<void>
  onDelete?: () => Promise<void>
}

function formatDate(date: string) {
  return new Date(date + 'T00:00:00').toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}

export default function DayModal({ date, record, onClose, onSave, onDelete }: Props) {
  const [stake, setStake] = useState(record?.stake ?? 0)
  const [payout, setPayout] = useState(record?.payout ?? 0)
  const [note, setNote] = useState(record?.note ?? '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setStake(record?.stake ?? 0)
    setPayout(record?.payout ?? 0)
    setNote(record?.note ?? '')
  }, [record])

  const profit = payout - stake

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave({ date, stake, payout, note: note || undefined })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    setDeleting(true)
    try {
      await onDelete()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-gray-800">{formatDate(date)}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              掛け金 (円)
            </label>
            <input
              type="number"
              value={stake}
              onChange={e => setStake(Math.max(0, Number(e.target.value)))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              min={0}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              払い戻し金 (円)
            </label>
            <input
              type="number"
              value={payout}
              onChange={e => setPayout(Math.max(0, Number(e.target.value)))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              min={0}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              メモ
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <div
            className={`text-center py-2 rounded-lg font-semibold text-sm ${
              profit >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            収支: {profit >= 0 ? '+' : ''}
            {profit.toLocaleString('ja-JP')}円
            {stake > 0 && (
              <span className="ml-2 font-normal text-xs opacity-70">
                (回収率 {((payout / stake) * 100).toFixed(0)}%)
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          {record && onDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 text-sm"
            >
              {deleting ? '削除中...' : '削除'}
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50 text-sm font-medium"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  )
}
