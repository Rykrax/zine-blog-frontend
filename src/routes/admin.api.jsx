import instance from '../utils/authorizedAxios.jsx'

const getUser = () => {
    const URL_API = import.meta.env.VITE_BASE_API + `/admin/users/`;
    return instance.get(URL_API);
}

const deleteUser = (_id) => {
    const URL_API = import.meta.env.VITE_BASE_API + `/admin/users/${_id}`;
    return instance.put(URL_API);
}

export const adminAPI = {
    getUser,
    deleteUser
}