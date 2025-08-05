import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    PurchaseReturn : []
}

const PurchaseReturn = createSlice({
    name: "PurchaseReturn",
    initialState,
    reducers: {
        fetchPurchaseReturn: (state, action) => {
            console.log(action.payload)
            state.PurchaseReturn = action.payload
        },
        updateDatePurchaseReturn  : (state, action) =>{
            const index = state.PurchaseReturn.findIndex(post => post._id === action.payload.id);
            state.PurchaseReturn[index].PostStatus = action.payload.status
            console.log(state.PurchaseReturn)
        }
    },
 
})

export const { fetchPurchaseReturn , updateDatePurchaseReturn} = PurchaseReturn.actions
export default PurchaseReturn.reducer