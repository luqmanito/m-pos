import {AxiosResponse} from 'axios';
import axiosClient from '../axiosClient';
import {LoginModel} from '../../models/LoginModel';
import {UserModel} from '../../models/UserModel';
import {ErrorModel} from '../../models/ErrorModel';

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

export default {
  login({
    email,
    password,
  }: LoginCredentials): Promise<AxiosResponse<LoginModel>> {
    return axiosClient.post('api/auth/login', {email, password});
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
  register(formData: FormData): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      axiosClient
        .post<UserModel>('api/auth/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(({data}) => {
          resolve(data);
        })
        .catch(e => {
          const err: ErrorModel | undefined = e.response.data;
          console.log(err);

          reject(err);
        });
    });
  },
};
