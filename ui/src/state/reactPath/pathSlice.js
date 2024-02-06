import { createSlice } from "@reduxjs/toolkit"

export const pathSlice = createSlice({
    name: 'path',
    initialState: {
      value: 'App.jsx'
    },
    reducers: {
      setPath: (state, action) => {
        state.value = action.payload
      }
    }
  })
  
  // Action creators are generated for each case reducer function
  export const { setPath } = pathSlice.actions
  
  export default pathSlice.reducer