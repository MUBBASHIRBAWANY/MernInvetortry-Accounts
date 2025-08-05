import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    channel : []
}

const Channel = createSlice({
    name: "Channel",
    initialState,
    reducers: {
        fetchChannel: (state, action) => {
            console.log(action.payload)
            state.channel = action.payload
        },
        
    },
 
})

export const { fetchChannel} = Channel.actions
export default Channel.reducer