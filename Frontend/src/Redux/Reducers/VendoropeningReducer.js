import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    VendorOpeningReducer : []
}

const VendorOpeningReducer = createSlice({
    name: "Channel",
    initialState,
    reducers: {
        fetchVendorOpeningReducer: (state, action) => {
            console.log(action.payload)
            state.VendorOpeningReducer = action.payload
        },
        
    },
 
})

export const { fetchVendorOpeningReducer} = VendorOpeningReducer.actions
export default VendorOpeningReducer.reducer