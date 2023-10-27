import {useIsFocused, useRoute} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useLoading} from '../Context';
import {OrderModel, RootOrderModel} from '../models/OrderModel';

import orderNetwork from '../Network/lib/order';
import {setOrderState} from '../Redux/Reducers/orders';
import cache from '../Util/cache';

const useOrders = () => {
  const [orders, setOrders] = useState<OrderModel[]>([]);

  const {setLoading} = useLoading();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fetchData, setFetchData] = useState(false);

  const [emptyData, setEmptyData] = useState(false);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const route = useRoute();
  const handleSearch = (newValue: string) => {
    return setSearchKeyword(newValue);
  };

  const handleRefresh = () => {
    setFetchData(prevToggle => !prevToggle);
  };

  const newFetchData = () => {
    setPage(prevPage => prevPage + 1);
    const pages = page + 1;
    handleNewFetchData(pages);
  };

  const handleNewFetchData = async (value: number) => {
    try {
      const newData = await orderNetwork.list({
        page: value,
        search: searchKeyword,
        status: route?.name === 'KitchenScreen' ? 'confirm' : 'pending',
      });

      if (newData) {
        setOrders([...orders, ...newData?.data?.data]);
        if (newData?.data?.data.length === 0) {
          setEmptyData(true);
          const sortedData = newData?.data?.data.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          );
          setOrders([...orders, ...sortedData]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrdersByStatus = async (
    status: string,
    ref: string,
  ): Promise<RootOrderModel[] | void> => {
    setLoading(true);
    setPage(1);
    try {
      const response = await orderNetwork.list({
        search: searchKeyword,
        page: 1,
        status,
      });
      if (response) {
        setEmptyData(false);
        setLoading(false);
        const sortedData = response.data.data.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        const filteredOrderList = sortedData.filter(item => item.ref === ref);
        dispatch(setOrderState(filteredOrderList));
        return setOrders(filteredOrderList);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching orders:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchOrders = async (): Promise<RootOrderModel[] | void> => {
      setLoading(true);
      setPage(1);
      try {
        const dataUser = await cache.get('DataUser');
        const response = await orderNetwork.list({
          search: searchKeyword,
          page: 1,
          status:
            route?.name === 'KitchenScreen' && dataUser.role === 'CASHIER'
              ? 'ready'
              : route?.name === 'KitchenScreen' && dataUser.role === 'KITCHEN'
              ? 'confirm'
              : 'pending',
        });
        if (response) {
          setEmptyData(false);
          const sortedData = response.data.data.sort(
            (a, b) =>
              new Date(
                route?.name === 'KitchenScreen' ? a.created_at : b.created_at,
              ).getTime() -
              new Date(
                route?.name === 'KitchenScreen' ? b.created_at : a.created_at,
              ).getTime(),
          );
          const filteredOrderList = sortedData.filter(
            item => item.ref === 'ONLINE',
          );
          dispatch(setOrderState(filteredOrderList));
          return setOrders(filteredOrderList);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    };
    if (isFocused) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword, isFocused, fetchData, setLoading]);
  return {
    orders,
    handleSearch,
    handleRefresh,
    newFetchData,
    fetchOrdersByStatus,
    emptyData,
  };
};

export default useOrders;
