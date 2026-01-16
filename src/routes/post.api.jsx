import instance from "../utils/authorizedAxios";

const createPost = async (data) => {
    const URL_API = `/posts`;
    return instance.post(URL_API, data);
}

const getAllPost = async (params = {}) => {
    const URL_API = `/posts`;
    return instance.get(URL_API, { params });
}

const getPosts = async (user_id) => {
    const URL_API = `/posts/${user_id}`;
    return instance.get(URL_API);
}

const getPostDetail = async (fullSlug) => {
    const URL_API = `/posts/${fullSlug}`;
    return instance.get(URL_API);
}

const getCommentByPost = async (fullSlug, params = {}) => {
    const URL_API = `/posts/${fullSlug}/comment`;
    return instance.get(URL_API, { params });
}


export const postAPI = {
    createPost,
    getAllPost,
    getPosts,
    getPostDetail,
    getCommentByPost
}