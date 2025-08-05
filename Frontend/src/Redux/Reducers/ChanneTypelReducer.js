import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    channelType : []
}

const ChannelType = createSlice({
    name: "Channel",
    initialState,
    reducers: {
        fetchChannelType: (state, action) => {
            console.log(action.payload)
            state.channelType = action.payload
        },
        
    },
 
})

export const { fetchChannelType} = ChannelType.actions
export default ChannelType.reducer