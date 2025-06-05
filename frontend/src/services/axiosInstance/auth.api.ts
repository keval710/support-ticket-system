import axios from "axios";
import envVar from "../../config/config";

const AuthService = axios.create({
    baseURL: envVar.BASE_URL,
});

// Response interceptor
AuthService.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized, logging out...');
        }
        return Promise.reject(error);
    }
);

export default AuthService;