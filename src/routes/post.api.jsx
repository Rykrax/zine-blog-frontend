import instance from "../utils/authorizedAxios";

const createPost = async (data) => {
    const URL_API = `/posts`;
    return instance.post(URL_API, data);
}

const getPosts = async (params = {}) => {
    const URL_API = `/posts`;
    return instance.get(URL_API, { params });
}

const updatePosts = async (fullSlug, data) => {
    const URL_API = `/posts/${fullSlug}`;
    return instance.patch(URL_API, data);
}

const deletePosts = async (fullSlug) => {
    const URL_API = `/posts/${fullSlug}`;
    return instance.delete(URL_API);
}

const getPostDetail = async (fullSlug) => {
    const URL_API = `/posts/${fullSlug}`;
    return instance.get(URL_API);
}

const createComment = async (fullSlug, data) => {
    const URL_API = `/posts/${fullSlug}/comments`;
    return instance.post(URL_API, data);
}

const getCommentByPost = async (fullSlug, params = {}) => {
    const URL_API = `/posts/${fullSlug}/comments`;
    return instance.get(URL_API, { params });
}


export const postAPI = {
    createPost,
    getPosts,
    updatePosts,
    deletePosts,
    getPostDetail,
    createComment,
    getCommentByPost
}