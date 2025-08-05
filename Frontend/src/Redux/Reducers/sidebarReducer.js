import { createSlice } from "@reduxjs/toolkit"



export const sidebarReducer = createSlice({
    name: "sidebar",
    initialState : {
        state : false
    },
    reducers: {
        toggle: (state) => {
            state.state = false
        },
        open: (state) => {
            state.state = true
        }
    }
})

export const { toggle, open } = sidebarReducer.actions

export default sidebarReducer.reducer;