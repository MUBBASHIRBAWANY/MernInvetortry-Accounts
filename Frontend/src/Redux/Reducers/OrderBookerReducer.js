import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    OrderBooker : []
}

const OrderBooker = createSlice({
    name: "OrderBooker",
    initialState,
    reducers: {
        fetchOrderBooker: (state, action) => {
            console.log(action.payload)
            state.OrderBooker = action.payload
        },
        
    },
 
})

export const { fetchOrderBooker} = OrderBooker.actions
export default OrderBooker.reducer