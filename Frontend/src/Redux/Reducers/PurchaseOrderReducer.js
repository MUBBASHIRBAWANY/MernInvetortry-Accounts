import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    PurchaseOrder : []
}

const PurchaseOrder = createSlice({
    name: "PurchaseOrder",
    initialState,
    reducers: {
        fetchPurchaseOrder: (state, action) => {
            console.log(action.payload)
            state.PurchaseOrder = action.payload
        },
        
    },
 
})

export const { fetchPurchaseOrder} = PurchaseOrder.actions
export default PurchaseOrder.reducer