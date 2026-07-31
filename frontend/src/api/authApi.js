import axiosClient from './axiosClient'

export function register({ username, email, password }) {
  return axiosClient
    .post('/auth/register', { username, email, password })
    .then((res) => res.data)
}

export function login({ username, password }) {
  return axiosClient
    .post('/auth/login', { username, password })
    .then((res) => res.data)
}

export function refresh(refreshToken) {
  return axiosClient
    .post('/auth/refresh', { refreshToken })
    .then((res) => res.data)
}
