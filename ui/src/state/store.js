import { configureStore } from '@reduxjs/toolkit'
import pathReducer from './reactPath/pathSlice'

export default configureStore({
  reducer: {     
path: pathReducer
}
})