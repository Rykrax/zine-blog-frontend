import instance from "../utils/authorizedAxios";

const createPost = async (data) => {
    const URL_API = import.meta.env.VITE_BASE_API + `/post/posts`;
    return instance.post(URL_API, data);
}

const getPosts = async (user_id) => {
    const URL_API = import.meta.env.VITE_BASE_API + `/post/posts/${user_id}`;
    return instance.get(URL_API);
}

export const postAPI = {
    createPost,
    getPosts,
}