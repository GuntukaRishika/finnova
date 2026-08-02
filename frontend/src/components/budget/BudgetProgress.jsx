import { FaChartBar, FaEdit, FaTrash } from 'react-icons/fa'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0)
}

function barColor(budget) {
  if (budget.exceeded) return 'bg-red-500'
  if (budget.nearingLimit) return 'bg-amber-500'
  return 'bg-emerald-500'
}

function BudgetProgress({ budgets, isLoading, onEdit, onDelete }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 text-emerald-600">
        <FaChartBar />
        <h2 className="text-lg font-semibold text-slate-900">Budget progress</h2>
      </div>

      <div className="mt-6 space-y-5">
        {isLoading && <p className="text-sm text-slate-500">Loading...</p>}

        {!isLoading && budgets.length === 0 && (
          <p className="text-sm text-slate-500">No budgets set for this period yet.</p>
        )}

        {!isLoading &&
          budgets.map((budget) => (
            <div key={budget.id}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{budget.categoryName}</span>
                <span className="text-slate-500">
                  {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                </span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className={`h-3 rounded-full ${barColor(budget)}`}
                  style={{ width: `${Math.min(budget.percentUsed, 100)}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p
                  className={`text-sm ${
                    budget.exceeded ? 'text-red-600' : budget.nearingLimit ? 'text-amber-600' : 'text-slate-500'
                  }`}
                >
                  {budget.percentUsed}% used{budget.exceeded ? ' · over budget' : ''}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onEdit(budget)}
                    className="text-slate-400 hover:text-emerald-600"
                    aria-label="Edit budget"
                  >
                    <FaEdit />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(budget.id)}
                    className="text-slate-400 hover:text-red-600"
                    aria-label="Delete budget"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default BudgetProgress
