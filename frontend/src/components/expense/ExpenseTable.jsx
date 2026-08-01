import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0)
}

function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function ExpenseTable({ page, isLoading, onEdit, onDelete, onPageChange }) {
  const content = page?.content ?? []
  const totalPages = page?.totalPages ?? 0
  const number = page?.number ?? 0
  const totalElements = page?.totalElements ?? 0

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            )}
            {!isLoading && content.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  No expense entries found.
                </td>
              </tr>
            )}
            {!isLoading &&
              content.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-600">{formatDate(expense.expenseDate)}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                      {expense.categoryName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{expense.description || '—'}</td>
                  <td className="px-6 py-4 text-right font-medium text-slate-900">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => onEdit(expense)}
                        className="text-slate-400 hover:text-rose-600"
                        aria-label="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(expense.id)}
                        className="text-slate-400 hover:text-red-600"
                        aria-label="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-sm text-slate-600">
        <span>
          {totalElements === 0
            ? 'No results'
            : `Page ${number + 1} of ${totalPages} · ${totalElements} entries`}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={number <= 0}
            onClick={() => onPageChange(number - 1)}
            className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaChevronLeft size={10} /> Prev
          </button>
          <button
            type="button"
            disabled={number >= totalPages - 1}
            onClick={() => onPageChange(number + 1)}
            className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next <FaChevronRight size={10} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExpenseTable
