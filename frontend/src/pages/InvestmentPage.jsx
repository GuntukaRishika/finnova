import { useEffect, useRef, useState } from 'react'
import { FaChartLine, FaCoins, FaArrowTrendUp } from 'react-icons/fa6'
import { addInvestment, deleteInvestment, getInvestments, updateInvestment } from '../api/investmentApi'
import InvestmentForm from '../components/investment/InvestmentForm'
import InvestmentSummary from '../components/investment/InvestmentSummary'
import InvestmentTable from '../components/investment/InvestmentTable'
import AssetAllocationChart from '../components/investment/AssetAllocationChart'

function InvestmentPage() {
  const [investments, setInvestments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const [editingInvestment, setEditingInvestment] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const formRef = useRef(null)

  useEffect(() => {
    let isCancelled = false
    setIsLoading(true)
    setError('')

    getInvestments({ page: 0, size: 20 })
      .then((data) => {
        if (!isCancelled) setInvestments(data.content || [])
      })
      .catch(() => {
        if (!isCancelled) setError('Unable to load investment data right now.')
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [refreshKey])

  const handleSubmit = async (data) => {
    setIsSubmitting(true)
    setFormError('')
    try {
      if (editingInvestment) {
        await updateInvestment(editingInvestment.id, data)
      } else {
        await addInvestment(data)
      }
      setEditingInvestment(null)
      setRefreshKey((key) => key + 1)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save this investment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (investment) => {
    setEditingInvestment(investment)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleNew = () => {
    setEditingInvestment(null)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this investment?')) return
    await deleteInvestment(id)
    if (editingInvestment?.id === id) setEditingInvestment(null)
    setRefreshKey((key) => key + 1)
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">Investment portfolio</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Track your investments</h1>
          <p className="mt-2 text-slate-600">View portfolio value, asset allocation, and performance at a glance.</p>
        </div>
        <button
          type="button"
          onClick={handleNew}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700"
        >
          <FaCoins /> Add asset
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div ref={formRef} className="mb-8">
        <InvestmentForm
          editingInvestment={editingInvestment}
          onSubmit={handleSubmit}
          onCancel={() => setEditingInvestment(null)}
          isSubmitting={isSubmitting}
          error={formError}
        />
      </div>

      <InvestmentSummary investments={investments} />

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
        <InvestmentTable
          investments={investments}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <AssetAllocationChart investments={investments} />
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 text-emerald-600">
          <FaChartLine size={20} />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Investment insights</h2>
            <p className="text-sm text-slate-500">See your portfolio health and next actions.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 p-5 text-slate-700">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Diversification</p>
            <p className="mt-3 text-xl font-semibold text-slate-900">Keep a balanced mix of asset types.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5 text-slate-700">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Risk</p>
            <p className="mt-3 text-xl font-semibold text-slate-900">Review downside exposure regularly.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5 text-slate-700">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Growth</p>
            <p className="mt-3 text-xl font-semibold text-slate-900">Track your returns against goals.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvestmentPage
