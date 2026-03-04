import axios from 'axios';

// Backend kurulumuna göre baseUrl belirleniyor (Program.cs 5062 veya 7100 portundan kalkıyordu, duruma göre değiştirilir)
// ASP.NET Core default HTTP port: 5062, HTTPS port: 7100
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5062/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Her istekte LocalStorage/Zustand içerisindeki token'ı Authorization header'ına ekler
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
