import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users : []
}

const users = createSlice({
    name: "users",
    initialState,
    reducers: {
        fetchUsers: (state, action) => {
            console.log(action.payload)
            state.state = action.payload
        },
        deleteUser: (state, action) =>{
            state.state = state.state.filter((users) => users._id!== action.payload)
        }
    },
 
})

export const { fetchUsers, deleteUser } = users.actions
export default users.reducer