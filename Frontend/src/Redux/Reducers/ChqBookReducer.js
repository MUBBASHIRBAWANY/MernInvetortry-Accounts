import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    ChqBook : []
}

const ChqBook = createSlice({
    name: "Channel",
    initialState,
    reducers: {
        fetchChqBook: (state, action) => {
            console.log(action.payload)
            state.ChqBook = action.payload
        },
        
    },
 
})

export const { fetchChqBook} = ChqBook.actions
export default ChqBook.reducer