import instance from '../utils/authorizedAxios.jsx'
import axiosPublic from '../utils/axiosAuth.jsx'


const registerApi = (username, email, password) => {
    const URL_API = import.meta.env.VITE_BASE_API + `/auth/register`;
    const data = {
        username,
        email,
        password
    }

    return axiosPublic.post(URL_API, data);
}

const loginApi = (email, password) => {
    const URL_API = import.meta.env.VITE_BASE_API + `/auth/login`;
    const data = {
        email,
        password,
    };

    return axiosPublic.post(URL_API, data);
}

const logoutApi = () => {
    const URL_API = import.meta.env.VITE_BASE_API + `/auth/logout`;
    return instance.delete(URL_API);
}

// const userApi = () => {
//     const URL_API = import.meta.env.VITE_BASE_API + `/auth/access`;
//     return instance.get(URL_API);
// }

const userApi = () => {
    const URL_API = import.meta.env.VITE_BASE_API + `/user/me`;
    return instance.get(URL_API);
}

const refreshTokenApi = () => {
    const URL_API = import.meta.env.VITE_BASE_API + `/auth/refresh-token`;
    return axiosPublic.put(URL_API);
}

const getCloudinarySignApi = () => {
    const URL_API = import.meta.env.VITE_BASE_API + `/auth/cloudinary-sign`;
    return instance.get(URL_API);
}

export {
    registerApi,
    loginApi,
    logoutApi,
    userApi,
    refreshTokenApi,
    getCloudinarySignApi
}