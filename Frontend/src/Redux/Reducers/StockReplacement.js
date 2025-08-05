import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    StockReplacement: []
}

const StockReplacement = createSlice({
    name: "StockReplacement",
    initialState,
    reducers: {
        fetchStockReplacement: (state, action) => {
            state.StockReplacement = action.payload
        },
         updateStockReplacementStatus: (state, action) => {
            const { id, status } = action.payload;  // Destructure properly
            const index = state.StockReplacement.findIndex(
                item => item._id === id
            );
            console.log(index)
             state.StockReplacement[index] = { 
                    ...state.StockReplacement[index], 
                    PostStatus: status 
            
            }
            console.log(state.StockReplacement)
        }
    },
});

export const { fetchStockReplacement, updateStockReplacementStatus } = StockReplacement.actions;

export default StockReplacement.reducer