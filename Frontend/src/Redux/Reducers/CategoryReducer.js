import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    category : []
}

const Category = createSlice({
    name: "Vendor",
    initialState,
    reducers: {
        fetchCategory: (state, action) => {
            console.log(action.payload)
            state.category = action.payload
        },
        
    },
 
})

export const { fetchCategory} = Category.actions
export default Category.reducer