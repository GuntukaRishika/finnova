import { FaChartBar, FaExclamationTriangle, FaPlus } from 'react-icons/fa'
import { FaArrowUpRightFromSquare } from 'react-icons/fa6'
const budgetItems = [
  { label: 'Housing', used: 1640, limit: 2000, color: 'bg-emerald-500' },
  { label: 'Food', used: 335, limit: 500, color: 'bg-sky-500' },
  { label: 'Travel', used: 240, limit: 500, color: 'bg-orange-500' },
]

const alerts = [
  'Housing is 82% of your monthly budget.',
  'Food spending is trending above your target.',
]

function BudgetPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">Budget planner</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Plan your monthly spending</h1>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 font-medium text-white">
          <FaPlus /> New budget
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-600">
            <FaChartBar />
            <h2 className="text-lg font-semibold text-slate-900">Budget progress</h2>
          </div>

          <div className="mt-6 space-y-5">
            {budgetItems.map((item) => {
              const percent = Math.min(Math.round((item.used / item.limit) * 100), 100)
              return (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <span className="text-slate-500">${item.used} / ${item.limit}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div className={`h-3 rounded-full ${item.color}`} style={{ width: `${percent}%` }} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{percent}% used</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-amber-600">
              <FaExclamationTriangle />
              <h2 className="text-lg font-semibold text-slate-900">Budget alerts</h2>
            </div>
            <ul className="mt-4 space-y-3">
              {alerts.map((alert) => (
                <li key={alert} className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {alert}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-emerald-600">
              <FaArrowUpRightFromSquare />
              <h2 className="text-lg font-semibold text-slate-900">Budget insight</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Your spending is staying mostly on track. Focus on reducing discretionary purchases to protect your savings goal.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BudgetPage
