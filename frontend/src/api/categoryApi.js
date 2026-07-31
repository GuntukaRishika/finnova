import axiosClient from './axiosClient'

export function getCategories() {
  return axiosClient.get('/categories').then((res) => res.data)
}
