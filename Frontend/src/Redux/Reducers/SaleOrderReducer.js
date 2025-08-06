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
            updateDateSaleOrder  : (state, action) =>{
            const index = state.SaleOrder.findIndex(post => post._id === action.payload.id);
            state.SaleOrder[index].Status = action.payload.status
            console.log(state.SaleOrder)
        }
    },
 
})

export const { fetchSaleOrder , updateDateSaleOrder} = SaleOrder.actions
export default SaleOrder.reducer