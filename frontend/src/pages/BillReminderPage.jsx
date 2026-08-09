import { useEffect, useState } from 'react'
import { FaBell, FaCalendarDays, FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa6'
import { getBills, markBillPaid } from '../api/billApi'
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../api/notificationApi'
import BillCalendar from '../components/bill/BillCalendar'
import BillNotifications from '../components/bill/BillNotifications'
import UpcomingBills from '../components/bill/UpcomingBills'

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0)
}

function BillReminderPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const [bills, setBills] = useState([])
  const [isBillsLoading, setIsBillsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const [notifications, setNotifications] = useState([])
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(true)

  const [error, setError] = useState('')

  useEffect(() => {
    let isCancelled = false
    setIsBillsLoading(true)
    setError('')

    getBills({ year, month })
      .then((data) => {
        if (!isCancelled) setBills(data || [])
      })
      .catch(() => {
        if (!isCancelled) setError('Unable to load bill reminders right now.')
      })
      .finally(() => {
        if (!isCancelled) setIsBillsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [year, month, refreshKey])

  useEffect(() => {
    let isCancelled = false
    setIsNotificationsLoading(true)

    getNotifications({ page: 0, size: 10 })
      .then((data) => {
        if (!isCancelled) setNotifications(data.content ?? [])
      })
      .finally(() => {
        if (!isCancelled) setIsNotificationsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [refreshKey])

  const shiftMonth = (delta) => {
    const date = new Date(year, month - 1 + delta, 1)
    setYear(date.getFullYear())
    setMonth(date.getMonth() + 1)
  }

  const handleMarkPaid = async (id) => {
    setBills((prev) => prev.map((bill) => (bill.id === id ? { ...bill, paid: true } : bill)))
    try {
      await markBillPaid(id)
      setRefreshKey((key) => key + 1)
    } catch (err) {
      // Keep optimistic state and allow page refresh to reconcile on next load.
    }
  }

  const handleMarkAsRead = async (id) => {
    setNotifications((prev) => prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)))
    await markNotificationAsRead(id)
  }

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    await markAllNotificationsAsRead()
  }

  const upcomingBills = bills.filter((bill) => !bill.paid)
  const totalDue = upcomingBills.reduce((sum, bill) => sum + Number(bill.amount || 0), 0)
  const dueCount = upcomingBills.length

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">Bill reminder</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Manage your upcoming payments</h1>
          <p className="mt-2 text-slate-600">Schedule bill reminders, track due dates, and keep alerts under control.</p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700">
          <FaPlus /> Schedule reminder
        </button>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">Upcoming due</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{dueCount}</p>
          <p className="mt-2 text-sm text-slate-500">Active bills due this month.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">Total amount</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{formatCurrency(totalDue)}</p>
          <p className="mt-2 text-sm text-slate-500">Projected monthly payment total.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-600">
            <FaBell size={20} />
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">Alerts</p>
              <p className="mt-1 text-slate-900">{notifications.filter((notification) => !notification.read).length} unread</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">Calendar</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Billing schedule</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <button type="button" onClick={() => shiftMonth(-1)} className="rounded-full p-2 hover:bg-slate-100">
                  <FaChevronLeft size={12} />
                </button>
                <span>{MONTH_NAMES[month - 1]} {year}</span>
                <button type="button" onClick={() => shiftMonth(1)} className="rounded-full p-2 hover:bg-slate-100">
                  <FaChevronRight size={12} />
                </button>
              </div>
            </div>
            <div className="mt-6">
              <BillCalendar bills={bills} month={month} year={year} />
            </div>
          </div>

          <UpcomingBills bills={bills} isLoading={isBillsLoading} onMarkPaid={handleMarkPaid} />
        </div>

        <div className="space-y-6">
          <BillNotifications
            notifications={notifications}
            isLoading={isNotificationsLoading}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 text-emerald-600">
              <FaCalendarDays size={20} />
              <h2 className="text-lg font-semibold text-slate-900">How reminders work</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              <li>Schedule upcoming bills and keep payment dates visible.</li>
              <li>Receive reminders for due payments and follow-up alerts.</li>
              <li>Mark bills as paid to keep your schedule current.</li>
            </ul>
          </div>

          {error && (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BillReminderPage
