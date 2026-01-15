import instance from "../utils/authorizedAxios";

const createComment = async (fullSlug, data) => {
    const URL_API = import.meta.env.VITE_BASE_API + `/post/posts/${fullSlug}/comment`;
    return instance.post(URL_API, data);
}

export const commentAPI = {
    createComment
}