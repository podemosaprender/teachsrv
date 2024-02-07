import { configureStore } from '@reduxjs/toolkit'
import pathReducer from './viewpaths/pathSlice'

export default configureStore({
	reducer: {     
		viewpaths: pathReducer
	}
})
