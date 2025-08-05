import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    product : []
}

const product = createSlice({
    name: "product",
    initialState,
    reducers: {
        fetchproduct: (state, action) => {
            console.log(action.payload)
            state.product = action.payload
        },
        
    },
 
})

export const { fetchproduct} = product.actions
export default product.reducer