import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'finnova_auth'

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function persistState(state) {
  if (state.accessToken) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      })
    )
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

const persisted = loadPersistedState()

const initialState = {
  isAuthenticated: Boolean(persisted?.accessToken),
  user: persisted?.user ?? null,
  accessToken: persisted?.accessToken ?? null,
  refreshToken: persisted?.refreshToken ?? null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    credentialsSet(state, action) {
      const { user, accessToken, refreshToken } = action.payload
      state.isAuthenticated = true
      state.user = user
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      persistState(state)
    },
    accessTokenRefreshed(state, action) {
      state.accessToken = action.payload.accessToken
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken
      }
      persistState(state)
    },
    loggedOut(state) {
      state.isAuthenticated = false
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      persistState(state)
    },
  },
})

export const { credentialsSet, accessTokenRefreshed, loggedOut } = authSlice.actions
export default authSlice.reducer
