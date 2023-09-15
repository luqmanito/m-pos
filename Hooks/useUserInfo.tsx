import {useIsFocused} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {useLoading} from '../Context';
import userNetwork from '../Network/lib/user';
import {UserModel} from '../models/UserModel';
import cache from '../Util/cache';
import useNetworkInfo from './useNetworkInfo';

const useUserInfo = () => {
  const [userData, setUserData] = useState<UserModel>();
  const {setLoading} = useLoading();
  const [fetchData, setFetchData] = useState(false);
  const isFocused = useIsFocused();
  const isConnected = useNetworkInfo().isConnected;

  const handleRefresh = () => {
    setFetchData(prevToggle => !prevToggle);
  };

  useEffect(() => {
    setLoading(true);
    const fetchUserInfo = async (): Promise<void> => {
      try {
        const response = await userNetwork.userProfile();
        if (response) {
          await cache.store('DataUser', response.data);
          setLoading(false);
          setUserData(response.data);
        }
      } catch (error) {
        setLoading(false);
        console.error('Error fetching products:', error);
        throw error;
      }
    };
    const fetchUserCache = async (): Promise<void> => {
      setLoading(true);
      const dataUser = await cache.get('DataUser');
      setLoading(false);
      setUserData(dataUser);
    };
    if (isFocused && !isConnected) {
      fetchUserCache();
    }
    if (isFocused && isConnected) {
      fetchUserInfo();
    }
  }, [isFocused, isConnected, setLoading, fetchData]);
  return {
    userData,
    handleRefresh,
  };
};

export default useUserInfo;
