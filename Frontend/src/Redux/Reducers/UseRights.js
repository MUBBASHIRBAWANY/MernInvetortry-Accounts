import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    UserRights : []
}

const UsersRights = createSlice({
    name: "UsersRights",
    initialState,
    reducers: {
        fetchUserRights: (state, action) => {
            console.log(action.payload)
            state.UserRights = action.payload
        },
        
    },
 
})

export const { fetchUserRights} = UsersRights.actions
export default UsersRights.reducer