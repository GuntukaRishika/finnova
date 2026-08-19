import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from 'react-icons/fa'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0)
}

function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function ExpenseCards({ page, isLoading, onEdit, onDelete, onPageChange }) {
  const content = page?.content ?? []
  const totalPages = page?.totalPages ?? 0
  const number = page?.number ?? 0
  const totalElements = page?.totalElements ?? 0

  return (
    <div className="space-y-4 md:hidden">
      {isLoading && <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-500">Loading...</div>}
      {!isLoading && content.length === 0 && <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-500">No expense entries found.</div>}
      {!isLoading && content.map((expense) => (
        <article key={expense.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">{expense.categoryName}</span>
              <p className="mt-3 font-medium text-slate-900">{expense.description || 'Expense entry'}</p>
              <p className="mt-1 text-sm text-slate-500">{formatDate(expense.expenseDate)}</p>
            </div>
            <p className="font-semibold text-slate-900">{formatCurrency(expense.amount)}</p>
          </div>
          <div className="mt-4 flex justify-end gap-4 border-t border-slate-100 pt-4">
            <button type="button" onClick={() => onEdit(expense)} className="text-slate-400 hover:text-rose-600" aria-label="Edit expense"><FaEdit /></button>
            <button type="button" onClick={() => onDelete(expense.id)} className="text-slate-400 hover:text-red-600" aria-label="Delete expense"><FaTrash /></button>
          </div>
        </article>
      ))}
      <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600">
        <span>{totalElements === 0 ? 'No results' : `Page ${number + 1} of ${totalPages}`}</span>
        <div className="flex gap-2">
          <button type="button" disabled={number <= 0} onClick={() => onPageChange(number - 1)} className="rounded-full border border-slate-200 p-2 disabled:opacity-40" aria-label="Previous page"><FaChevronLeft size={10} /></button>
          <button type="button" disabled={number >= totalPages - 1} onClick={() => onPageChange(number + 1)} className="rounded-full border border-slate-200 p-2 disabled:opacity-40" aria-label="Next page"><FaChevronRight size={10} /></button>
        </div>
      </div>
    </div>
  )
}

export default ExpenseCards