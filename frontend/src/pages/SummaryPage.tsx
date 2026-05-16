import { useState, useEffect } from 'react'
import { api } from '../api/client'
import type { YearlySummary } from '../types'

function fmt(n: number) {
  return n.toLocaleString('ja-JP') + '円'
}

export default function SummaryPage() {
  const [summaries, setSummaries] = useState<YearlySummary[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    api
      .getYearlySummaries()
      .then(setSummaries)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const totalStake = summaries.reduce((s, r) => s + r.totalStake, 0)
  const totalPayout = summaries.reduce((s, r) => s + r.totalPayout, 0)
  const totalProfit = totalPayout - totalStake

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">年間収支一覧</h2>

      {loading ? (
        <div className="text-center py-12 text-gray-400">読み込み中...</div>
      ) : summaries.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          データがありません。カレンダーから記録を追加してください。
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-800 text-white">
                <th className="py-3 px-4 text-left">年</th>
                <th className="py-3 px-4 text-right">掛け金合計</th>
                <th className="py-3 px-4 text-right">払い戻し合計</th>
                <th className="py-3 px-4 text-right">収支</th>
                <th className="py-3 px-4 text-right">回収率</th>
                <th className="py-3 px-4 text-right">日数</th>
              </tr>
            </thead>
            <tbody>
              {summaries.map((s, i) => {
                const rate =
                  s.totalStake > 0
                    ? ((s.totalPayout / s.totalStake) * 100).toFixed(1)
                    : '0.0'
                return (
                  <tr
                    key={s.year}
                    className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="py-3 px-4 font-semibold">{s.year}年</td>
                    <td className="py-3 px-4 text-right">{fmt(s.totalStake)}</td>
                    <td className="py-3 px-4 text-right">{fmt(s.totalPayout)}</td>
                    <td
                      className={`py-3 px-4 text-right font-semibold ${
                        s.profit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {s.profit >= 0 ? '+' : ''}
                      {fmt(s.profit)}
                    </td>
                    <td
                      className={`py-3 px-4 text-right ${
                        Number(rate) >= 100 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {rate}%
                    </td>
                    <td className="py-3 px-4 text-right text-gray-500">{s.recordCount}日</td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 border-t-2 border-gray-300 font-semibold">
                <td className="py-3 px-4">合計</td>
                <td className="py-3 px-4 text-right">{fmt(totalStake)}</td>
                <td className="py-3 px-4 text-right">{fmt(totalPayout)}</td>
                <td
                  className={`py-3 px-4 text-right ${
                    totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {totalProfit >= 0 ? '+' : ''}
                  {fmt(totalProfit)}
                </td>
                <td
                  className={`py-3 px-4 text-right ${
                    totalStake > 0 && totalPayout / totalStake >= 1
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {totalStake > 0
                    ? ((totalPayout / totalStake) * 100).toFixed(1) + '%'
                    : '-'}
                </td>
                <td className="py-3 px-4 text-right text-gray-500">
                  {summaries.reduce((s, r) => s + r.recordCount, 0)}日
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </main>
  )
}
