import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    OrderDc : []
}

const OrderDc = createSlice({
    name: "OrderDc",
    initialState,
    reducers: {
        fetchOrderDc: (state, action) => {
            console.log(action.payload)
            state.OrderDc = action.payload
        },
            updateDateOrderDc  : (state, action) =>{
            const index = state.OrderDc.findIndex(post => post._id === action.payload.id);
            state.OrderDc[index].Status = action.payload.status
            console.log(state.OrderDc)
        }
    },
 
})

export const { fetchOrderDc , updateDateOrderDc} = OrderDc.actions
export default OrderDc.reducer