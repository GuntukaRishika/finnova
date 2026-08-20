import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaMoneyBillWave, FaPiggyBank, FaChartPie, FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getCategorySummary, getCashFlow, getMonthlySummary, getRecentTransactions, getYearlySummary } from '../api/dashboardApi'

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0)
}

const categoryColors = ['#10b981', '#38bdf8', '#f97316', '#ef4444']

function formatChange(percent) {
  if (percent === null || percent === undefined) return '—'
  const value = Number(percent)
  return `${value > 0 ? '+' : ''}${value}%`
}

function formatTransactionDate(date) {
  const transactionDate = new Date(`${date}T00:00:00`)
  const daysAgo = Math.round((new Date().setHours(0, 0, 0, 0) - transactionDate.getTime()) / 86400000)
  if (daysAgo === 0) return 'Today'
  if (daysAgo === 1) return 'Yesterday'
  if (daysAgo > 1 && daysAgo < 7) return `${daysAgo} days ago`
  return transactionDate.toLocaleDateString()
}

function DashboardPage() {
  const auth = useSelector((state) => state.auth)
  const today = new Date()
  const [monthlySummary, setMonthlySummary] = useState(null)
  const [yearlySummary, setYearlySummary] = useState(null)
  const [categorySummary, setCategorySummary] = useState(null)
  const [cashFlow, setCashFlow] = useState(null)
  const [recentTransactions, setRecentTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const year = today.getFullYear()
    const month = today.getMonth() + 1

    Promise.all([
      getMonthlySummary(year, month),
      getYearlySummary(year),
      getCategorySummary(year, month, 'EXPENSE'),
      getRecentTransactions(),
      getCashFlow(year, month),
    ])
      .then(([monthly, yearly, category, recent, flow]) => {
        setMonthlySummary(monthly)
        setYearlySummary(yearly)
        setCategorySummary(category)
        setRecentTransactions(recent)
        setCashFlow(flow)
      })
      .catch(() => setError('Unable to load dashboard data right now.'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const currentMonth = today.getMonth() + 1
  const monthsToDate = (yearlySummary?.months || []).filter((m) => m.month <= currentMonth)
  const monthlyChartData = monthsToDate.map((item) => ({ name: monthLabels[item.month - 1], income: Number(item.totalIncome) || 0 }))
  const yearlyChartData = (yearlySummary?.months || []).map((item) => ({ name: monthLabels[item.month - 1], cashFlow: Number(item.netCashFlow) || 0 }))

  const summaryCards = [
    {
      title: 'Monthly income',
      value: formatCurrency(monthlySummary?.totalIncome),
      change: formatChange(monthlySummary?.incomeChangePercent),
      trend: Number(monthlySummary?.incomeChangePercent) >= 0 ? 'up' : 'down',
    },
    {
      title: 'Monthly expenses',
      value: formatCurrency(monthlySummary?.totalExpense),
      change: formatChange(monthlySummary?.expenseChangePercent),
      trend: Number(monthlySummary?.expenseChangePercent) >= 0 ? 'down' : 'up',
    },
    {
      title: 'Cash flow',
      value: formatCurrency(monthlySummary?.netCashFlow),
      change: formatChange(monthlySummary?.cashFlowChangePercent),
      trend: Number(monthlySummary?.cashFlowChangePercent) >= 0 ? 'up' : 'down',
    },
  ]

  const categoryBreakdown = (categorySummary?.categories || []).slice(0, 4).map((item) => ({
    name: item.categoryName,
    amount: Number(item.amount) || 0,
    percent: Number(item.percentage) || 0,
  }))

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Welcome back, {auth.user?.username || 'there'}.
          </h1>
        </div>
        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
          {monthLabels[currentMonth - 1]} {today.getFullYear()} • Insights & summaries
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {summaryCards.map((card) => (
          <div key={card.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">{card.title}</p>
            <div className="mt-4 flex items-end justify-between">
              <p className="text-2xl font-semibold text-slate-900">{loading ? '—' : card.value}</p>
              <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-sm ${card.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {card.trend === 'up' ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
                {card.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Savings rate</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{loading ? '—' : `${Number(cashFlow?.savingsRate || 0).toFixed(1)}%`}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Daily average expense</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{loading ? '—' : formatCurrency(cashFlow?.averageDailyExpense)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Top expense category</p>
          <p className="mt-2 truncate text-xl font-semibold text-slate-900">{loading ? '—' : cashFlow?.topExpenseCategory || 'None yet'}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Monthly performance</h2>
              <p className="mt-1 text-sm text-slate-500">Income trend for the current year</p>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">Year to date</div>
          </div>

          <div className="mt-6 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyChartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area type="monotone" dataKey="income" stroke="#059669" fill="#a7f3d0" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Category breakdown</h2>
          <p className="mt-1 text-sm text-slate-500">Top spending categories this month</p>
          <div className="mt-6 space-y-4">
            {categoryBreakdown.length === 0 && !loading && (
              <p className="text-sm text-slate-400">No expenses recorded this month yet.</p>
            )}
            {categoryBreakdown.map((item) => (
              <div key={item.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.name}</span>
                  <span className="text-slate-500">{formatCurrency(item.amount)}</span>
                </div>
              </div>
            ))}
            </div>
            <div className="flex h-52 items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryBreakdown} dataKey="amount" nameKey="name" innerRadius={55} outerRadius={82} paddingAngle={3}>
                    {categoryBreakdown.map((item, index) => <Cell key={item.name} fill={categoryColors[index % categoryColors.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Yearly summary</h2>
          <p className="mt-1 text-sm text-slate-500">Net cash flow by month for {today.getFullYear()}</p>
          <div className="mt-6 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyChartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="cashFlow" fill="#334155" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recent transactions</h2>
          <p className="mt-1 text-sm text-slate-500">Latest activity for quick review</p>
          <div className="mt-6 space-y-3">
            {recentTransactions.length === 0 && !loading && (
              <p className="text-sm text-slate-400">No transactions recorded yet.</p>
            )}
            {recentTransactions.map((item) => (
              <div key={`${item.type}-${item.id}`} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">{formatTransactionDate(item.date)}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${item.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.type === 'INCOME' ? '+' : '-'}{formatCurrency(item.amount)}
                  </p>
                  <p className="text-sm text-slate-500">{item.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Link to="/income" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md">
          <div className="flex items-center gap-3 text-emerald-600">
            <FaMoneyBillWave size={20} />
            <h2 className="text-lg font-semibold">Income</h2>
          </div>
          <p className="mt-4 text-sm text-slate-600">Monthly income overview and upcoming deposits.</p>
        </Link>
        <Link to="/expense" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md">
          <div className="flex items-center gap-3 text-emerald-600">
            <FaChartPie size={20} />
            <h2 className="text-lg font-semibold">Expenses</h2>
          </div>
          <p className="mt-4 text-sm text-slate-600">Category trends, rules, and spending snapshots.</p>
        </Link>
        <Link to="/goals" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md">
          <div className="flex items-center gap-3 text-emerald-600">
            <FaPiggyBank size={20} />
            <h2 className="text-lg font-semibold">Savings</h2>
          </div>
          <p className="mt-4 text-sm text-slate-600">Track short-term goals and progress towards them.</p>
        </Link>
      </div>
    </div>
  )
}

export default DashboardPage
