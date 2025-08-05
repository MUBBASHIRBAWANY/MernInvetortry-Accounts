import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    City : []
}

const City = createSlice({
    name: "City",
    initialState,
    reducers: {
        fetchCity: (state, action) => {
            console.log(action.payload)
            state.City = action.payload
        },
        
    },
 
})

export const { fetchCity} = City.actions
export default City.reducer