import instance from '../utils/authorizedAxios.jsx'

const getUser = () => {
    const URL_API = `/admin/users/`;
    return instance.get(URL_API);
}

const updateUserStatus = (_id, status) => {
    const URL_API = `/admin/users/${_id}/status`;
    return instance.patch(URL_API, { status });
}

const updateUserRole = (_id, role) => {
    const URL_API = `/admin/users/${_id}/role`;
    return instance.patch(URL_API, { role });
}

const updateUserProfile = (_id, data) => {
    const URL_API = `/admin/users/${_id}`;
    return instance.patch(URL_API, data);
}

const deleteUser = (_id) => {
    const URL_API = `/admin/users/${_id}`;
    return instance.delete(URL_API);
}

export const adminAPI = {
    getUser,
    deleteUser,
    updateUserStatus,
    updateUserProfile,
    updateUserRole
}