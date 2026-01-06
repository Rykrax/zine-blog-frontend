import axios from "axios";

const axiosAuth = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});

export default axiosAuth;