import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Region : []
}

const Region = createSlice({
    name: "Region",
    initialState,
    reducers: {
        fetchRegion: (state, action) => {
            console.log(action.payload)
            state.Region = action.payload
        },
        
    },
 
})

export const { fetchRegion} = Region.actions
export default Region.reducer