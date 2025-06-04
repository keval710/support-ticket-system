import axios from "axios";

const AuthService = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
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