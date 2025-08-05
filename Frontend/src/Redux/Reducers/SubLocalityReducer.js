import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    SubSubCity : []
}

const SubCity = createSlice({
    name: "SubCity",
    initialState,
    reducers: {
        fetchSubCity: (state, action) => {
            console.log(action.payload)
            state.SubCity = action.payload
        },
        
    },
 
})

export const { fetchSubCity} = SubCity.actions
export default SubCity.reducer