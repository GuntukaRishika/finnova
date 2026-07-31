import { useEffect, useState } from 'react'
import { FaCoins, FaCalendarAlt, FaTag, FaAlignLeft, FaPlus, FaSave, FaTimes } from 'react-icons/fa'

const EMPTY_FORM = {
  categoryId: '',
  amount: '',
  incomeDate: new Date().toISOString().slice(0, 10),
  description: '',
}

function IncomeForm({ categories, editingIncome, onSubmit, onCancel, isSubmitting, error }) {
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    if (editingIncome) {
      setForm({
        categoryId: String(editingIncome.categoryId),
        amount: String(editingIncome.amount),
        incomeDate: editingIncome.incomeDate,
        description: editingIncome.description || '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [editingIncome])

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({
      categoryId: Number(form.categoryId),
      amount: Number(form.amount),
      incomeDate: form.incomeDate,
      description: form.description.trim() || null,
    })
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {editingIncome ? 'Edit income' : 'Add income'}
        </h2>
        {editingIncome && (
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
          <span className="mb-2 block text-sm font-medium text-slate-700">Amount</span>
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
          <span className="mb-2 block text-sm font-medium text-slate-700">Date</span>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FaCalendarAlt className="text-slate-400" />
            <input
              type="date"
              required
              value={form.incomeDate}
              onChange={(e) => setForm({ ...form, incomeDate: e.target.value })}
              className="w-full bg-transparent outline-none"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FaAlignLeft className="text-slate-400" />
            <input
              type="text"
              maxLength={255}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-transparent outline-none"
              placeholder="Optional note"
            />
          </div>
        </label>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {editingIncome ? <FaSave /> : <FaPlus />}
            {isSubmitting ? 'Saving...' : editingIncome ? 'Save changes' : 'Add income'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default IncomeForm
