import axios from 'axios';
import envVar from '../../config/config';
import { toast } from 'react-hot-toast';

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
    (error) => {
        toast.error('Request failed. Please try again.');
        return Promise.reject(error);
    }
);

// Response interceptor
authApiInterceptor.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const errorMessage = error.response.data?.message || 'An error occurred';
            toast.error(errorMessage);
            if (error.response.status === 401) {
                toast.error('Unauthorized');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        } else {
            toast.error('Network error. Please check your connection.');
        }
        return Promise.reject(error);
    }
);

export default authApiInterceptor;