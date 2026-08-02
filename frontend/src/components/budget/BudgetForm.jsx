import { useEffect, useState } from 'react'
import { FaCoins, FaTag, FaCalendarAlt, FaPlus, FaSave, FaTimes } from 'react-icons/fa'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function emptyForm(year, month) {
  return { categoryId: '', amount: '', year: String(year), month: String(month) }
}

function BudgetForm({ categories, year, month, editingBudget, onSubmit, onCancel, isSubmitting, error }) {
  const [form, setForm] = useState(emptyForm(year, month))

  useEffect(() => {
    if (editingBudget) {
      setForm({
        categoryId: String(editingBudget.categoryId),
        amount: String(editingBudget.amount),
        year: String(editingBudget.year),
        month: String(editingBudget.month),
      })
    } else {
      setForm(emptyForm(year, month))
    }
  }, [editingBudget, year, month])

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({
      categoryId: Number(form.categoryId),
      amount: Number(form.amount),
      year: Number(form.year),
      month: Number(form.month),
    })
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {editingBudget ? 'Edit budget' : 'New budget'}
        </h2>
        {editingBudget && (
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
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Category</span>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FaTag className="text-slate-400" />
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full bg-transparent outline-none"
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Monthly limit</span>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FaCoins className="text-slate-400" />
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full bg-transparent outline-none"
              placeholder="0.00"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Month</span>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FaCalendarAlt className="text-slate-400" />
            <select
              required
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              className="w-full bg-transparent outline-none"
            >
              {MONTH_NAMES.map((name, index) => (
                <option key={name} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Year</span>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FaCalendarAlt className="text-slate-400" />
            <input
              type="number"
              required
              min="2000"
              max="2100"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
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
            {editingBudget ? <FaSave /> : <FaPlus />}
            {isSubmitting ? 'Saving...' : editingBudget ? 'Save changes' : 'Add budget'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default BudgetForm
