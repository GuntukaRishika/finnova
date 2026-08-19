import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaCamera } from 'react-icons/fa'
import { addExpense, deleteExpense, filterExpense, getExpenses, searchExpense, updateExpense } from '../api/expenseApi'
import { getCategories } from '../api/categoryApi'
import ExpenseSummary from '../components/expense/ExpenseSummary'
import ExpenseForm from '../components/expense/ExpenseForm'
import ExpenseFilters from '../components/expense/ExpenseFilters'
import ExpenseTable from '../components/expense/ExpenseTable'
import ExpenseCards from '../components/expense/ExpenseCards'
import VoiceExpenseEntry from '../components/expense/VoiceExpenseEntry'

const PAGE_SIZE = 10

function ExpensePage() {
  const [categories, setCategories] = useState([])
  const [pageData, setPageData] = useState(null)
  const [pageNumber, setPageNumber] = useState(0)
  const [mode, setMode] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [filters, setFilters] = useState(null)
  const [sort, setSort] = useState('expenseDate,desc')

  const [isTableLoading, setIsTableLoading] = useState(true)
  const [editingExpense, setEditingExpense] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const formRef = useRef(null)

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    let isCancelled = false
    setIsTableLoading(true)

    const request =
      mode === 'search'
        ? searchExpense(keyword, { page: pageNumber, size: PAGE_SIZE, sort })
        : mode === 'filter'
        ? filterExpense(filters, { page: pageNumber, size: PAGE_SIZE, sort })
        : getExpenses({ page: pageNumber, size: PAGE_SIZE, sort })

    request
      .then((data) => {
        if (!isCancelled) setPageData(data)
      })
      .finally(() => {
        if (!isCancelled) setIsTableLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [mode, keyword, filters, pageNumber, refreshKey, sort])

  const handleSearch = (value) => {
    setPageNumber(0)
    if (!value) {
      setMode('all')
      setKeyword('')
    } else {
      setMode('search')
      setKeyword(value)
    }
  }

  const handleFilter = (nextFilters) => {
    setPageNumber(0)
    setMode('filter')
    setFilters(nextFilters)
  }

  const handleClear = () => {
    setPageNumber(0)
    setMode('all')
    setKeyword('')
    setFilters(null)
  }

  const handleSortChange = (value) => {
    setPageNumber(0)
    setSort(value)
  }

  const handleSubmit = async (data) => {
    setIsSubmitting(true)
    setFormError('')
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, data)
      } else {
        await addExpense(data)
      }
      setEditingExpense(null)
      setRefreshKey((key) => key + 1)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save this expense entry.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense entry?')) return
    await deleteExpense(id)
    setRefreshKey((key) => key + 1)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-600">Expense</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Manage your expenses</h1>
          <p className="mt-2 text-slate-600">Track spending, review monthly totals, and search past entries.</p>
        </div>
        <Link
          to="/scan-bill"
          className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 font-medium text-rose-700 transition hover:bg-rose-100"
        >
          <FaCamera /> Scan a bill
        </Link>
      </div>

      <ExpenseSummary refreshKey={refreshKey} />

      <VoiceExpenseEntry categories={categories} onSubmit={handleSubmit} isSubmitting={isSubmitting} />

      <div ref={formRef}>
        <ExpenseForm
          categories={categories}
          editingExpense={editingExpense}
          onSubmit={handleSubmit}
          onCancel={() => setEditingExpense(null)}
          isSubmitting={isSubmitting}
          error={formError}
        />
      </div>

      <ExpenseFilters categories={categories} sort={sort} onSortChange={handleSortChange} onSearch={handleSearch} onFilter={handleFilter} onClear={handleClear} />

      <div className="hidden md:block">
        <ExpenseTable page={pageData} isLoading={isTableLoading} onEdit={handleEdit} onDelete={handleDelete} onPageChange={setPageNumber} />
      </div>
      <ExpenseCards page={pageData} isLoading={isTableLoading} onEdit={handleEdit} onDelete={handleDelete} onPageChange={setPageNumber} />
    </div>
  )
}

export default ExpensePage
