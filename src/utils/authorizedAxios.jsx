import { message } from "antd";
import axios from "axios";
import { logoutApi, refreshTokenApi } from "../routes/api";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});

instance.defaults.timeout = 1000 * 60 * 10;

// Add a request interceptor
instance.interceptors.request.use((config) => {
    // Do something before request is sent
    return config;
}, (error) => {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use((response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response?.data ? response.data : response;
}, async (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response?.status === 401) {
        await logoutApi();
        location.href = '/login';
    }

    const originalRequest = error.config;
    // console.log(originalRequest);
    if (error.response?.status === 410 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            await refreshTokenApi();
            return instance(originalRequest);
        } catch (error) {
            await logoutApi();
            location.href = '/login';
            // return Promise.reject(err);
        }
    }
    return Promise.reject(error);
});

export default instance;