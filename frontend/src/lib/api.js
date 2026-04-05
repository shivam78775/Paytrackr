import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://paytrackr.onrender.com/api',
    withCredentials: true, // Send cookies
});

export default api;
