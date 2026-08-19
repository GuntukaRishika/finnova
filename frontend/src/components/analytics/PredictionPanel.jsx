import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const colors = { income: '#059669', expense: '#f97316', savings: '#2563eb' }

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value) || 0)
}

function label(point) {
  return `${String(point.month).padStart(2, '0')}/${String(point.year).slice(-2)}`
}

function trendLabel(value) {
  return value === 'UP' ? 'Rising' : value === 'DOWN' ? 'Falling' : 'Stable'
}

function PredictionPanel({ data, loading, historyMonths, forecastMonths, onHistoryChange, onForecastChange }) {
  const chartData = (data?.points || []).map((point) => ({
    name: label(point),
    income: point.forecast ? null : Number(point.income),
    expense: point.forecast ? null : Number(point.expense),
    savings: point.forecast ? null : Number(point.savings),
    predictedIncome: point.forecast ? Number(point.income) : null,
    predictedExpense: point.forecast ? Number(point.expense) : null,
    predictedSavings: point.forecast ? Number(point.savings) : null,
  }))

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">Savings and expense forecast</h2>
          <p className="mt-1 text-sm text-slate-500">A moving-average projection from your recent monthly history.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={historyMonths} onChange={(event) => onHistoryChange(Number(event.target.value))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600">
            <option value={3}>3 months history</option>
            <option value={6}>6 months history</option>
            <option value={12}>12 months history</option>
          </select>
          <select value={forecastMonths} onChange={(event) => onForecastChange(Number(event.target.value))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600">
            <option value={3}>3 month forecast</option>
            <option value={6}>6 month forecast</option>
            <option value={12}>12 month forecast</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 flex h-72 items-center justify-center text-sm text-slate-400">Calculating forecast...</div>
      ) : chartData.length === 0 ? (
        <div className="mt-8 flex h-72 items-center justify-center text-sm text-slate-400">No history available for forecasting yet.</div>
      ) : (
        <>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 4 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="income" name="Actual income" stroke={colors.income} strokeWidth={2} dot={false} connectNulls={false} />
                <Line type="monotone" dataKey="expense" name="Actual expense" stroke={colors.expense} strokeWidth={2} dot={false} connectNulls={false} />
                <Line type="monotone" dataKey="savings" name="Actual savings" stroke={colors.savings} strokeWidth={2} dot={false} connectNulls={false} />
                <Line type="monotone" dataKey="predictedIncome" name="Forecast income" stroke={colors.income} strokeWidth={2} strokeDasharray="6 4" dot={false} connectNulls={false} />
                <Line type="monotone" dataKey="predictedExpense" name="Forecast expense" stroke={colors.expense} strokeWidth={2} strokeDasharray="6 4" dot={false} connectNulls={false} />
                <Line type="monotone" dataKey="predictedSavings" name="Forecast savings" stroke={colors.savings} strokeWidth={2} strokeDasharray="6 4" dot={false} connectNulls={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-emerald-50 p-4"><p className="text-xs uppercase tracking-wide text-emerald-700">Income trend</p><p className="mt-1 font-semibold text-slate-900">{trendLabel(data.incomeTrend)}</p><p className="mt-1 text-sm text-slate-600">Avg {formatCurrency(data.averageIncome)}</p></div>
            <div className="rounded-2xl bg-orange-50 p-4"><p className="text-xs uppercase tracking-wide text-orange-700">Expense trend</p><p className="mt-1 font-semibold text-slate-900">{trendLabel(data.expenseTrend)}</p><p className="mt-1 text-sm text-slate-600">Avg {formatCurrency(data.averageExpense)}</p></div>
            <div className="rounded-2xl bg-blue-50 p-4"><p className="text-xs uppercase tracking-wide text-blue-700">Savings trend</p><p className="mt-1 font-semibold text-slate-900">{trendLabel(data.savingsTrend)}</p><p className="mt-1 text-sm text-slate-600">Avg {formatCurrency(data.averageSavings)}</p></div>
          </div>
        </>
      )}
    </section>
  )
}

export default PredictionPanel