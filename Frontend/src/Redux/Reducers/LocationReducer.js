import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Location : []
}

const Location = createSlice({
    name: "Location",
    initialState,
    reducers: {
        fetchLocation: (state, action) => {
            console.log(action.payload)
            state.Location = action.payload
        },
        
    },
 
})

export const { fetchLocation} = Location.actions
export default Location.reducer