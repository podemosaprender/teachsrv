import { createSlice } from "@reduxjs/toolkit"

export const viewPathsSelector = (state) => state.viewpaths.value;

export const pathSlice = createSlice({
	name: 'viewPaths',
	initialState: { value: [] },
	reducers: {
		setViewPaths: (state, action) => {
			state.value = action.payload
		},
		viewPathAdd: (state, action) => { //U: add ONE path
			if (state.value.indexOf(action.payload)<0) { //A: not already there
				state.value = [ ... state.value, action.payload ];
			}
		},
		viewPathRemove: (state, action) => { //U: remove ONE path
			state.value= state.value.filter( p => (p!=action.payload) );
		},
	}
})

export const { setViewPaths, viewPathAdd, viewPathRemove } = pathSlice.actions
export default pathSlice.reducer
