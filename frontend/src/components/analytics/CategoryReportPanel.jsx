import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6'
import { categoricalColor, STATUS, INK } from '../../utils/chartColors'
import { formatCurrency, formatPercent, monthLabel } from '../../utils/analyticsFormat'

function Sparkline({ trend, color }) {
  if (!trend || trend.length < 2) return null
  const values = trend.map((t) => Number(t.amount))
  const max = Math.max(...values, 1)
  const width = 100
  const height = 28
  const step = width / (values.length - 1)
  const points = values.map((v, i) => `${i * step},${height - (v / max) * height}`).join(' ')
  const lastX = (values.length - 1) * step
  const lastY = height - (values[values.length - 1] / max) * height

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-7 w-24" role="img" aria-label="Trend over recent months">
      <polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r={3} fill={color} stroke="#fcfcfb" strokeWidth={1.5} />
    </svg>
  )
}

function CategoryReportPanel({ data, type, onTypeChange, months, onMonthsChange, loading }) {
  const categories = data?.categories || []
  const top = categories.slice(0, 8)
  const otherTotal = categories.slice(8).reduce((sum, c) => sum + Number(c.totalAmount), 0)
  const maxAmount = Math.max(...top.map((c) => Number(c.totalAmount)), 1)
  // For expenses, a decrease is the favorable direction; for income, an increase is.
  const increaseIsGood = type === 'INCOME'

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Category report</h2>
          <p className="mt-1 text-sm text-slate-500">
            {data ? `${monthLabel(new Date(data.startDate).getMonth() + 1)} ${new Date(data.startDate).getFullYear()} – ${monthLabel(new Date(data.endDate).getMonth() + 1)} ${new Date(data.endDate).getFullYear()}` : `Last ${months} months`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
          >
            <option value="EXPENSE">Expenses</option>
            <option value="INCOME">Income</option>
          </select>
          <select
            value={months}
            onChange={(e) => onMonthsChange(Number(e.target.value))}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
          >
            <option value={3}>3 months</option>
            <option value={6}>6 months</option>
            <option value={12}>12 months</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 flex h-40 items-center justify-center text-sm text-slate-400">Loading category report…</div>
      ) : top.length === 0 ? (
        <div className="mt-8 flex h-40 items-center justify-center text-sm text-slate-400">No {type.toLowerCase()} recorded in this range.</div>
      ) : (
        <div className="mt-6 space-y-4">
          {top.map((category, index) => {
            const color = categoricalColor(index)
            const widthPct = (Number(category.totalAmount) / maxAmount) * 100
            const changeUp = Number(category.changePercent) > 0
            const isGoodChange = category.changePercent === null ? null : changeUp === increaseIsGood
            return (
              <div key={category.categoryId} className="flex items-center gap-4">
                <div className="flex w-40 items-center gap-2 shrink-0">
                  <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: color }} />
                  <span className="truncate text-sm font-medium text-slate-700">{category.categoryName}</span>
                </div>
                <div className="flex-1">
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full" style={{ width: `${widthPct}%`, backgroundColor: color }} />
                  </div>
                </div>
                <Sparkline trend={category.trend} color={color} />
                <div className="w-24 shrink-0 text-right">
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(category.totalAmount)}</p>
                  <p className="text-xs text-slate-400">{Number(category.percentage).toFixed(1)}%</p>
                </div>
                <div
                  className="flex w-20 shrink-0 items-center justify-end gap-1 text-xs font-medium"
                  style={{ color: isGoodChange === null ? INK.muted : isGoodChange ? STATUS.good : STATUS.critical }}
                >
                  {category.changePercent !== null && (changeUp ? <FaArrowTrendUp /> : <FaArrowTrendDown />)}
                  {formatPercent(category.changePercent)}
                </div>
              </div>
            )
          })}
          {otherTotal > 0 && (
            <p className="pt-2 text-xs text-slate-400">
              + {formatCurrency(otherTotal)} across {categories.length - 8} other categories
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default CategoryReportPanel
