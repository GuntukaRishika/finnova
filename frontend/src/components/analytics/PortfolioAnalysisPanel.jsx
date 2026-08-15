import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6'
import { INVESTMENT_TYPE_COLORS, STATUS, OTHER_SLOT } from '../../utils/chartColors'
import { formatCurrency, formatPercent } from '../../utils/analyticsFormat'

function typeLabel(type) {
  return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

function PerformanceList({ title, items, tone }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      <div className="mt-3 space-y-2">
        {items.length === 0 && <p className="text-sm text-slate-400">Not enough data yet.</p>}
        {items.map((item) => (
          <div key={item.investmentId} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-900">{item.assetName}</p>
              <p className="text-xs text-slate-500">{typeLabel(item.type)}</p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: tone === 'up' ? STATUS.good : STATUS.critical }}>
              {tone === 'up' ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
              {formatPercent(item.profitLossPercent)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PortfolioAnalysisPanel({ data, loading }) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-52 items-center justify-center text-sm text-slate-400">Loading portfolio analysis…</div>
      </div>
    )
  }

  if (!data || Number(data.summary?.investmentCount || 0) === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Portfolio analysis</h2>
        <p className="mt-4 text-sm text-slate-400">No investments recorded yet.</p>
      </div>
    )
  }

  const { summary, allocation, topPerformers, underPerformers } = data
  const profitPositive = Number(summary.totalProfitLoss) >= 0

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Portfolio analysis</h2>
      <p className="mt-1 text-sm text-slate-500">Performance across {summary.investmentCount} holdings</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Total invested</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{formatCurrency(summary.totalInvested)}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Current value</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{formatCurrency(summary.totalCurrentValue)}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Profit / loss</p>
          <p className="mt-1 flex items-center gap-1.5 text-lg font-semibold" style={{ color: profitPositive ? STATUS.good : STATUS.critical }}>
            {profitPositive ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
            {formatCurrency(summary.totalProfitLoss)} ({summary.totalProfitLossPercent}%)
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-slate-700">Allocation by type</p>
        <div className="mt-3 space-y-3">
          {allocation.map((item) => (
            <div key={item.type}>
              <div className="mb-1.5 flex items-center justify-between text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: INVESTMENT_TYPE_COLORS[item.type] || OTHER_SLOT }} />
                  {typeLabel(item.type)}
                </span>
                <span>{formatCurrency(item.currentValue)} · {item.percent}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${item.percent}%`, backgroundColor: INVESTMENT_TYPE_COLORS[item.type] || OTHER_SLOT }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <PerformanceList title="Top performers" items={topPerformers} tone="up" />
        <PerformanceList title="Underperformers" items={underPerformers} tone="down" />
      </div>
    </div>
  )
}

export default PortfolioAnalysisPanel
