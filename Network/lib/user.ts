import axiosClient from '../axiosClient';

export default {
  userProfile() {
    return axiosClient.get('api/me?load=business.photo');
  },
};
