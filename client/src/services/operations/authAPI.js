import axios from "axios";
import {
  setLoading,
  setToken,
  setUser,
  logout,
  setAllUsers,
} from "../../slices/authSlice";
import { userEndPoints } from "../apis";
import toast from "react-hot-toast";
import { setCookies } from "../../utils/setCookie";

const { SIGNUP_API, LOGIN_API, GET_ALL_USERS_API } = userEndPoints;

export const signup = (data, navigate, reset) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(SIGNUP_API, data);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("User registered successfully.");
    setCookies(response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    dispatch(setUser(response.data.user));
    dispatch(setToken(response.data.token));

    reset();
    navigate("/dashboard");
  } catch (error) {
    toast.error(error.response.data.message);
  } finally {
    dispatch(setLoading(false));
  }
};

export const login = (data, navigate, reset) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(LOGIN_API, data);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("User logged in successfully.");
    setCookies(response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    dispatch(setUser(response.data.user));
    dispatch(setToken(response.data.token));

    reset();
    navigate("/dashboard");
  } catch (error) {
    toast.error(error.response.data.message);
  } finally {
    dispatch(setLoading(false));
  }
};

export const getAllUsers = (token) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(GET_ALL_USERS_API,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    dispatch(setAllUsers(response.data.users));
  } catch (error) {
    toast.error(error.response.data.message);
  } finally {
    dispatch(setLoading(false));
  }
};
