import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useToast} from 'native-base';
import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import ToastAlert from '../Components/Toast/Toast';
import {useLoading} from '../Context';
import {EmployeeDetailModel, ListEmployeeModel} from '../models/EmployeeModel';
import userNetwork from '../Network/lib/employee';
import {setNewEmployeeData} from '../Redux/Reducers/employee';

type PropsType = {
  name: string;
  value: string;
};

const useEmployee = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const {setLoading} = useLoading();
  const toast = useToast();
  const dispatch = useDispatch();
  const [listEmployee, setListEmployee] = useState<ListEmployeeModel>([]);
  const [detailEmployee, setDetailEmployee] = useState<EmployeeDetailModel>();
  const [newEmployee, setNewEmployee] = useState({
    name: null,
    email: null,
    role: null,
    password: '',
    password_confirmation: '',
  });

  const handleChangeData = ({name, value}: PropsType) => {
    setNewEmployee({
      ...newEmployee,
      [name]: value,
    });
  };

  const addEmployee = async () => {
    setLoading(true);
    try {
      const response = await userNetwork.createUser({
        name: newEmployee.name,
        email: newEmployee.email,
        password: newEmployee.password,
        role: newEmployee.role,
        password_confirmation: newEmployee.password_confirmation,
      });
      if (response) {
        dispatch(
          setNewEmployeeData({
            name: newEmployee.name,
            mobile_number: null,
            email: newEmployee.email,
            role: newEmployee.role,
          }),
        );
        navigation.navigate('NewEmployee');
        return response;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const editEmployee = async (id: number) => {
    setLoading(true);
    try {
      const response = await userNetwork.updateUser({
        name: newEmployee.name,
        email: newEmployee.email,
        role: newEmployee.role,
        id,
      });
      if (response) {
        ToastAlert(toast, 'sukses', 'Data Pegawai Berhasil diubah');
        navigation.navigate('SettingScreen');
        return response;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getDetailEmployee = async (id: number | null) => {
    setLoading(true);
    try {
      const response = await userNetwork.detailUser(id);
      if (response) {
        setDetailEmployee(response?.data);
        setNewEmployee({
          ...newEmployee,
          ['name']: response?.data.name,
          ['email']: response?.data.email,
          ['role']: response?.data.role,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const restoreEmployee = async (id: number) => {
    setLoading(true);
    try {
      const response = await userNetwork.restoreUser(id);
      if (response) {
        return response;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const deleteEmployee = async (id: number) => {
    setLoading(true);
    try {
      const response = await userNetwork.deleteUser(id);
      if (response) {
        ToastAlert(toast, 'sukses', 'Berhasil Menghapus Data Pegawai');
        navigation.navigate('SettingScreen');
        return response;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const getListEmployee = async () => {
      setLoading(true);
      try {
        const response = await userNetwork.listUser();
        if (response) {
          setListEmployee(response?.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getListEmployee();
  }, [setLoading]);

  return {
    handleChangeData,
    restoreEmployee,
    listEmployee,
    getDetailEmployee,
    detailEmployee,
    deleteEmployee,
    newEmployee,
    addEmployee,
    editEmployee,
  };
};

export default useEmployee;
