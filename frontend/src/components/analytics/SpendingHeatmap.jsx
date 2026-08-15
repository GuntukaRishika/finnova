import { useMemo, useState } from 'react'
import { SEQUENTIAL_BLUE, INK } from '../../utils/chartColors'
import { formatCurrency } from '../../utils/analyticsFormat'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const RAMP_STEPS = [150, 300, 450, 550, 700]

function stepForRatio(ratio) {
  if (ratio <= 0) return null
  if (ratio <= 0.2) return RAMP_STEPS[0]
  if (ratio <= 0.4) return RAMP_STEPS[1]
  if (ratio <= 0.6) return RAMP_STEPS[2]
  if (ratio <= 0.8) return RAMP_STEPS[3]
  return RAMP_STEPS[4]
}

function SpendingHeatmap({ data, year, month, loading }) {
  const [hovered, setHovered] = useState(null)

  const { weeks, maxAmount } = useMemo(() => {
    if (!data) return { weeks: [], maxAmount: 0 }
    const days = data.days || []
    const max = Math.max(...days.map((d) => Number(d.amount)), 0)
    const firstDate = new Date(days[0]?.date || `${year}-${String(month).padStart(2, '0')}-01`)
    const leadingBlanks = firstDate.getDay()

    const cells = [...Array(leadingBlanks).fill(null), ...days]
    const weekRows = []
    for (let i = 0; i < cells.length; i += 7) {
      weekRows.push(cells.slice(i, i + 7))
    }
    return { weeks: weekRows, maxAmount: max }
  }, [data, year, month])

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Spending heatmap</h2>
          <p className="mt-1 text-sm text-slate-500">Daily spend intensity for the month</p>
        </div>
        {data && (
          <p className="text-sm text-slate-500">
            Total {formatCurrency(data.totalAmount)} · Avg/day {formatCurrency(data.averageDailyAmount)}
          </p>
        )}
      </div>

      {loading || !data ? (
        <div className="mt-8 flex h-48 items-center justify-center text-sm text-slate-400">
          {loading ? 'Loading heatmap…' : 'No data yet.'}
        </div>
      ) : (
        <div className="mt-5">
          <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-medium text-slate-400">
            {WEEKDAY_LABELS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div className="mt-1.5 space-y-1.5">
            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-1.5">
                {week.map((day, di) => {
                  if (!day) return <div key={di} className="aspect-square rounded-lg" />
                  const amount = Number(day.amount)
                  const ratio = maxAmount > 0 ? amount / maxAmount : 0
                  const step = stepForRatio(ratio)
                  const dayNum = new Date(day.date).getDate()
                  const isHovered = hovered === day.date
                  return (
                    <div
                      key={day.date}
                      className="relative aspect-square cursor-default rounded-lg text-right transition"
                      style={{
                        backgroundColor: step ? SEQUENTIAL_BLUE[step] : INK.gridline,
                        outline: isHovered ? `2px solid ${INK.baseline}` : 'none',
                        outlineOffset: '1px',
                      }}
                      onMouseEnter={() => setHovered(day.date)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(day.date)}
                      onBlur={() => setHovered(null)}
                      tabIndex={0}
                    >
                      <span
                        className="absolute right-1 top-0.5 text-[10px] font-medium"
                        style={{ color: step && step >= 450 ? '#fcfcfb' : INK.secondary }}
                      >
                        {dayNum}
                      </span>
                      {isHovered && (
                        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-md">
                          <span className="font-semibold text-slate-900">{formatCurrency(amount)}</span>
                          <span className="ml-1 text-slate-500">{day.date}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-end gap-1.5 text-xs text-slate-400">
            <span>Less</span>
            <span className="h-3 w-3 rounded" style={{ backgroundColor: INK.gridline }} />
            {RAMP_STEPS.map((step) => (
              <span key={step} className="h-3 w-3 rounded" style={{ backgroundColor: SEQUENTIAL_BLUE[step] }} />
            ))}
            <span>More</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default SpendingHeatmap
