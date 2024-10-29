import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState:{
    list:[]
  },
  reducers: {
    setAppointment:(state,action)=>{
        state.list=action.payload
    }
  },
})
export const { setAppointment } = counterSlice.actions
export default counterSlice.reducer
