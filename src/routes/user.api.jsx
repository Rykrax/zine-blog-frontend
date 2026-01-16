import instance from '../utils/authorizedAxios.jsx'

const getUser = (_id) => {
    const URL_API = `/users/${_id}`;
    return instance.get(URL_API);
}

const changePasswordApi = (oldPassword, newPassword) => {
    const URL_API = `/users/change-password`;
    const data = {
        oldPassword,
        newPassword
    }
    return instance.put(URL_API, data);
}

const updateProfileApi = (data) => {
    const URL_API = `/users/update-profile`;
    return instance.put(URL_API, data);
}

const savePostApi = async (postId) => {
    const URL_API = `/users/save-post/`;
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