import {ErrorModel} from '../../models/ErrorModel';
import axiosClient from '../axiosClient';

interface userProps {
  name: string | null;
  email: string | null;
  password?: string | null;
  password_confirmation?: string | null;
  role: string | null;
  id?: number | null;
}

export default {
  createUser(formData: FormData): Promise<userProps> {
    return new Promise((resolve, reject) => {
      axiosClient
        .post<userProps>('api/users', formData, {
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
  updateUser({name, email, role, id}: userProps) {
    return axiosClient.post(`api/users/${id}`, {
      name,
      email,
      role,
      _method: 'PUT',
    });
  },
  listUser() {
    return axiosClient.get('api/users');
  },
  deleteUser(id: number | undefined | null) {
    return axiosClient.delete(`api/users/${id}`);
  },
  detailUser(id: number | undefined | null) {
    return axiosClient.get(`api/users/${id}`);
  },
  restoreUser(id: number) {
    return axiosClient.post(`api/users/${id}/restore`, {
      _method: 'PUT',
    });
  },
};
