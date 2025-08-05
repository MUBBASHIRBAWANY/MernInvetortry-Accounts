import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    TotalProducts : []
}

const TotalProducts = createSlice({
    name: "TotalProducts",
    initialState,
    reducers: {
        fetchTotalProducts: (state, action) => {
            console.log(action.payload)
            state.TotalProducts = action.payload
        },
        
    },
 
})

export const { fetchTotalProducts} = TotalProducts.actions
export default TotalProducts.reducer