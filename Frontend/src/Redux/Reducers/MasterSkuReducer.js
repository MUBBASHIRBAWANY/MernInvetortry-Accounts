import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    MasterSku : []
}

const MasterSku = createSlice({
    name: "MasterSku",
    initialState,
    reducers: {
        fetchMasterSku: (state, action) => {
            console.log(action.payload)
            state.MasterSku = action.payload
        },
        
    },
 
})

export const { fetchMasterSku} = MasterSku.actions
export default MasterSku.reducer