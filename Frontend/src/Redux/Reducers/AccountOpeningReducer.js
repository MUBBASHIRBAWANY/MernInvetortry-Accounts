import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    AccountOpeningReducer : []
}

const AccountOpeningReducer = createSlice({
    name: "Channel",
    initialState,
    reducers: {
        fetchAccountOpeningReducer: (state, action) => {
            console.log(action.payload)
            state.AccountOpeningReducer = action.payload
        },
        
    },
 
})

export const { fetchAccountOpeningReducer} = AccountOpeningReducer.actions
export default AccountOpeningReducer.reducer