import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './user'
import groupReducer from './group'

export default configureStore({
  reducer: {
    user: userReducer,
    group: groupReducer
  },
});
