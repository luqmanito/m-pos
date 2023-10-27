import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import {Dimensions} from 'react-native';
export const screenWidth = Dimensions.get('window').width;

const axiosClient = axios.create({
  baseURL: Config.API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    return config;
  },
  error => {
    console.error('Error with Axios request interceptor:', error);
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(response => {
  if (response.status === 200 || 204) {
    console.info('\x1b[42m', response.status, response.config.url);
  } else {
    console.warn(response.status, response.config.url);
  }
  return response;
});

export default axiosClient;
