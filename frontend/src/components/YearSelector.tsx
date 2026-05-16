interface Props {
  year: number
  onChange: (year: number) => void
}

export default function YearSelector({ year, onChange }: Props) {
  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <button
        onClick={() => onChange(year - 1)}
        className="w-10 h-10 rounded-full bg-white shadow hover:bg-gray-50 flex items-center justify-center text-xl text-gray-600 transition-colors"
      >
        ‹
      </button>
      <span className="text-2xl font-bold text-gray-800 w-24 text-center">{year}年</span>
      <button
        onClick={() => onChange(year + 1)}
        className="w-10 h-10 rounded-full bg-white shadow hover:bg-gray-50 flex items-center justify-center text-xl text-gray-600 transition-colors"
      >
        ›
      </button>
    </div>
  )
}
