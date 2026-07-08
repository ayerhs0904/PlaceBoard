import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    timeout: 30000,
});

api.interceptors.request.use((config) => {
    window.dispatchEvent(new Event('api_request_start'));
    const token = localStorage.getItem('token');
    if (token && !config.url.includes('/auth/')) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    window.dispatchEvent(new Event('api_request_end'));
    return Promise.reject(error);
});

api.interceptors.response.use((response) => {
    window.dispatchEvent(new Event('api_request_end'));
    return response;
}, (error) => {
    window.dispatchEvent(new Event('api_request_end'));
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
        window.dispatchEvent(new CustomEvent('api_network_error', { detail: error }));
    }
    return Promise.reject(error);
});

export default api;