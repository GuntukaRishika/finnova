import { useEffect, useMemo, useState } from 'react'
import { getMonthlyGrowth, getCategoryReport, getPortfolioAnalysis, getSpendingHeatmap, getComparison } from '../api/analyticsApi'
import GrowthChart from '../components/analytics/GrowthChart'
import CategoryReportPanel from '../components/analytics/CategoryReportPanel'
import PortfolioAnalysisPanel from '../components/analytics/PortfolioAnalysisPanel'
import SpendingHeatmap from '../components/analytics/SpendingHeatmap'
import ComparisonPanel from '../components/analytics/ComparisonPanel'
import { monthLabel } from '../utils/analyticsFormat'

function toMonthInputValue(year, month) {
  return `${year}-${String(month).padStart(2, '0')}`
}

function fromMonthInputValue(value) {
  const [year, month] = value.split('-').map(Number)
  return { year, month }
}

function shiftMonth(year, month, delta) {
  const date = new Date(year, month - 1 + delta, 1)
  return { year: date.getFullYear(), month: date.getMonth() + 1 }
}

function AnalyticsPage() {
  const today = new Date()
  const [anchor, setAnchor] = useState({ year: today.getFullYear(), month: today.getMonth() + 1 })
  const [growthMonths, setGrowthMonths] = useState(6)
  const [categoryType, setCategoryType] = useState('EXPENSE')
  const [categoryMonths, setCategoryMonths] = useState(6)

  const defaultPeriodA = useMemo(() => shiftMonth(anchor.year, anchor.month, -1), [anchor])
  const [periodA, setPeriodA] = useState(defaultPeriodA)
  const [periodB, setPeriodB] = useState(anchor)

  const [growthData, setGrowthData] = useState(null)
  const [categoryData, setCategoryData] = useState(null)
  const [portfolioData, setPortfolioData] = useState(null)
  const [heatmapData, setHeatmapData] = useState(null)
  const [comparisonData, setComparisonData] = useState(null)

  const [loadingGrowth, setLoadingGrowth] = useState(true)
  const [loadingCategory, setLoadingCategory] = useState(true)
  const [loadingPortfolio, setLoadingPortfolio] = useState(true)
  const [loadingHeatmap, setLoadingHeatmap] = useState(true)
  const [loadingComparison, setLoadingComparison] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setPeriodA(shiftMonth(anchor.year, anchor.month, -1))
    setPeriodB(anchor)
  }, [anchor])

  useEffect(() => {
    setLoadingGrowth(true)
    getMonthlyGrowth({ year: anchor.year, month: anchor.month, months: growthMonths })
      .then(setGrowthData)
      .catch(() => setError('Unable to load monthly growth data.'))
      .finally(() => setLoadingGrowth(false))
  }, [anchor, growthMonths])

  useEffect(() => {
    setLoadingCategory(true)
    getCategoryReport({ year: anchor.year, month: anchor.month, months: categoryMonths, type: categoryType })
      .then(setCategoryData)
      .catch(() => setError('Unable to load category report.'))
      .finally(() => setLoadingCategory(false))
  }, [anchor, categoryMonths, categoryType])

  useEffect(() => {
    setLoadingPortfolio(true)
    getPortfolioAnalysis()
      .then(setPortfolioData)
      .catch(() => setError('Unable to load portfolio analysis.'))
      .finally(() => setLoadingPortfolio(false))
  }, [])

  useEffect(() => {
    setLoadingHeatmap(true)
    getSpendingHeatmap(anchor.year, anchor.month)
      .then(setHeatmapData)
      .catch(() => setError('Unable to load spending heatmap.'))
      .finally(() => setLoadingHeatmap(false))
  }, [anchor])

  useEffect(() => {
    setLoadingComparison(true)
    getComparison({ yearA: periodA.year, monthA: periodA.month, yearB: periodB.year, monthB: periodB.month })
      .then(setComparisonData)
      .catch(() => setError('Unable to load comparison.'))
      .finally(() => setLoadingComparison(false))
  }, [periodA, periodB])

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">Analytics</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Deep dive into your finances</h1>
          <p className="mt-1 text-sm text-slate-500">Growth trends, category reports, portfolio performance, and period comparisons.</p>
        </div>
        <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
          As of
          <input
            type="month"
            value={toMonthInputValue(anchor.year, anchor.month)}
            onChange={(e) => setAnchor(fromMonthInputValue(e.target.value))}
            className="bg-transparent font-medium text-slate-900 outline-none"
          />
        </label>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      )}

      <div className="space-y-8">
        <div>
          <div className="mb-3 flex justify-end">
            <select
              value={growthMonths}
              onChange={(e) => setGrowthMonths(Number(e.target.value))}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm"
            >
              <option value={3}>Last 3 months</option>
              <option value={6}>Last 6 months</option>
              <option value={12}>Last 12 months</option>
            </select>
          </div>
          <GrowthChart data={growthData} loading={loadingGrowth} />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <SpendingHeatmap data={heatmapData} year={anchor.year} month={anchor.month} loading={loadingHeatmap} />
          <PortfolioAnalysisPanel data={portfolioData} loading={loadingPortfolio} />
        </div>

        <CategoryReportPanel
          data={categoryData}
          type={categoryType}
          onTypeChange={setCategoryType}
          months={categoryMonths}
          onMonthsChange={setCategoryMonths}
          loading={loadingCategory}
        />

        <div>
          <div className="mb-3 flex flex-wrap justify-end gap-2">
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 shadow-sm">
              Compare
              <input
                type="month"
                value={toMonthInputValue(periodA.year, periodA.month)}
                onChange={(e) => setPeriodA(fromMonthInputValue(e.target.value))}
                className="bg-transparent font-medium text-slate-900 outline-none"
              />
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 shadow-sm">
              to
              <input
                type="month"
                value={toMonthInputValue(periodB.year, periodB.month)}
                onChange={(e) => setPeriodB(fromMonthInputValue(e.target.value))}
                className="bg-transparent font-medium text-slate-900 outline-none"
              />
            </label>
          </div>
          <ComparisonPanel
            data={comparisonData}
            labelA={`${monthLabel(periodA.month)} ${periodA.year}`}
            labelB={`${monthLabel(periodB.month)} ${periodB.year}`}
            loading={loadingComparison}
          />
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
