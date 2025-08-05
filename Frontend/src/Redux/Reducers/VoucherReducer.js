import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Voucher : []
}

const Voucher = createSlice({
    name: "Voucher",
    initialState,
    reducers: {
        fetchVoucher: (state, action) => {
            console.log(action.payload)
            state.Voucher = action.payload
        },
        
    },
 
})

export const { fetchVoucher} = Voucher.actions
export default Voucher.reducer