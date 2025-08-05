import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Vendor : []
}

const Vendor = createSlice({
    name: "Vendor",
    initialState,
    reducers: {
        fetchVendor: (state, action) => {
            console.log(action.payload)
            state.state = action.payload
        },
        
    },
 
})

export const { fetchVendor} = Vendor.actions
export default Vendor.reducer