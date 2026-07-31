import { useEffect, useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaCoins, FaListUl, FaChartLine } from 'react-icons/fa'
import { getMonthlyIncome } from '../../api/incomeApi'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0)
}

function IncomeSummary({ refreshKey }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [summary, setSummary] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCancelled = false
    setIsLoading(true)
    getMonthlyIncome(year, month)
      .then((data) => {
        if (!isCancelled) setSummary(data)
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false)
      })
    return () => {
      isCancelled = true
    }
  }, [year, month, refreshKey])

  const shiftMonth = (delta) => {
    const date = new Date(year, month - 1 + delta, 1)
    setYear(date.getFullYear())
    setMonth(date.getMonth() + 1)
  }

  const entries = summary?.entries ?? []
  const total = summary?.totalAmount ?? 0
  const count = entries.length
  const average = count > 0 ? total / count : 0

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">Income Dashboard</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            {MONTH_NAMES[month - 1]} {year}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
            aria-label="Previous month"
          >
            <FaChevronLeft size={12} />
          </button>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
            aria-label="Next month"
          >
            <FaChevronRight size={12} />
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-emerald-50 p-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <FaCoins />
            <span className="text-xs font-semibold uppercase tracking-wide">Total income</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {isLoading ? '—' : formatCurrency(total)}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-600">
            <FaListUl />
            <span className="text-xs font-semibold uppercase tracking-wide">Entries</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{isLoading ? '—' : count}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-600">
            <FaChartLine />
            <span className="text-xs font-semibold uppercase tracking-wide">Average entry</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {isLoading ? '—' : formatCurrency(average)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default IncomeSummary
