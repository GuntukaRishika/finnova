import { FaCheckCircle } from 'react-icons/fa'

function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(value))
}

function UpcomingBills({ bills, isLoading, onMarkPaid }) {
  const sortedBills = [...bills].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">Upcoming bills</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">Due soon</h2>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">Loading bills...</div>
        ) : sortedBills.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">No bill reminders scheduled for this month.</div>
        ) : (
          sortedBills.map((bill) => {
            const dueDate = formatDate(bill.dueDate)
            const status = bill.paid ? 'Paid' : new Date(bill.dueDate) < new Date() ? 'Overdue' : 'Due'
            return (
              <div key={bill.id} className="rounded-3xl border border-slate-200 p-4 shadow-sm transition hover:border-emerald-200">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{bill.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{bill.category || 'Monthly bill'}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    bill.paid ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {status}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4 text-sm text-slate-600">
                  <p>{dueDate}</p>
                  <p className="font-semibold text-slate-900">${bill.amount}</p>
                </div>

                {!bill.paid && (
                  <button
                    type="button"
                    onClick={() => onMarkPaid(bill.id)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    <FaCheckCircle /> Mark paid
                  </button>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default UpcomingBills
