import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Openinginventory : []
}

const Openinginventory = createSlice({
    name: "Openinginventory",
    initialState,
    reducers: {
        fetchOpeninginventory: (state, action) => {
            console.log(action.payload)
            state.Openinginventory = action.payload
        },
        
    },
 
})

export const { fetchOpeninginventory} = Openinginventory.actions
export default Openinginventory.reducer