import { useSelector } from 'react-redux'
import { FaMoneyBillWave, FaPiggyBank, FaChartPie } from 'react-icons/fa'

function DashboardPage() {
  const auth = useSelector((state) => state.auth)

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Welcome back, {auth.user?.username || 'there'}.
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-600">
            <FaMoneyBillWave size={20} />
            <h2 className="text-lg font-semibold">Income</h2>
          </div>
          <p className="mt-4 text-sm text-slate-600">Monthly income overview and upcoming deposits.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-600">
            <FaChartPie size={20} />
            <h2 className="text-lg font-semibold">Expense insights</h2>
          </div>
          <p className="mt-4 text-sm text-slate-600">Category trends, rules, and spending snapshots.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-600">
            <FaPiggyBank size={20} />
            <h2 className="text-lg font-semibold">Savings goals</h2>
          </div>
          <p className="mt-4 text-sm text-slate-600">Track short-term goals and progress towards them.</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
