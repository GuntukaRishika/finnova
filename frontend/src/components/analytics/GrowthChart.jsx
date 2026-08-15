import { useMemo, useState } from 'react'
import { CATEGORICAL, INK, niceCeil } from '../../utils/chartColors'
import { formatCurrency, formatPercent, monthLabel } from '../../utils/analyticsFormat'

const WIDTH = 640
const HEIGHT = 260
const PAD_LEFT = 48
const PAD_RIGHT = 16
const PAD_TOP = 16
const PAD_BOTTOM = 32

const INCOME_COLOR = CATEGORICAL[0]
const EXPENSE_COLOR = CATEGORICAL[1]
const NET_COLOR = CATEGORICAL[2]

function GrowthChart({ data, loading }) {
  const [hoverIndex, setHoverIndex] = useState(null)

  const plotWidth = WIDTH - PAD_LEFT - PAD_RIGHT
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM

  const { domainMax, domainMin, yTicks } = useMemo(() => {
    if (!data || data.length === 0) return { domainMax: 100, domainMin: 0, yTicks: [0, 50, 100] }
    const maxVal = Math.max(...data.map((d) => Math.max(Number(d.totalIncome), Number(d.totalExpense), Number(d.netCashFlow))), 0)
    const minVal = Math.min(...data.map((d) => Number(d.netCashFlow)), 0)
    const ceil = niceCeil(Math.max(maxVal, Math.abs(minVal)))
    const max = ceil
    const min = minVal < 0 ? -ceil / 2 : 0
    const ticks = [min, min + (max - min) / 2, max]
    return { domainMax: max, domainMin: min, yTicks: ticks }
  }, [data])

  const yScale = (value) => PAD_TOP + plotHeight - ((value - domainMin) / (domainMax - domainMin)) * plotHeight
  const zeroY = yScale(0)

  const bandWidth = data && data.length > 0 ? plotWidth / data.length : plotWidth
  const barWidth = Math.min(18, bandWidth * 0.3)

  const netPoints = (data || []).map((d, i) => {
    const x = PAD_LEFT + bandWidth * i + bandWidth / 2
    const y = yScale(Number(d.netCashFlow))
    return { x, y }
  })
  const netPath = netPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  const hovered = hoverIndex !== null && data ? data[hoverIndex] : null

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Monthly growth</h2>
          <p className="mt-1 text-sm text-slate-500">Income, expenses, and net cash flow trend</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: INCOME_COLOR }} />Income</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: EXPENSE_COLOR }} />Expense</span>
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded" style={{ backgroundColor: NET_COLOR }} />Net</span>
        </div>
      </div>

      {loading || !data || data.length === 0 ? (
        <div className="mt-8 flex h-52 items-center justify-center text-sm text-slate-400">
          {loading ? 'Loading growth data…' : 'No data for this range yet.'}
        </div>
      ) : (
        <div className="relative mt-4">
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Monthly income, expense, and net cash flow">
            {yTicks.map((tick) => (
              <g key={tick}>
                <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={yScale(tick)} y2={yScale(tick)} stroke={INK.gridline} strokeWidth={1} />
                <text x={PAD_LEFT - 8} y={yScale(tick) + 3} textAnchor="end" fontSize="10" fill={INK.muted}>
                  {tick >= 1000 || tick <= -1000 ? `${Math.round(tick / 1000)}k` : Math.round(tick)}
                </text>
              </g>
            ))}
            <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={zeroY} y2={zeroY} stroke={INK.baseline} strokeWidth={1} />

            {data.map((d, i) => {
              const groupX = PAD_LEFT + bandWidth * i + bandWidth / 2
              const incomeH = zeroY - yScale(Number(d.totalIncome))
              const expenseH = zeroY - yScale(Number(d.totalExpense))
              const isHovered = hoverIndex === i
              return (
                <g key={`${d.year}-${d.month}`}>
                  <rect
                    x={groupX - barWidth - 2}
                    y={yScale(Number(d.totalIncome))}
                    width={barWidth}
                    height={Math.max(incomeH, 0)}
                    rx={3}
                    fill={INCOME_COLOR}
                    opacity={isHovered ? 1 : 0.9}
                  />
                  <rect
                    x={groupX + 2}
                    y={yScale(Number(d.totalExpense))}
                    width={barWidth}
                    height={Math.max(expenseH, 0)}
                    rx={3}
                    fill={EXPENSE_COLOR}
                    opacity={isHovered ? 1 : 0.9}
                  />
                  <text x={groupX} y={HEIGHT - PAD_BOTTOM + 16} textAnchor="middle" fontSize="10" fill={INK.muted}>
                    {monthLabel(d.month)}
                  </text>
                  <rect
                    x={PAD_LEFT + bandWidth * i}
                    y={PAD_TOP}
                    width={bandWidth}
                    height={plotHeight}
                    fill="transparent"
                    onMouseEnter={() => setHoverIndex(i)}
                    onMouseLeave={() => setHoverIndex(null)}
                    onFocus={() => setHoverIndex(i)}
                    onBlur={() => setHoverIndex(null)}
                    tabIndex={0}
                  />
                </g>
              )
            })}

            <path d={netPath} fill="none" stroke={NET_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            {netPoints.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={hoverIndex === i ? 5 : 4} fill={NET_COLOR} stroke={INK.surface} strokeWidth={2} />
            ))}

            {hoverIndex !== null && (
              <line x1={PAD_LEFT + bandWidth * hoverIndex + bandWidth / 2} x2={PAD_LEFT + bandWidth * hoverIndex + bandWidth / 2}
                y1={PAD_TOP} y2={PAD_TOP + plotHeight} stroke={INK.baseline} strokeWidth={1} strokeDasharray="2,2" />
            )}
          </svg>

          {hovered && (
            <div className="pointer-events-none absolute left-3 top-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs shadow-md">
              <p className="font-semibold text-slate-900">{monthLabel(hovered.month)} {hovered.year}</p>
              <p className="mt-1 flex items-center justify-between gap-4 text-slate-600">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ backgroundColor: INCOME_COLOR }} />Income</span>
                <span className="font-semibold text-slate-900">{formatCurrency(hovered.totalIncome)}</span>
              </p>
              <p className="flex items-center justify-between gap-4 text-slate-600">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ backgroundColor: EXPENSE_COLOR }} />Expense</span>
                <span className="font-semibold text-slate-900">{formatCurrency(hovered.totalExpense)}</span>
              </p>
              <p className="flex items-center justify-between gap-4 text-slate-600">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ backgroundColor: NET_COLOR }} />Net</span>
                <span className="font-semibold text-slate-900">{formatCurrency(hovered.netCashFlow)}</span>
              </p>
              <p className="mt-1 border-t border-slate-100 pt-1 text-slate-500">Net growth {formatPercent(hovered.netGrowthPercent)} vs prior month</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default GrowthChart
