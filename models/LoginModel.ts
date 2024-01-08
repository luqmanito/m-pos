import {UserModel} from './UserModel';

export interface LoginModel {
  token: string;
  user: UserModel;
}
