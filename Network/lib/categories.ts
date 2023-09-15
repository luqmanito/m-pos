import axiosClient from '../axiosClient';

interface create {
  name: string | undefined;
  description: string | undefined;
}

export default {
  createCategory({name, description}: create) {
    return axiosClient.post('api/categories', {name, description});
  },
};
