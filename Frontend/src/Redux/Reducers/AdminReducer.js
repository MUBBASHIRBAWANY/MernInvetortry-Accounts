import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    AdminReducer : []
}

const AdminReducer = createSlice({
    name: "Channel",
    initialState,
    reducers: {
        fetchAdminReducer: (state, action) => {
            console.log(action.payload)
            state.AdminReducer = action.payload
        },
        
    },
 
})

export const { fetchAdminReducer} = AdminReducer.actions
export default AdminReducer.reducer