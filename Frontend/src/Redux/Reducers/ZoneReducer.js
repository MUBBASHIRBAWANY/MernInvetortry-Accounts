import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    zone : []
}

const Zone = createSlice({
    name: "Zone",
    initialState,
    reducers: {
        fetchZone: (state, action) => {
            console.log(action.payload)
            state.zone = action.payload
        },
        
    },
 
})

export const { fetchZone} = Zone.actions
export default Zone.reducer