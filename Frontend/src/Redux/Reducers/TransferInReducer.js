import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    TransferIn : []
}

const TransferIn = createSlice({
    name: "TransferIn",
    initialState,
    reducers: {
        fetchTransferIn: (state, action) => {
            console.log(action.payload)
            state.TransferIn = action.payload
        },
        updateDateTransferIn  : (state, action) =>{
            const index = state.TransferIn.findIndex(post => post._id === action.payload.id);
            state.TransferIn[index].PostStatus = action.payload.status
            console.log(state.TransferIn)
        }
    },
 
})

export const { fetchTransferIn , updateDateTransferIn} = TransferIn.actions
export default TransferIn.reducer