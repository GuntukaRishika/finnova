import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6'
import { SEQUENTIAL_BLUE, STATUS, INK } from '../../utils/chartColors'
import { formatCurrency, formatPercent } from '../../utils/analyticsFormat'

const PERIOD_A_COLOR = SEQUENTIAL_BLUE[300]
const PERIOD_B_COLOR = SEQUENTIAL_BLUE[600]

function StatComparison({ label, valueA, valueB, changePercent, increaseIsGood }) {
  const increased = Number(valueB) >= Number(valueA)
  const isGood = changePercent === null ? null : increased === increaseIsGood
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <p className="text-xs text-slate-400">{formatCurrency(valueA)} → </p>
          <p className="text-lg font-semibold text-slate-900">{formatCurrency(valueB)}</p>
        </div>
        <div
          className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
          style={{
            color: isGood === null ? INK.muted : isGood ? STATUS.good : STATUS.critical,
            backgroundColor: isGood === null ? '#f1f0ec' : isGood ? '#e9f7e9' : '#fbeaea',
          }}
        >
          {changePercent !== null && (increased ? <FaArrowTrendUp /> : <FaArrowTrendDown />)}
          {formatPercent(changePercent)}
        </div>
      </div>
    </div>
  )
}

function ComparisonPanel({ data, labelA, labelB, loading }) {
  if (loading || !data) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-52 items-center justify-center text-sm text-slate-400">
          {loading ? 'Loading comparison…' : 'Select two periods to compare.'}
        </div>
      </div>
    )
  }

  const categories = (data.categoryComparison || []).slice(0, 8)
  const maxAmount = Math.max(...categories.flatMap((c) => [Number(c.periodAAmount), Number(c.periodBAmount)]), 1)

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Comparisons</h2>
          <p className="mt-1 text-sm text-slate-500">{labelA} vs {labelB}</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PERIOD_A_COLOR }} />{labelA}</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PERIOD_B_COLOR }} />{labelB}</span>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <StatComparison label="Income" valueA={data.periodAIncome} valueB={data.periodBIncome} changePercent={data.incomeChangePercent} increaseIsGood />
        <StatComparison label="Expense" valueA={data.periodAExpense} valueB={data.periodBExpense} changePercent={data.expenseChangePercent} increaseIsGood={false} />
        <StatComparison label="Net cash flow" valueA={data.periodANet} valueB={data.periodBNet} changePercent={data.netChangePercent} increaseIsGood />
      </div>

      {categories.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-semibold text-slate-700">Expense categories</p>
          <div className="mt-3 space-y-3">
            {categories.map((cat) => {
              const leftPct = (Number(cat.periodAAmount) / maxAmount) * 100
              const rightPct = (Number(cat.periodBAmount) / maxAmount) * 100
              return (
                <div key={cat.categoryId} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 truncate text-sm text-slate-600">{cat.categoryName}</span>
                  <div className="relative h-6 flex-1">
                    <div className="absolute inset-y-0 left-0 right-0 top-1/2 h-px bg-slate-200" />
                    <div
                      className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full"
                      style={{
                        left: `${Math.min(leftPct, rightPct)}%`,
                        width: `${Math.abs(rightPct - leftPct)}%`,
                        backgroundColor: INK.gridline,
                      }}
                    />
                    <div className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 -translate-x-1/2 rounded-full" style={{ left: `${leftPct}%`, backgroundColor: PERIOD_A_COLOR }} />
                    <div className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 -translate-x-1/2 rounded-full" style={{ left: `${rightPct}%`, backgroundColor: PERIOD_B_COLOR }} />
                  </div>
                  <span className="w-16 shrink-0 text-right text-xs font-medium text-slate-500">{formatPercent(cat.changePercent)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ComparisonPanel
