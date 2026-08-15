import { useEffect, useState } from 'react'
import { FaStore, FaCoins, FaCalendarAlt, FaTag, FaPercentage, FaCheck, FaRedo } from 'react-icons/fa'

function ReceiptReviewForm({ scanResult, previewUrl, categories, onConfirm, onDiscard, isSaving, error }) {
  const [form, setForm] = useState({ categoryId: '', amount: '', expenseDate: '', description: '' })

  useEffect(() => {
    if (!scanResult) return
    setForm({
      categoryId: '',
      amount: scanResult.amount != null ? String(scanResult.amount) : '',
      expenseDate: scanResult.billDate || new Date().toISOString().slice(0, 10),
      description: scanResult.merchant || '',
    })
  }, [scanResult])

  if (!scanResult) return null

  const handleSubmit = (event) => {
    event.preventDefault()
    onConfirm({
      categoryId: Number(form.categoryId),
      amount: Number(form.amount),
      expenseDate: form.expenseDate,
      description: form.description.trim() || null,
    })
  }

  const amountWasDetected = scanResult.amount != null
  const dateWasDetected = !!scanResult.billDate

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Review scanned bill</h2>
          <p className="mt-1 text-sm text-slate-600">
            Confirm the details we read from your receipt before saving it as an expense.
          </p>
        </div>
        <button
          type="button"
          onClick={onDiscard}
          className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <FaRedo /> Scan another
        </button>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Scanned receipt"
            className="h-full max-h-80 w-full rounded-2xl border border-slate-200 object-cover"
          />
        )}

        <div>
          {!amountWasDetected && (
            <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
              We couldn&apos;t confidently read the total amount from this receipt — please enter it manually.
            </p>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Merchant / description</span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <FaStore className="text-slate-400" />
                <input
                  type="text"
                  maxLength={255}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-transparent outline-none"
                  placeholder="Merchant name"
                />
              </div>
            </label>

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
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Date {!dateWasDetected && <span className="text-xs font-normal text-slate-400">(not detected)</span>}
              </span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <FaCalendarAlt className="text-slate-400" />
                <input
                  type="date"
                  required
                  value={form.expenseDate}
                  onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </label>

            {scanResult.gstAmount != null && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">GST detected</span>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500">
                  <FaPercentage className="text-slate-400" />
                  {scanResult.gstAmount}
                </div>
              </label>
            )}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                <FaCheck />
                {isSaving ? 'Saving...' : 'Confirm & save as expense'}
              </button>
            </div>
          </form>

          {scanResult.rawText && (
            <details className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <summary className="cursor-pointer text-sm font-medium text-slate-600">
                View raw OCR text ({scanResult.ocrProvider})
              </summary>
              <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap text-xs text-slate-500">
                {scanResult.rawText}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReceiptReviewForm
