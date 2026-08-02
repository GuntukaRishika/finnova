import axiosClient from './axiosClient'

export function getMonthlySummary(year, month) {
  return axiosClient.get('/dashboard/monthly-summary', { params: { year, month } }).then((res) => res.data)
}

export function getYearlySummary(year) {
  return axiosClient.get('/dashboard/yearly-summary', { params: { year } }).then((res) => res.data)
}

export function getCategorySummary(year, month, type = 'EXPENSE') {
  return axiosClient.get('/dashboard/category-summary', { params: { year, month, type } }).then((res) => res.data)
}

export function getCashFlow(year, month) {
  return axiosClient.get('/dashboard/cash-flow', { params: { year, month } }).then((res) => res.data)
}
