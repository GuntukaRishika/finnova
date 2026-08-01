import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaMoneyBillWave, FaPiggyBank, FaChartPie, FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6'

const summaryCards = [
  { title: 'Monthly income', value: '$4,800', change: '+12.4%', trend: 'up' },
  { title: 'Monthly expenses', value: '$2,640', change: '-4.2%', trend: 'down' },
  { title: 'Cash flow', value: '$2,160', change: '+8.1%', trend: 'up' },
]

const monthlySeries = [4200, 4500, 3800, 4700, 4900, 4800]
const categoryBreakdown = [
  { name: 'Housing', amount: '$900', percent: '34%' },
  { name: 'Food', amount: '$360', percent: '14%' },
  { name: 'Travel', amount: '$280', percent: '11%' },
  { name: 'Utilities', amount: '$220', percent: '8%' },
]

const yearlySummary = [
  { label: 'Jan', value: 1100 },
  { label: 'Feb', value: 1400 },
  { label: 'Mar', value: 1250 },
  { label: 'Apr', value: 1600 },
  { label: 'May', value: 1500 },
  { label: 'Jun', value: 1800 },
]

const recentTransactions = [
  { title: 'Salary deposit', type: 'Income', amount: '+$3,200', date: 'Today' },
  { title: 'Groceries', type: 'Expense', amount: '-$84', date: 'Yesterday' },
  { title: 'Utility bill', type: 'Expense', amount: '-$120', date: '2 days ago' },
]

function DashboardPage() {
  const auth = useSelector((state) => state.auth)

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Welcome back, {auth.user?.name || 'there'}.
          </h1>
        </div>
        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
          Week 5 • Insights & summaries
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {summaryCards.map((card) => (
          <div key={card.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">{card.title}</p>
            <div className="mt-4 flex items-end justify-between">
              <p className="text-2xl font-semibold text-slate-900">{card.value}</p>
              <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-sm ${card.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {card.trend === 'up' ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
                {card.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Monthly performance</h2>
              <p className="mt-1 text-sm text-slate-500">Income vs. expense trend for the current year</p>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">Last 6 months</div>
          </div>

          <div className="mt-6 flex h-48 items-end gap-3">
            {monthlySeries.map((value, index) => (
              <div key={`${value}-${index}`} className="flex-1">
                <div className="rounded-t-2xl bg-gradient-to-t from-emerald-600 to-emerald-400" style={{ height: `${(value / 5000) * 100}%` }} />
                <p className="mt-2 text-center text-xs text-slate-500">M{index + 1}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Category breakdown</h2>
          <p className="mt-1 text-sm text-slate-500">Top spending categories this month</p>
          <div className="mt-6 space-y-4">
            {categoryBreakdown.map((item) => (
              <div key={item.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.name}</span>
                  <span className="text-slate-500">{item.amount}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: item.percent }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Yearly summary</h2>
          <p className="mt-1 text-sm text-slate-500">A simple area-style growth view for the year</p>
          <div className="mt-6 flex h-40 items-end gap-3">
            {yearlySummary.map((item) => (
              <div key={item.label} className="flex-1">
                <div className="rounded-t-2xl bg-gradient-to-t from-slate-700 to-emerald-400" style={{ height: `${(item.value / 1800) * 100}%` }} />
                <p className="mt-2 text-center text-xs text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recent transactions</h2>
          <p className="mt-1 text-sm text-slate-500">Latest activity for quick review</p>
          <div className="mt-6 space-y-3">
            {recentTransactions.map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.date}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${item.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>{item.amount}</p>
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
        <Link to="/expenses" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md">
          <div className="flex items-center gap-3 text-emerald-600">
            <FaChartPie size={20} />
            <h2 className="text-lg font-semibold">Expenses</h2>
          </div>
          <p className="mt-4 text-sm text-slate-600">Category trends, rules, and spending snapshots.</p>
        </Link>
        <Link to="/savings" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md">
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
