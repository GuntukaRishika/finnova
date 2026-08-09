import { useMemo } from 'react'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0)
}

function AssetAllocationChart({ investments }) {
  const totalValue = investments.reduce((sum, inv) => sum + Number(inv.currentValue || 0), 0)

  const allocation = useMemo(
    () =>
      investments
        .map((investment) => ({
          label: investment.assetName,
          percent: totalValue > 0 ? Math.round((Number(investment.currentValue || 0) / totalValue) * 100) : 0,
        }))
        .slice(0, 5),
    [investments, totalValue],
  )

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Asset allocation</h2>
          <p className="mt-1 text-sm text-slate-500">Portfolio distribution by asset.</p>
        </div>
        <p className="text-sm text-slate-500">Total value {formatCurrency(totalValue)}</p>
      </div>

      <div className="mt-6 space-y-4">
        {allocation.length === 0 ? (
          <p className="text-sm text-slate-500">No allocation data available.</p>
        ) : (
          allocation.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>{item.label}</span>
                <span>{item.percent}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${item.percent}%` }} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AssetAllocationChart
