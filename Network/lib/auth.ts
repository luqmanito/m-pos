import {AxiosResponse} from 'axios';
import axiosClient from '../axiosClient';

interface LoginCredentials {
  email: string;
  password: string;
}
interface AuthCredentials extends LoginCredentials {
  code: string;
  password_confirmation: string;
}
interface ForgotCredentials {
  email: string;
}
type CheckCodeCredentials = {
  email: string;
  code: string;
};

interface ApiResponse {
  success: boolean;
  message: string;
  data: any;
  token: string;
}

interface RegisterData extends FormData {}

export default {
  login({email, password}: LoginCredentials) {
    return axiosClient.post<ApiResponse>('api/auth/login', {email, password});
  },
  forgot({email}: ForgotCredentials) {
    return axiosClient.post('api/auth/password/forgot', {email});
  },
  checkCode({email, code}: CheckCodeCredentials) {
    return axiosClient.post('api/auth/password/check', {email, code});
  },
  passwordReset({
    email,
    code,
    password,
    password_confirmation,
  }: AuthCredentials) {
    return axiosClient.post('api/auth/password/reset', {
      email,
      code,
      password,
      password_confirmation,
    });
  },
  register({data}: {data: RegisterData}): Promise<AxiosResponse> {
    return axiosClient('api/auth/register', {
      method: 'POST',
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
