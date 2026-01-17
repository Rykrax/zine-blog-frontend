import instance from "../utils/authorizedAxios";

const createComment = async (fullSlug, data) => {
    const URL_API = `/posts/${fullSlug}/comments`;
    return instance.post(URL_API, data);
}

export const commentAPI = {
    createComment
}