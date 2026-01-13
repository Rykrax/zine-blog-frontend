import instance from '../utils/authorizedAxios.jsx'

const getUser = (_id) => {
    const URL_API = import.meta.env.VITE_BASE_API + `/user/users/${_id}`;
    return instance.get(URL_API);
}

const changePasswordApi = (oldPassword, newPassword) => {
    const URL_API = import.meta.env.VITE_BASE_API + `/user/change-password`;
    const data = {
        oldPassword,
        newPassword
    }
    return instance.put(URL_API, data);
}

const updateProfileApi = (data) => {
    const URL_API = import.meta.env.VITE_BASE_API + `/user/update-profile`;
    return instance.put(URL_API, data);
}

const savePostApi = async (postId) => {
    const URL_API = import.meta.env.VITE_BASE_API + `/user/save-post/`;
    const data = {
        postId
    }
    return instance.post(URL_API, data);
}

export const userAPI = {
    getUser,
    changePasswordApi,
    updateProfileApi,
    savePostApi
}