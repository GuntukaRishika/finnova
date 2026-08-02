import axiosClient from './axiosClient'

export function addBudget(data) {
  return axiosClient.post('/budget', data).then((res) => res.data)
}

export function updateBudget(id, data) {
  return axiosClient.put(`/budget/${id}`, data).then((res) => res.data)
}

export function deleteBudget(id) {
  return axiosClient.delete(`/budget/${id}`).then((res) => res.data)
}

export function getBudgets(year, month) {
  return axiosClient.get('/budget', { params: { year, month } }).then((res) => res.data)
}
