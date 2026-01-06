import axios from "axios";

const axiosPublic = axios.create({
    withCredentials: false,
    timeout: 1000 * 60
});

export default axiosPublic;
