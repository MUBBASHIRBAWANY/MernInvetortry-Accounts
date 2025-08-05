import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    PurchaseInvoice : []
}

const PurchaseInvoice = createSlice({
    name: "PurchaseInvoice",
    initialState,
    reducers: {
        fetchPurchaseInvoice: (state, action) => {
            console.log(action.payload)
            state.PurchaseInvoice = action.payload
        },
        updateDatePurchaseInvoice  : (state, action) =>{
            const index = state.PurchaseInvoice.findIndex(post => post._id === action.payload.id);
            state.PurchaseInvoice[index].PostStatus = action.payload.status
            console.log(state.PurchaseInvoice)
        }
    },
 
})

export const { fetchPurchaseInvoice , updateDatePurchaseInvoice} = PurchaseInvoice.actions
export default PurchaseInvoice.reducer