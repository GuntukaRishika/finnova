import { useEffect, useState } from 'react'
import { FaArrowTrendUp, FaBuilding, FaCalendarDays, FaCoins, FaFloppyDisk, FaLayerGroup, FaPlus, FaXmark } from 'react-icons/fa6'

const INVESTMENT_TYPES = [
  { value: 'STOCK', label: 'Stock' },
  { value: 'MUTUAL_FUND', label: 'Mutual Fund' },
  { value: 'GOLD', label: 'Gold' },
  { value: 'FD', label: 'Fixed Deposit' },
  { value: 'CRYPTO', label: 'Crypto' },
]

function emptyForm() {
  return { type: 'STOCK', assetName: '', amountInvested: '', currentValue: '', purchaseDate: '' }
}

function InvestmentForm({ editingInvestment, onSubmit, onCancel, isSubmitting, error }) {
  const [form, setForm] = useState(emptyForm())

  useEffect(() => {
    if (editingInvestment) {
      setForm({
        type: editingInvestment.type || 'STOCK',
        assetName: editingInvestment.assetName || '',
        amountInvested: String(editingInvestment.amountInvested ?? ''),
        currentValue: String(editingInvestment.currentValue ?? ''),
        purchaseDate: editingInvestment.purchaseDate ? String(editingInvestment.purchaseDate).slice(0, 10) : '',
      })
    } else {
      setForm(emptyForm())
    }
  }, [editingInvestment])

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({
      type: form.type,
      assetName: form.assetName.trim(),
      amountInvested: Number(form.amountInvested),
      currentValue: Number(form.currentValue),
      purchaseDate: form.purchaseDate || null,
    })
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {editingInvestment ? 'Edit asset' : 'Add asset'}
        </h2>
        {editingInvestment && (
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
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Asset type</span>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FaLayerGroup className="text-slate-400" />
            <select
              required
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full bg-transparent outline-none"
            >
              {INVESTMENT_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Asset name</span>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FaBuilding className="text-slate-400" />
            <input
              type="text"
              required
              maxLength={100}
              value={form.assetName}
              onChange={(e) => setForm({ ...form, assetName: e.target.value })}
              className="w-full bg-transparent outline-none"
              placeholder="e.g. Apple Inc."
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Amount invested</span>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FaCoins className="text-slate-400" />
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={form.amountInvested}
              onChange={(e) => setForm({ ...form, amountInvested: e.target.value })}
              className="w-full bg-transparent outline-none"
              placeholder="0.00"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Current value</span>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FaArrowTrendUp className="text-slate-400" />
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={form.currentValue}
              onChange={(e) => setForm({ ...form, currentValue: e.target.value })}
              className="w-full bg-transparent outline-none"
              placeholder="0.00"
            />
          </div>
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm font-medium text-slate-700">Purchase date (optional)</span>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FaCalendarDays className="text-slate-400" />
            <input
              type="date"
              value={form.purchaseDate}
              onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
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
            {editingInvestment ? <FaFloppyDisk /> : <FaPlus />}
            {isSubmitting ? 'Saving...' : editingInvestment ? 'Save changes' : 'Add asset'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default InvestmentForm
