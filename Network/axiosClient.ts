import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import {Dimensions} from 'react-native';
import {navigate} from './rootNavigator';
export const screenWidth = Dimensions.get('window').width;

const axiosClient = axios.create({
  baseURL: Config.API_URL,
  timeout: 300,
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

const handleExpired = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
    navigate('LoginScreen');
  } catch (error) {
    console.log(error);
  }
};

axiosClient.interceptors.response.use(
  response => {
    console.info(
      '\x1b[42m',
      response.status,
      response.config.url,
      response.config.params,
    );
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      handleExpired();
    }
    console.log(
      '\x1b[42m',
      error.response.status,
      error.response.config.url,
      error.response.config.params,
      error.response.config.data,
    );

    return Promise.reject(error);
  },
);

export default axiosClient;
