import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    SalesInvoiceReturn : []
}

const SalesInvoiceReturn = createSlice({
    name: "SalesInvoiceReturn",
    initialState,
    reducers: {
        fetchSalesInvoiceReturn: (state, action) => {
            console.log(action.payload)
            state.SalesInvoiceReturn = action.payload
        },
        updateDateSalesInvoiceReturn  : (state, action) =>{
            const index = state.SalesInvoiceReturn.findIndex(post => post._id === action.payload.id);
            state.SalesInvoiceReturn[index].PostStatus = action.payload.status
            console.log(state.SalesInvoiceReturn)
        }
    },
 
})

export const { fetchSalesInvoiceReturn , updateDateSalesInvoiceReturn} = SalesInvoiceReturn.actions
export default SalesInvoiceReturn.reducer