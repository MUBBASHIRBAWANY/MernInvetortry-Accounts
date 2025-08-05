import { createSlice } from "@reduxjs/toolkit";

const initialState  =  {
    state : false,
    userDetail : []
}

const LoginerReducer = createSlice({
    name: "Loginer",
    initialState,
    reducers: {
        Admin: (state, action) => {
            state.state = "Admin"
            state.userDetail = action.payload
        },
       user: (state , action) => {
            state.state = "Rec"
            state.userDetail = action.payload
        },
       Logout: (state) => {
            state.state = false
        }
    }
})

export const { Admin, user ,Logout } = LoginerReducer.actions

export default LoginerReducer.reducer;