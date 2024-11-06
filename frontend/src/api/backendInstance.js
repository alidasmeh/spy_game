import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/', // Change this to your backend URL
  timeout: 1000, // Optional: Set a timeout for requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
