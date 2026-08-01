import axiosClient from './axiosClient'

export function addExpense(data) {
  return axiosClient.post('/expense', data).then((res) => res.data)
}

export function updateExpense(id, data) {
  return axiosClient.put(`/expense/${id}`, data).then((res) => res.data)
}

export function deleteExpense(id) {
  return axiosClient.delete(`/expense/${id}`).then((res) => res.data)
}

export function getExpense(id) {
  return axiosClient.get(`/expense/${id}`).then((res) => res.data)
}

export function getExpenses({ page = 0, size = 10 } = {}) {
  return axiosClient.get('/expense', { params: { page, size } }).then((res) => res.data)
}

export function getMonthlyExpense(year, month) {
  return axiosClient.get('/expense/monthly', { params: { year, month } }).then((res) => res.data)
}

export function searchExpense(keyword, { page = 0, size = 10 } = {}) {
  return axiosClient.get('/expense/search', { params: { keyword, page, size } }).then((res) => res.data)
}

export function filterExpense(filters, { page = 0, size = 10 } = {}) {
  return axiosClient
    .get('/expense/filter', { params: { ...filters, page, size } })
    .then((res) => res.data)
}
