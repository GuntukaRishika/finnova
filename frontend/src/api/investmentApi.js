import axiosClient from './axiosClient'

export function getInvestments({ page = 0, size = 10 } = {}) {
  return axiosClient.get('/investments', { params: { page, size } }).then((res) => res.data)
}

export function addInvestment(data) {
  return axiosClient.post('/investments', data).then((res) => res.data)
}

export function updateInvestment(id, data) {
  return axiosClient.put(`/investments/${id}`, data).then((res) => res.data)
}

export function deleteInvestment(id) {
  return axiosClient.delete(`/investments/${id}`).then((res) => res.data)
}
