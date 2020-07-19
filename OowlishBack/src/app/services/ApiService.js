import axios from 'axios';

// Creates an instance of axios to fetch Github requests
const api = axios.create({
  baseURL: 'https://api.github.com',
});

export default api;
