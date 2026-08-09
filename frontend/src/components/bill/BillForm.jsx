import { useEffect, useState } from 'react'
import { FaCalendarDays, FaCoins, FaFileInvoiceDollar, FaFloppyDisk, FaPlus, FaRotate, FaTag, FaXmark } from 'react-icons/fa6'

function emptyForm() {
  return { title: '', amount: '', dueDate: '', category: '', recurring: false }
}

function BillForm({ editingBill, onSubmit, onCancel, isSubmitting, error }) {
  const [form, setForm] = useState(emptyForm())

  useEffect(() => {
    if (editingBill) {
      setForm({
        title: editingBill.title || '',
        amount: String(editingBill.amount ?? ''),
        dueDate: editingBill.dueDate ? String(editingBill.dueDate).slice(0, 10) : '',
        category: editingBill.category || '',
        recurring: Boolean(editingBill.recurring),
      })
    } else {
      setForm(emptyForm())
    }
  }, [editingBill])

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({
      title: form.title.trim(),
      amount: Number(form.amount),
      dueDate: form.dueDate,
      category: form.category.trim() || null,
      recurring: form.recurring,
    })
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {editingBill ? 'Edit bill reminder' : 'Schedule a reminder'}
        </h2>
        {editingBill && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <FaXmark /> Cancel
          </button>
        )}
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm font-medium text-slate-700">Bill title</span>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FaFileInvoiceDollar className="text-slate-400" />
            <input
              type="text"
              required
              maxLength={100}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-transparent outline-none"
              placeholder="e.g. Electricity bill"
            />
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
          <span className="mb-2 block text-sm font-medium text-slate-700">Due date</span>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FaCalendarDays className="text-slate-400" />
            <input
              type="date"
              required
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full bg-transparent outline-none"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Category (optional)</span>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FaTag className="text-slate-400" />
            <input
              type="text"
              maxLength={50}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-transparent outline-none"
              placeholder="e.g. Utilities"
            />
          </div>
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            type="checkbox"
            checked={form.recurring}
            onChange={(e) => setForm({ ...form, recurring: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="flex items-center gap-2 text-sm text-slate-700">
            <FaRotate className="text-slate-400" /> Repeats monthly
          </span>
        </label>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {editingBill ? <FaFloppyDisk /> : <FaPlus />}
            {isSubmitting ? 'Saving...' : editingBill ? 'Save changes' : 'Schedule reminder'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default BillForm
