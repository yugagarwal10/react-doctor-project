import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState:{
    list:[]
  },
  reducers: {
    setAppointment:(state,action)=>{
        state.value=action.payload
    }
  },
})
export const { setAppointment } = counterSlice.actions
export default counterSlice.reducer