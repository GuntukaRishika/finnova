import axiosClient from './axiosClient'

export function scanReceipt(file) {
  const formData = new FormData()
  formData.append('file', file)
  return axiosClient.post('/bills/scan', formData).then((res) => res.data)
}

export function getReceiptScans() {
  return axiosClient.get('/bills/scan').then((res) => res.data)
}

export function getReceiptScan(id) {
  return axiosClient.get(`/bills/scan/${id}`).then((res) => res.data)
}

export function saveExpenseFromScan(id, data) {
  return axiosClient.post(`/bills/scan/${id}/save-expense`, data).then((res) => res.data)
}
