import axios from "axios";
import {pageEndPoints} from "../apis";
import toast from "react-hot-toast";
import { setLoading } from "../../slices/pageSlice";

const {SCHEDULE_PUBLISH_API,UPDATE_PUBLISH_API,CANCEL_PUBLISH_API}=pageEndPoints;

export const schedulePublishPage=(id,data,token)=> async(dispatch)=>{
    try {
        console.log("Api called",id,data,token);
        dispatch(setLoading(true));
        const response = await axios.post(`${SCHEDULE_PUBLISH_API}/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success(response.data.message);
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        toast.error(error.response.data.message);
    }
}

export const updatePublishPage=(id,data,token)=> async(dispatch)=>{
    try {
        dispatch(setLoading(true));
        const response = await axios.put(`${UPDATE_PUBLISH_API}/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success(response.data.message);
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        toast.error(error.response.data.message);
    }
}

export const cancelPublishPage=(id,token)=> async(dispatch)=>{
    try {
        dispatch(setLoading(true));
        const response = await axios.delete(`${CANCEL_PUBLISH_API}/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success(response.data.message);
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        toast.error(error.response.data.message);
    }
}