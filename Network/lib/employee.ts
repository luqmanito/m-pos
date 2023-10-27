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
  createUser({name, email, password, role, password_confirmation}: userProps) {
    return axiosClient.post('api/users', {
      name,
      email,
      password,
      role,
      password_confirmation,
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
  deleteUser(id: number) {
    return axiosClient.delete(`api/users/${id}`);
  },
  detailUser(id: number | null) {
    return axiosClient.get(`api/users/${id}`);
  },
  restoreUser(id: number) {
    return axiosClient.post(`api/users/${id}/restore`, {
      _method: 'PUT',
    });
  },
};
