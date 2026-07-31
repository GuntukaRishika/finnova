import axiosClient from './axiosClient'

export function addIncome(data) {
  return axiosClient.post('/income', data).then((res) => res.data)
}

export function updateIncome(id, data) {
  return axiosClient.put(`/income/${id}`, data).then((res) => res.data)
}

export function deleteIncome(id) {
  return axiosClient.delete(`/income/${id}`).then((res) => res.data)
}

export function getIncome(id) {
  return axiosClient.get(`/income/${id}`).then((res) => res.data)
}

export function getIncomes({ page = 0, size = 10 } = {}) {
  return axiosClient.get('/income', { params: { page, size } }).then((res) => res.data)
}

export function getMonthlyIncome(year, month) {
  return axiosClient.get('/income/monthly', { params: { year, month } }).then((res) => res.data)
}

export function searchIncome(keyword, { page = 0, size = 10 } = {}) {
  return axiosClient.get('/income/search', { params: { keyword, page, size } }).then((res) => res.data)
}

export function filterIncome(filters, { page = 0, size = 10 } = {}) {
  return axiosClient
    .get('/income/filter', { params: { ...filters, page, size } })
    .then((res) => res.data)
}
