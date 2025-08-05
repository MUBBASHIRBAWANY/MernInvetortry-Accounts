import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    ClientOpeningReducer : []
}

const ClientOpeningReducer = createSlice({
    name: "Channel",
    initialState,
    reducers: {
        fetchClientOpeningReducer: (state, action) => {
            console.log(action.payload)
            state.ClientOpeningReducer = action.payload
        },
        
    },
 
})

export const { fetchClientOpeningReducer} = ClientOpeningReducer.actions
export default ClientOpeningReducer.reducer