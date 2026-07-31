import { useState } from 'react'
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa'

const EMPTY_FILTERS = {
  startDate: '',
  endDate: '',
  categoryId: '',
  minAmount: '',
  maxAmount: '',
}

function IncomeFilters({ categories, onSearch, onFilter, onClear }) {
  const [keyword, setKeyword] = useState('')
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [showFilters, setShowFilters] = useState(false)
  const [isFilterActive, setIsFilterActive] = useState(false)

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    setFilters(EMPTY_FILTERS)
    setIsFilterActive(false)
    onSearch(keyword.trim())
  }

  const handleFilterSubmit = (event) => {
    event.preventDefault()
    setKeyword('')
    setIsFilterActive(true)
    onFilter({
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      categoryId: filters.categoryId || undefined,
      minAmount: filters.minAmount || undefined,
      maxAmount: filters.maxAmount || undefined,
    })
  }

  const handleClear = () => {
    setKeyword('')
    setFilters(EMPTY_FILTERS)
    setIsFilterActive(false)
    setShowFilters(false)
    onClear()
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <FaSearch className="text-slate-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by description or category"
            className="w-full bg-transparent outline-none"
          />
        </form>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
              showFilters || isFilterActive
                ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FaFilter /> Filters
          </button>
          {(keyword || isFilterActive) && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <FaTimes /> Clear
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <form onSubmit={handleFilterSubmit} className="mt-4 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">From</span>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">To</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Category</span>
            <select
              value={filters.categoryId}
              onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Min amount</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={filters.minAmount}
              onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
              placeholder="0.00"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Max amount</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={filters.maxAmount}
              onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
              placeholder="0.00"
            />
          </label>
          <div className="sm:col-span-2 lg:col-span-5">
            <button
              type="submit"
              className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Apply filters
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default IncomeFilters
