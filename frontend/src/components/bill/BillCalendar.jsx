import { FaCalendarDays } from 'react-icons/fa6'

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function BillCalendar({ bills, month, year }) {
  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDayIndex = new Date(year, month - 1, 1).getDay()
  const dueDays = new Set(bills.map((bill) => new Date(bill.dueDate).getDate()))

  const gridDays = []
  for (let i = 0; i < firstDayIndex; i += 1) {
    gridDays.push(null)
  }
  for (let date = 1; date <= daysInMonth; date += 1) {
    gridDays.push(date)
  }
  while (gridDays.length % 7 !== 0) {
    gridDays.push(null)
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 text-emerald-600">
        <FaCalendarDays size={20} />
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Reminder calendar</h2>
          <p className="text-sm text-slate-500">See due dates for upcoming bills.</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2 text-sm text-slate-700">
        {gridDays.map((date, index) => {
          const isDue = date !== null && dueDays.has(date)
          return (
            <div
              key={`${year}-${month}-${index}`}
              className={`min-h-[3rem] rounded-2xl border px-2 py-2 transition ${
                isDue ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50'
              }`}
            >
              {date ?? ''}
              {isDue && <div className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-700 mx-auto" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BillCalendar
