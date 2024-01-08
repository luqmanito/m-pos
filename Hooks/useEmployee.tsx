import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {useLoading} from '../Context';
import {EmployeeDetailModel, ListEmployeeModel} from '../models/EmployeeModel';
import {ErrorModel} from '../models/ErrorModel';
import userNetwork from '../Network/lib/employee';
import {setNewEmployeeData} from '../Redux/Reducers/employee';
import useAlert from './useAlert';

const useEmployee = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const {setLoading} = useLoading();
  const {t} = useTranslation();
  const alert = useAlert();
  const dispatch = useDispatch();
  const [errorBag, setErrorBag] = useState<ErrorModel | undefined>(undefined);
  const [listEmployee, setListEmployee] = useState<ListEmployeeModel>([]);
  const [detailEmployee, setDetailEmployee] = useState<EmployeeDetailModel>();
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    password_confirmation: '',
  });

  const handleChangeData = (
    key: string,
    data: string | number | null,
  ): void => {
    setForm(prev => ({
      ...prev,
      [key]: data,
    }));
  };

  const getFormError = (key: string): string => {
    if (errorBag && errorBag.errors && errorBag.errors[key]) {
      return errorBag.errors[key][0];
    } else {
      return '';
    }
  };

  const isInvalid = (key: string): boolean => {
    if (errorBag && errorBag.errors && errorBag.errors[key]) {
      return true;
    } else {
      return false;
    }
  };

  const clearFormErrors = () => {
    setErrorBag(undefined);
  };

  const addEmployee = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('password', form.password);
    formData.append('password_confirmation', form.password_confirmation);
    formData.append('role', form.role);
    userNetwork
      .createUser(formData)
      .then(() => {
        dispatch(
          setNewEmployeeData({
            name: form.name,
            mobile_number: null,
            email: form.email,
            role: form.role,
          }),
        );
        alert.showAlert('success', t('employee-added'));
        navigation.navigate('NewEmployee');
      })
      .catch(err => {
        setErrorBag(err);
        alert.showAlert('error', err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const editEmployee = async (id: number | undefined | null) => {
    setLoading(true);
    try {
      const response = await userNetwork.updateUser({
        name: form.name,
        email: form.email,
        role: form.role,
        id,
      });
      if (response) {
        alert.showAlert('success', t('employee-edited'));
        navigation.navigate('SettingScreen');
        return response;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getDetailEmployee = async (id: number | undefined | null) => {
    if (id) {
      try {
        setLoading(true);
        const response = await userNetwork.detailUser(id);
        if (response) {
          setDetailEmployee(response?.data);
          setForm({
            ...form,
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
    }
    return null;
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
  const deleteEmployee = async (id: number | undefined | null) => {
    setLoading(true);
    try {
      const response = await userNetwork.deleteUser(id);
      if (response) {
        alert.showAlert('success', t('employee-deleted'));
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
    const routes = navigation.getState()?.routes;
    const screenName = routes[routes.length - 1];
    screenName.name === 'EmployeeDetail' ? null : getListEmployee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setLoading]);

  return {
    handleChangeData,
    restoreEmployee,
    errorBag,
    clearFormErrors,
    listEmployee,
    getFormError,
    isInvalid,
    getDetailEmployee,
    detailEmployee,
    deleteEmployee,
    form,
    addEmployee,
    editEmployee,
  };
};

export default useEmployee;
