// utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api', // Убедитесь, что это правильный URL вашего API
  timeout: 10000, // Тайм-аут запроса
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
