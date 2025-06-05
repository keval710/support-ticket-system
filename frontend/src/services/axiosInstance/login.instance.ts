import axios from "axios";
import envVar from "../../config/config";

const loginApiInterceptor = axios.create({
    baseURL: envVar.BASE_URL,
});

// Response interceptor
loginApiInterceptor.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized, logging out...');
        }
        return Promise.reject(error);
    }
);

export default loginApiInterceptor;