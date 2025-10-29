import api from './api';
import Cookies from 'js-cookie';

export const signup = async (email: string, password: string) => {
  const response = await api.post('/auth/signup', { email, password });
  const accessToken = response.headers['X-Access-Token'];
  const userId = response.headers['X-User-Id'];

  if (accessToken && userId) {
    Cookies.set('X-Access-Token', accessToken, { expires: 7 }); // Expires in 7 days
    Cookies.set('X-User-Id', userId, { expires: 7 }); // Expires in 7 days
  }
  return response.data;
};

export const signin = async (email: string, password: string) => {
  const response = await api.post('/auth/signin', { email, password });
  const accessToken = response.headers['X-Access-Token'];
  const userId = response.headers['X-User-Id'];

  if (accessToken && userId) {
    Cookies.set('X-Access-Token', accessToken, { expires: 7 }); // Expires in 7 days
    Cookies.set('X-User-Id', userId, { expires: 7 }); // Expires in 7 days
  }
  return response.data;
};

export const googleOAuth = async (redirect: string) => {
  const response = await api.get(`/auth/oauth/google?redirect=${redirect}`);
  return response.data;
};
