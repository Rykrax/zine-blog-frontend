import instance from '../utils/authorizedAxios.jsx'

const getUser = (_id) => {
    const URL_API = `/users/${_id}`;
    return instance.get(URL_API);
}

const changePasswordApi = (data) => {
    const URL_API = `/users/me/password`;
    return instance.put(URL_API, data);
}

const updateProfileApi = (data) => {
    const URL_API = `/users/me`;
    return instance.patch(URL_API, data);
}

const savePostApi = async (postId) => {
    const URL_API = `/users/me/saved-posts`;
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