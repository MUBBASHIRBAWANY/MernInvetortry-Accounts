import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    OpeningInvoices : []
}

const OpeningInvoices = createSlice({
    name: "OpeningInvoices",
    initialState,
    reducers: {
        fetchOpeningInvoices: (state, action) => {
            console.log(action.payload)
            state.OpeningInvoices = action.payload
        },
        
    },
 
})

export const { fetchOpeningInvoices} = OpeningInvoices.actions
export default OpeningInvoices.reducer