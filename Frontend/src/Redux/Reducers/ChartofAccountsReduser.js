import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    ChartofAccounts : []
}

const ChartofAccounts = createSlice({
    name: "Channel",
    initialState,
    reducers: {
        fetchChartofAccounts: (state, action) => {
            console.log(action.payload)
            state.ChartofAccounts = action.payload
        },
        
    },
 
})

export const { fetchChartofAccounts} = ChartofAccounts.actions
export default ChartofAccounts.reducer