function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0)
}

function InvestmentTable({ investments, isLoading }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Investment portfolio</h2>
        <p className="text-sm text-slate-500">Latest allocations</p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Asset</th>
              <th className="px-4 py-3 text-right font-medium">Amount</th>
              <th className="px-4 py-3 text-right font-medium">Current value</th>
              <th className="px-4 py-3 text-right font-medium">P/L</th>
              <th className="px-4 py-3 text-right font-medium">Allocation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-slate-500">Loading investments...</td>
              </tr>
            ) : investments.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-slate-500">No investments yet.</td>
              </tr>
            ) : (
              investments.map((investment) => {
                const profitLoss = Number(investment.currentValue || 0) - Number(investment.amountInvested || 0)
                return (
                  <tr key={investment.id}>
                    <td className="px-4 py-4 font-medium text-slate-900">{investment.assetName}</td>
                    <td className="px-4 py-4 text-right text-slate-700">{formatCurrency(investment.amountInvested)}</td>
                    <td className="px-4 py-4 text-right text-slate-700">{formatCurrency(investment.currentValue)}</td>
                    <td className={`px-4 py-4 text-right font-semibold ${profitLoss >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {formatCurrency(profitLoss)}
                    </td>
                    <td className="px-4 py-4 text-right text-slate-700">{investment.allocationPercent}%</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InvestmentTable
