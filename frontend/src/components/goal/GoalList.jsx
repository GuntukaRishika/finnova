import { useState } from 'react'
import { FaBullseye, FaEdit, FaTrash, FaCheckCircle, FaPlus } from 'react-icons/fa'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0)
}

function formatDate(value) {
  if (!value) return 'No target date'
  return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function ContributeControl({ goal, onContribute }) {
  const [amount, setAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const value = Number(amount)
    if (!value || value <= 0) return
    setIsSubmitting(true)
    try {
      await onContribute(goal.id, value)
      setAmount('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="number"
        min="0.01"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Add funds"
        className="w-28 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm outline-none"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <FaPlus size={10} /> Contribute
      </button>
    </form>
  )
}

function GoalList({ goals, isLoading, onEdit, onDelete, onContribute }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 text-emerald-600">
        <FaBullseye />
        <h2 className="text-lg font-semibold text-slate-900">Savings goals</h2>
      </div>

      <div className="mt-6 space-y-6">
        {isLoading && <p className="text-sm text-slate-500">Loading...</p>}

        {!isLoading && goals.length === 0 && (
          <p className="text-sm text-slate-500">No goals yet. Set one to start tracking your savings.</p>
        )}

        {!isLoading &&
          goals.map((goal) => {
            const completed = goal.status === 'COMPLETED'
            return (
              <div key={goal.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">{goal.name}</span>
                    {completed && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        <FaCheckCircle /> Completed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onEdit(goal)}
                      className="text-slate-400 hover:text-emerald-600"
                      aria-label="Edit goal"
                    >
                      <FaEdit />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(goal.id)}
                      className="text-slate-400 hover:text-red-600"
                      aria-label="Delete goal"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </span>
                  <span className="text-slate-500">{formatDate(goal.targetDate)}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className={`h-3 rounded-full ${completed ? 'bg-emerald-500' : 'bg-sky-500'}`}
                    style={{ width: `${goal.percentComplete}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    {goal.percentComplete}% funded
                    {!completed && ` · ${formatCurrency(goal.remainingAmount)} to go`}
                  </p>
                  {!completed && <ContributeControl goal={goal} onContribute={onContribute} />}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default GoalList
