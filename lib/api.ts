import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for sending cookies with cross-origin requests
});

// Add a request interceptor to include the access token from cookies
api.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('x-access-token');
    const userId = Cookies.get('x-user-id');

    if (accessToken) {
      // Assuming the backend expects 'x-access-token' as a custom header
      config.headers['x-access-token'] = accessToken;
    }
    if (userId) {
      // Assuming the backend expects 'x-user-id' as a custom header
      config.headers['x-user-id'] = userId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
