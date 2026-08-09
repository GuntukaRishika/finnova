import axiosClient from './axiosClient'

export function getBills({ month, year } = {}) {
  return axiosClient
    .get('/bills', { params: { month, year } })
    .then((res) => res.data)
}

export function addBill(data) {
  return axiosClient.post('/bills', data).then((res) => res.data)
}

export function updateBill(id, data) {
  return axiosClient.put(`/bills/${id}`, data).then((res) => res.data)
}

export function deleteBill(id) {
  return axiosClient.delete(`/bills/${id}`).then((res) => res.data)
}

export function markBillPaid(id) {
  return axiosClient.patch(`/bills/${id}/paid`).then((res) => res.data)
}
