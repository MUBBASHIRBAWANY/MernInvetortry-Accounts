import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Terrotory : []
}

const Terrotory = createSlice({
    name: "Terrotory",
    initialState,
    reducers: {
        fetchTerrotory: (state, action) => {
            console.log(action.payload)
            state.Terrotory = action.payload
        },
        
    },
 
})

export const { fetchTerrotory} = Terrotory.actions
export default Terrotory.reducer