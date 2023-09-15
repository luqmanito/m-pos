import {useIsFocused} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {useLoading} from '../Context';
import {OrderModel, RootOrderModel} from '../models/OrderModel';
import orderNetwork from '../Network/lib/order';

const useOrders = () => {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const {setLoading} = useLoading();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fetchData, setFetchData] = useState(false);
  const [emptyData, setEmptyData] = useState(false);
  const [page, setPage] = useState(1);
  const isFocused = useIsFocused();

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
      });

      if (newData) {
        setOrders([...orders, ...newData?.data?.data]);
        if (newData?.data?.data.length === 0) {
          setEmptyData(true);
          setOrders([...orders, ...newData?.data.data]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchOrders = async (): Promise<RootOrderModel[] | void> => {
      setLoading(true);
      setPage(1);
      try {
        const response = await orderNetwork.list({
          search: searchKeyword,
          page: 1,
        });
        if (response) {
          setEmptyData(false);
          setLoading(false);
          return setOrders(response.data.data);
        }
      } catch (error) {
        setLoading(false);
        console.error('Error fetching orders:', error);
        throw error;
      }
    };
    if (isFocused) {
      fetchOrders();
    }
  }, [searchKeyword, isFocused, fetchData, setLoading]);
  return {
    orders,
    handleSearch,
    handleRefresh,
    newFetchData,
    emptyData,
  };
};

export default useOrders;
