import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Store : []
}

const Store = createSlice({
    name: "Store",
    initialState,
    reducers: {
        fetchStore: (state, action) => {
            console.log(action.payload)
            state.Store = action.payload
        },
        
    },
 
})

export const { fetchStore} = Store.actions
export default Store.reducer