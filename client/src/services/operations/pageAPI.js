

import axios from "axios";
import {pageEndPoints} from "../apis";
import { addInAllPages, setAllPages, setCurrentPage, setLoading, setPublishedPages } from "../../slices/pageSlice";
import toast from "react-hot-toast";

const {CREATE_PAGE_API,UPDATE_PAGE_API,DELETE_PAGE_API,GET_PAGE_API,GET_ALL_PAGES_API,}= pageEndPoints;





export const getAllPages = (data) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(GET_ALL_PAGES_API, { params: data });
        dispatch(setAllPages(response.data.data));
    } catch (error) {
        console.error("Error fetching pages:", error);
    } finally {
        dispatch(setLoading(false));
    }
};

export const getAllPublishedPages = (query) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(GET_ALL_PAGES_API,{ params: query });
        dispatch(setPublishedPages(response.data.data));
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        toast.error(error.response.data.message);
    }
};

export const getPageByIdOrSlug=(id)=> async (dispatch)=>{
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${GET_PAGE_API}/${id}`);
        dispatch(setCurrentPage(response.data.data))
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        toast.error(error.response.data.message);
    }
}

export const createPage = (pageData, navigate, token) => async (dispatch) => {
    try {
        const formData = new FormData();
        formData.append('title', pageData.title);
        formData.append('description', pageData.description);
        formData.append('content', pageData.content);
        formData.append('slug', pageData.slug);
        formData.append('showAuthor', pageData.showAuthor);

        pageData?.attachments.forEach((file, index) => {
            formData.append(`attachment_${index}`, file);
        });

        dispatch(setLoading(true));

        const response = await axios.post(CREATE_PAGE_API, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + token
            }
        });

        console.log(response);

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        dispatch(setCurrentPage(response.data.data));
        dispatch(addInAllPages(response.data.data));
        toast.success(response.data.message);
        dispatch(setLoading(false));
        navigate("/pages");
    } catch (error) {
        // console.log(error);
        dispatch(setLoading(false));
        toast.error(error.data.message);
    }
};


export const updatePage=(id,pageData,navigate, token)=> async (dispatch)=>{
    try {
        const formData = new FormData();
        formData.append('title', pageData.title);
        formData.append('description', pageData.description);
        formData.append('content', pageData.content);
        formData.append('slug', pageData.slug);
        formData.append('showAuthor', pageData.showAuthor);

        pageData?.attachments.forEach((file, index) => {
            formData.append(`attachment_${index}`, file);
        });

        dispatch(setLoading(true));

        const response = await axios.put(`${UPDATE_PAGE_API}/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + token
            },
        });

        console.log(response);

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        // dispatch(setCurrentPage(response.data.data));
        // dispatch(addInAllPages(response.data.data));
        toast.success(response.data.message);
        dispatch(setLoading(false));
        navigate("/pages");
    } catch (error) {
        // console.log(error);
        dispatch(setLoading(false));
        toast.error(error.data.message);
    }
}

export const deletePage=(id, token)=> async (dispatch)=>{
    console.log(token)
    try {
        dispatch(setLoading(true));
        const response = await axios.delete(`${DELETE_PAGE_API}/${id}`,{
            headers: {
                Authorization: `Bearer ${token}`,
              },
        });
        // dispatch(setCurrentPage(null))
        // dispatch((state) => {
        //     state.allPages = state.allPages.filter((page) => page._id!== id);
        // });
        toast.success(response.data.message);
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        toast.error(error.response.data.message);
    }
}