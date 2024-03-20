
import { createSlice } from "@reduxjs/toolkit"

const initialState ={
    loading:false,
    allPages:[],
    publishedPages:[],
    currentPage:null,
}

const pageSlice= createSlice({
    name: "page",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setAllPages: (state, action) => {
            state.allPages = action.payload
        },
        addInAllPages: (state, action) => {
            state.allPages = [...state.allPages, action.payload]
        },
        setPublishedPages: (state, action) => {
            state.publishedPages = action.payload
        },
        addInPublishedPages: (state, action) => {
            state.publishedPages = [...state.publishedPages, action.payload]
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload
        },
    },
})

export const {setLoading, setAllPages, setPublishedPages, setCurrentPage,addInAllPages,addInPublishedPages}= pageSlice.actions;

export default pageSlice.reducer;