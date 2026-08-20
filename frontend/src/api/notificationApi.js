import axiosClient from './axiosClient'

export function getNotifications({ page = 0, size = 10 } = {}) {
  return axiosClient.get('/notification', { params: { page, size } }).then((res) => res.data)
}

export function getBudgetNotifications({ page = 0, size = 10 } = {}) {
  return axiosClient.get('/notification/budget', { params: { page, size } }).then((res) => res.data)
}

export function getUnreadNotificationCount() {
  return axiosClient.get('/notification/unread-count').then((res) => res.data)
}

export function markNotificationAsRead(id) {
  return axiosClient.patch(`/notification/${id}/read`).then((res) => res.data)
}

export function markAllNotificationsAsRead() {
  return axiosClient.patch('/notification/read-all').then((res) => res.data)
}

export function markAllBudgetNotificationsAsRead() {
  return axiosClient.patch('/notification/budget/read-all').then((res) => res.data)
}

export function deleteAllBudgetNotifications() {
  return axiosClient.delete('/notification/budget').then((res) => res.data)
}
