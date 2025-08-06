import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    SaleOrder : []
}

const SaleOrder = createSlice({
    name: "SaleOrder",
    initialState,
    reducers: {
        fetchSaleOrder: (state, action) => {
            console.log(action.payload)
            state.SaleOrder = action.payload
        },
        
    },
 
})

export const { fetchSaleOrder} = SaleOrder.actions
export default SaleOrder.reducer