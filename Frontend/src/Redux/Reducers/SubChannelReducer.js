import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    subChannel : []
}

const subChannel = createSlice({
    name: "subChannel",
    initialState,
    reducers: {
        fetchsubChannel: (state, action) => {
            console.log(action.payload)
            state.subChannel = action.payload
        },
        
    },
 
})

export const { fetchsubChannel} = subChannel.actions
export default subChannel.reducer