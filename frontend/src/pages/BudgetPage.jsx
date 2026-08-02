import { useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaArrowUpRightFromSquare } from 'react-icons/fa6'
import { FaPlus } from 'react-icons/fa'
import { addBudget, deleteBudget, getBudgets, updateBudget } from '../api/budgetApi'
import { getCategories } from '../api/categoryApi'
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../api/notificationApi'
import BudgetForm from '../components/budget/BudgetForm'
import BudgetProgress from '../components/budget/BudgetProgress'
import BudgetAlerts from '../components/budget/BudgetAlerts'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0)
}

function BudgetPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const [categories, setCategories] = useState([])
  const [budgets, setBudgets] = useState([])
  const [isBudgetsLoading, setIsBudgetsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const [notifications, setNotifications] = useState([])
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(true)

  const [editingBudget, setEditingBudget] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const formRef = useRef(null)

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    let isCancelled = false
    setIsBudgetsLoading(true)
    getBudgets(year, month)
      .then((data) => {
        if (!isCancelled) setBudgets(data)
      })
      .finally(() => {
        if (!isCancelled) setIsBudgetsLoading(false)
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

  const handleSubmit = async (data) => {
    setIsSubmitting(true)
    setFormError('')
    try {
      if (editingBudget) {
        await updateBudget(editingBudget.id, data)
      } else {
        await addBudget(data)
      }
      setEditingBudget(null)
      setRefreshKey((key) => key + 1)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save this budget.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (budget) => {
    setEditingBudget(budget)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleNew = () => {
    setEditingBudget(null)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return
    await deleteBudget(id)
    setRefreshKey((key) => key + 1)
  }

  const handleMarkAsRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    await markNotificationAsRead(id)
  }

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    await markAllNotificationsAsRead()
  }

  const totalLimit = budgets.reduce((sum, b) => sum + Number(b.amount), 0)
  const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent), 0)
  const overallPercent = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0
  const exceededCount = budgets.filter((b) => b.exceeded).length

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">Budget planner</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Plan your monthly spending</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
              aria-label="Previous month"
            >
              <FaChevronLeft size={12} />
            </button>
            <span className="min-w-[9rem] text-center font-medium text-slate-700">
              {MONTH_NAMES[month - 1]} {year}
            </span>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
              aria-label="Next month"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
          <button
            type="button"
            onClick={handleNew}
            className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700"
          >
            <FaPlus /> New budget
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div ref={formRef}>
            <BudgetForm
              categories={categories}
              year={year}
              month={month}
              editingBudget={editingBudget}
              onSubmit={handleSubmit}
              onCancel={() => setEditingBudget(null)}
              isSubmitting={isSubmitting}
              error={formError}
            />
          </div>

          <BudgetProgress
            budgets={budgets}
            isLoading={isBudgetsLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <div className="space-y-6">
          <BudgetAlerts
            notifications={notifications}
            isLoading={isNotificationsLoading}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-emerald-600">
              <FaArrowUpRightFromSquare />
              <h2 className="text-lg font-semibold text-slate-900">Budget insight</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {isBudgetsLoading
                ? 'Loading your budget insight...'
                : budgets.length === 0
                ? 'Set a budget for a category to start tracking your spending against it.'
                : exceededCount > 0
                ? `You've gone over budget in ${exceededCount} ${exceededCount === 1 ? 'category' : 'categories'} this month. Review your alerts and adjust spending where you can.`
                : `You've used ${overallPercent}% of your total monthly budget (${formatCurrency(totalSpent)} of ${formatCurrency(totalLimit)}) across ${budgets.length} ${budgets.length === 1 ? 'category' : 'categories'}. Keep it up.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BudgetPage
