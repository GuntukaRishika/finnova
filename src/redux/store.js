import { configureStore } from '@reduxjs/toolkit'

export default configureStore({
  reducer: {
    auth: (state = { isAuthenticated: false, user: null }, action) => {
      switch (action.type) {
        case 'auth/login':
          return { ...state, isAuthenticated: true, user: action.payload }
        case 'auth/logout':
          return { ...state, isAuthenticated: false, user: null }
        default:
          return state
      }
    },
  },
})
