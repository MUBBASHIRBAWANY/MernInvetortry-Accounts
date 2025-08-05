import axios from 'axios';

const api = axios.create({
  API_BASE_URL : "http://localhost:3001/",
  baseURL: 'http://localhost:3001/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;