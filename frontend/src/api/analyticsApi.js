import axiosClient from './axiosClient'

export function getMonthlyGrowth({ year, month, months = 6 } = {}) {
  return axiosClient.get('/analytics/monthly-growth', { params: { year, month, months } }).then((res) => res.data)
}

export function getPredictions({ year, month, historyMonths = 6, forecastMonths = 3 } = {}) {
  return axiosClient.get('/analytics/predictions', { params: { year, month, historyMonths, forecastMonths } }).then((res) => res.data)
}

export function getCategoryReport({ year, month, months = 6, type = 'EXPENSE' } = {}) {
  return axiosClient.get('/analytics/category-report', { params: { year, month, months, type } }).then((res) => res.data)
}

export function getPortfolioAnalysis() {
  return axiosClient.get('/analytics/portfolio-analysis').then((res) => res.data)
}

export function getSpendingHeatmap(year, month) {
  return axiosClient.get('/analytics/spending-heatmap', { params: { year, month } }).then((res) => res.data)
}

export function getComparison({ yearA, monthA, yearB, monthB }) {
  return axiosClient.get('/analytics/comparison', { params: { yearA, monthA, yearB, monthB } }).then((res) => res.data)
}
