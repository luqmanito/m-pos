import {useIsFocused} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import cache from '../Util/cache';

const useDataEmployee = () => {
  const isFocused = useIsFocused();
  const [dataDetailEmployee, setDataDetailEmployee] = useState([]);

  useEffect(() => {
    const NewEmployee = async () => {
      const response = await cache.get('newEmployeeData');
      if (response) {
        setDataDetailEmployee(response);
      }
      console.log(response);
    };
    if (isFocused) {
      NewEmployee();
    }
  }, [isFocused]);

  return {dataDetailEmployee};
};

export default useDataEmployee;
