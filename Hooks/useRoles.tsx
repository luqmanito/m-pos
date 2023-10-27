import {useEffect, useState} from 'react';
import {useLoading} from '../Context';
import roleNetwork from '../Network/lib/role';

// import {RoleModel} from '../models/roleModel';

export interface RoleModel {
  id: string;
  role: string;
  value: string;
  title: string;
  description: any;
}

const useRoles = () => {
  const [listRoles, setListRoles] = useState<
    {
      id: number;
      role: string;
      value: string;
      title: string;
      description: any;
    }[]
  >([]);
  const {setLoading} = useLoading();
  // const [fetchData, setFetchData] = useState(false);
  // const isFocused = useIsFocused();
  // const isConnected = useNetworkInfo().isConnected;

  // const handleRefresh = () => {
  //   setFetchData(prevToggle => !prevToggle);
  // };

  useEffect(() => {
    setLoading(true);
    const fetchRoles = async (): Promise<void> => {
      try {
        const response = await roleNetwork.listRoles();
        if (response) {
          setLoading(false);
          const roleData = Object.keys(response.data).map((role, index) => ({
            id: index + 1,
            role: role,
            value: role.toLowerCase(),
            title: role.charAt(0) + role.slice(1).toLowerCase(),
            description: response.data[role],
          }));
          setListRoles(roleData);
        }
      } catch (error) {
        setLoading(false);
        console.error('Error fetching roles:', error);
        throw error;
      }
    };

    fetchRoles();
  }, [setLoading]);
  return {
    listRoles,
  };
};

export default useRoles;
