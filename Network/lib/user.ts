import {AxiosResponse} from 'axios';
import {UserModel} from '../../models/UserModel';
import axiosClient from '../axiosClient';

export default {
  userProfile(): Promise<AxiosResponse<UserModel>> {
    return axiosClient.get('api/me', {
      params: {
        load: 'business.modules,business.photo',
      },
    });
  },
};
