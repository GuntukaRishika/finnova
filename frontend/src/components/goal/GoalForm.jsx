import { useEffect, useState } from 'react'
import { FaBullseye, FaCoins, FaCalendarAlt, FaPlus, FaSave, FaTimes } from 'react-icons/fa'

const EMPTY_FORM = { name: '', targetAmount: '', targetDate: '' }

function GoalForm({ editingGoal, onSubmit, onCancel, isSubmitting, error }) {
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    if (editingGoal) {
      setForm({
        name: editingGoal.name,
        targetAmount: String(editingGoal.targetAmount),
        targetDate: editingGoal.targetDate || '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [editingGoal])

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({
      name: form.name.trim(),
      targetAmount: Number(form.targetAmount),
      targetDate: form.targetDate || null,
    })
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {editingGoal ? 'Edit goal' : 'New goal'}
        </h2>
        {editingGoal && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <FaTimes /> Cancel
          </button>
        )}
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm font-medium text-slate-700">Goal name</span>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FaBullseye className="text-slate-400" />
            <input
              type="text"
              required
              maxLength={100}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-transparent outline-none"
              placeholder="e.g. Emergency fund"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Target amount</span>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FaCoins className="text-slate-400" />
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={form.targetAmount}
              onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
              className="w-full bg-transparent outline-none"
              placeholder="0.00"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Target date (optional)</span>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FaCalendarAlt className="text-slate-400" />
            <input
              type="date"
              value={form.targetDate}
              onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
              className="w-full bg-transparent outline-none"
            />
          </div>
        </label>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {editingGoal ? <FaSave /> : <FaPlus />}
            {isSubmitting ? 'Saving...' : editingGoal ? 'Save changes' : 'Add goal'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default GoalForm
