import axiosClient from '../axiosClient';
import {AxiosResponse} from 'axios/index';
import {RootCategoryModel} from '../../models/CategoryModel';

interface create {
  name: string | undefined;
  description: string | undefined;
}

export default {
  create({name, description}: create) {
    return axiosClient.post('api/categories', {name, description});
  },
  list(params: any): Promise<AxiosResponse<RootCategoryModel>> {
    return axiosClient.get('api/categories', {
      params: params,
    });
  },
};
