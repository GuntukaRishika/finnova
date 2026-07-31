import axios from 'axios'
import store from '../redux/store'
import { accessTokenRefreshed, loggedOut } from '../redux/authSlice'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
})

axiosClient.interceptors.request.use((config) => {
  const { accessToken } = store.getState().auth
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

let refreshPromise = null

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/')

    if (status !== 401 || isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error)
    }

    const { refreshToken } = store.getState().auth
    if (!refreshToken) {
      store.dispatch(loggedOut())
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      if (!refreshPromise) {
        refreshPromise = axiosClient
          .post('/auth/refresh', { refreshToken })
          .then((res) => res.data)
          .finally(() => {
            refreshPromise = null
          })
      }

      const data = await refreshPromise
      store.dispatch(accessTokenRefreshed(data))

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
      return axiosClient(originalRequest)
    } catch (refreshError) {
      store.dispatch(loggedOut())
      return Promise.reject(refreshError)
    }
  }
)

export default axiosClient
