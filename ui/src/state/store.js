import { configureStore } from '@reduxjs/toolkit'
import pathReducer from './reactPath/pathSlice'
import codeReducer from './code/codeSlice'
export default configureStore({
  reducer: {     
path: pathReducer,
code: codeReducer
}
})