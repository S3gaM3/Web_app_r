// utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // URL для твоего API
  timeout: 10000, // Тайм-аут запроса
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
