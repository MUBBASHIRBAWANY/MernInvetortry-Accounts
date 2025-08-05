import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    client : []
}

const Client = createSlice({
    name: "client",
    initialState,
    reducers: {
        fetchClient: (state, action) => {
            console.log(action.payload)
            state.client = action.payload
        },
        
    },
 
})

export const { fetchClient} = Client.actions
export default Client.reducer