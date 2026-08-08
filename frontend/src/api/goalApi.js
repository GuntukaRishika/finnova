import axiosClient from './axiosClient'

export function addGoal(data) {
  return axiosClient.post('/goal', data).then((res) => res.data)
}

export function updateGoal(id, data) {
  return axiosClient.put(`/goal/${id}`, data).then((res) => res.data)
}

export function deleteGoal(id) {
  return axiosClient.delete(`/goal/${id}`).then((res) => res.data)
}

export function getGoals(status) {
  return axiosClient.get('/goal', { params: status ? { status } : {} }).then((res) => res.data)
}

export function contributeToGoal(id, amount) {
  return axiosClient.post(`/goal/${id}/contribute`, { amount }).then((res) => res.data)
}
