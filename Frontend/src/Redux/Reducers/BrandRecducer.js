import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    brand : []
}

const Brand = createSlice({
    name: "Brand",
    initialState,
    reducers: {
        fetchbrand: (state, action) => {
            console.log(action.payload)
            state.brand = action.payload
        },
        
    },
 
})

export const { fetchbrand} = Brand.actions
export default Brand.reducer