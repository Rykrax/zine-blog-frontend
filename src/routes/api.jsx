import instance from '../utils/authorizedAxios.jsx'

const registerApi = (username, email, password) => {
    const URL_API = `/api/v1/register`;
    const data = {
        username,
        email,
        password
    }

    return instance.post(URL_API, data);
}

const loginApi = (email, password) => {
    const URL_API = `/api/v1/login`;
    const data = {
        email,
        password,
    };

    return instance.post(URL_API, data);
}

const logoutApi = () => {
    const URL_API = `/api/v1/logout`;
    return instance.delete(URL_API);
}

const userApi = () => {
    const URL_API = `/api/v1/access`
    return instance.get(URL_API);
}

const refreshTokenApi = () => {
    const URL_API = `/api/v1/refresh-token`
    return instance.put(URL_API);
}

export {
    registerApi,
    loginApi,
    logoutApi,
    userApi,
    refreshTokenApi
}