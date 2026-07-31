import { useEffect, useRef, useState } from 'react'
import { addIncome, deleteIncome, filterIncome, getIncomes, searchIncome, updateIncome } from '../api/incomeApi'
import { getCategories } from '../api/categoryApi'
import IncomeSummary from '../components/income/IncomeSummary'
import IncomeForm from '../components/income/IncomeForm'
import IncomeFilters from '../components/income/IncomeFilters'
import IncomeTable from '../components/income/IncomeTable'

const PAGE_SIZE = 10

function IncomePage() {
  const [categories, setCategories] = useState([])
  const [pageData, setPageData] = useState(null)
  const [pageNumber, setPageNumber] = useState(0)
  const [mode, setMode] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [filters, setFilters] = useState(null)

  const [isTableLoading, setIsTableLoading] = useState(true)
  const [editingIncome, setEditingIncome] = useState(null)
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
        ? searchIncome(keyword, { page: pageNumber, size: PAGE_SIZE })
        : mode === 'filter'
        ? filterIncome(filters, { page: pageNumber, size: PAGE_SIZE })
        : getIncomes({ page: pageNumber, size: PAGE_SIZE })

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
  }, [mode, keyword, filters, pageNumber, refreshKey])

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

  const handleSubmit = async (data) => {
    setIsSubmitting(true)
    setFormError('')
    try {
      if (editingIncome) {
        await updateIncome(editingIncome.id, data)
      } else {
        await addIncome(data)
      }
      setEditingIncome(null)
      setRefreshKey((key) => key + 1)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save this income entry.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (income) => {
    setEditingIncome(income)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this income entry?')) return
    await deleteIncome(id)
    setRefreshKey((key) => key + 1)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-16">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">Income</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Manage your income</h1>
        <p className="mt-2 text-slate-600">Track deposits, review monthly totals, and search past entries.</p>
      </div>

      <IncomeSummary refreshKey={refreshKey} />

      <div ref={formRef}>
        <IncomeForm
          categories={categories}
          editingIncome={editingIncome}
          onSubmit={handleSubmit}
          onCancel={() => setEditingIncome(null)}
          isSubmitting={isSubmitting}
          error={formError}
        />
      </div>

      <IncomeFilters categories={categories} onSearch={handleSearch} onFilter={handleFilter} onClear={handleClear} />

      <IncomeTable
        page={pageData}
        isLoading={isTableLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPageChange={setPageNumber}
      />
    </div>
  )
}

export default IncomePage
