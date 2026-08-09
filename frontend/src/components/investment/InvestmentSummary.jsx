function InvestmentSummary({ investments }) {
  const totalValue = investments.reduce((sum, inv) => sum + Number(inv.currentValue || 0), 0)
  const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amountInvested || 0), 0)
  const totalPnL = totalValue - totalInvested

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">Portfolio value</p>
        <p className="mt-4 text-3xl font-semibold text-slate-900">${totalValue.toLocaleString()}</p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">Amount invested</p>
        <p className="mt-4 text-3xl font-semibold text-slate-900">${totalInvested.toLocaleString()}</p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">Profit / loss</p>
        <p className={`mt-4 text-3xl font-semibold ${totalPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          ${totalPnL.toLocaleString()}
        </p>
      </div>
    </div>
  )
}

export default InvestmentSummary
