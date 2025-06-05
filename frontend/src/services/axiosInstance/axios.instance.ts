import axios from 'axios';
import envVar from '../../config/config';

const authApiInterceptor = axios.create({
    baseURL: envVar.BASE_URL,
});

// Request interceptor
authApiInterceptor.interceptors.request.use(
    (config) => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const token = JSON.parse(storedUser)?.token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
authApiInterceptor.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized, logging out...');
        }
        return Promise.reject(error);
    }
);

export default authApiInterceptor;