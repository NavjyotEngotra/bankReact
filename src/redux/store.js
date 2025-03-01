import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import clientReducer from './slices/clientSlice'
import dailyInterestReducer from './slices/dailyInterestSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    client: clientReducer,
    dailyInterest: dailyInterestReducer
  },
})