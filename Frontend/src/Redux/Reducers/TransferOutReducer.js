import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    TransferOut : []
}

const TransferOut = createSlice({
    name: "TransferOut",
    initialState,
    reducers: {
        fetchTransferOut: (state, action) => {
            console.log(action.payload)
            state.TransferOut = action.payload
        },
        updateDateTransferOut  : (state, action) =>{
            const index = state.TransferOut.findIndex(post => post._id === action.payload.id);
            state.TransferOut[index].PostStatus = action.payload.status
            console.log(state.TransferOut)
        }
    },
 
})

export const { fetchTransferOut , updateDateTransferOut} = TransferOut.actions
export default TransferOut.reducer