import axiosClient from '../axiosClient';

export default {
  sendDeviceToken(device_token: string | null) {
    return axiosClient.post('api/update-device-token', {device_token});
  },
};
