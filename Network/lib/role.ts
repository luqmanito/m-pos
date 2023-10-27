import {AxiosResponse} from 'axios';
import axiosClient from '../axiosClient';

export default {
  listRoles(): Promise<AxiosResponse> {
    return axiosClient.get('api/roles');
  },
};
