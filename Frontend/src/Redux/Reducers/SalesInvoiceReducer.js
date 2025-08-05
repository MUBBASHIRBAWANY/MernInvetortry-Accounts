import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    SalesInvoice : []
}

const SalesInvoice = createSlice({
    name: "SalesInvoice",
    initialState,
    reducers: {
        fetchSalesInvoice: (state, action) => {
            console.log(action.payload)
            state.SalesInvoice = action.payload
        },
        updateDateSalesInvoice  : (state, action) =>{
            const index = state.SalesInvoice.findIndex(post => post._id === action.payload.id);
            state.SalesInvoice[index].PostStatus = action.payload.status
            console.log(state.SalesInvoice)
        }
    },
 
})

export const { fetchSalesInvoice , updateDateSalesInvoice} = SalesInvoice.actions
export default SalesInvoice.reducer