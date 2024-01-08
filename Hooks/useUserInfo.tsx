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
  const [onlineModule, setOnlineModule] = useState(false);
  const [fetchData, setFetchData] = useState(false);
  const isFocused = useIsFocused();
  const isConnected = useNetworkInfo().isConnected;

  const handleRefresh = () => {
    setFetchData(prevToggle => !prevToggle);
  };

  useEffect(() => {
    const fetchUserInfo = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await userNetwork.userProfile();
        if (response) {
          const hasOrderOnlineModule = response.data.business.modules.some(
            module => module.name.toLowerCase() === 'order online',
          );
          if (hasOrderOnlineModule) {
            setOnlineModule(true);
          } else {
            setOnlineModule(false);
          }
          await cache.store('DataUser', response.data);
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    };
    const fetchUserCache = async (): Promise<void> => {
      const dataUser = await cache.get('DataUser');
      setUserData(dataUser);
    };
    if (isFocused && !isConnected) {
      fetchUserCache();
    }
    if (isFocused && isConnected) {
      setTimeout(() => {
        fetchUserInfo();
      }, 2000);
    }
  }, [isFocused, isConnected, setLoading, fetchData]);
  return {
    userData,

    handleRefresh,
    onlineModule,
  };
};

export default useUserInfo;
