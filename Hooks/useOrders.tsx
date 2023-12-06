import {useIsFocused, useRoute} from '@react-navigation/native';
import {useToast} from 'native-base';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ToastAlert from '../Components/Toast/Toast';
import {useLoading} from '../Context';
import {OrderModel, RootOrderModel} from '../models/OrderModel';
import orderNetwork from '../Network/lib/order';
import {resetOrderDetailState, setOrderState} from '../Redux/Reducers/orders';
import {RootState} from '../Redux/store';
import cache from '../Util/cache';
import {MetaModel} from '../models/MetaModel';

const useOrders = () => {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const toast = useToast();
  const {setLoading} = useLoading();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fetchData, setFetchData] = useState(false);
  const orderId = useSelector(
    (state: RootState) => state.buttonSlice?.activeId,
  );

  const numOrders = 10;
  const [metaProduct, setMetaProduct] = useState<MetaModel>({
    current_page: 0,
    from: 0,
    per_page: 0,
    to: 0,
    total: 0,
    last_page: 0,
  });
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
      const dataUser = await cache.get('DataUser');
      const newData = await orderNetwork.list({
        page: value,
        search: searchKeyword,
        per_page: numOrders,
        sort:
          dataUser.role.toLowerCase() === 'cashier' ||
          dataUser.role.toLowerCase() === 'kitchen'
            ? 'created_at|asc'
            : 'created_at|desc',
        status:
          route?.name.toLowerCase() === 'kitchenscreen' &&
          dataUser.role.toLowerCase() === 'cashier'
            ? 'ready'
            : route?.name.toLowerCase() === 'kitchenscreen' &&
              dataUser.role.toLowerCase() === 'kitchen'
            ? 'confirm'
            : 'pending',
      });

      if (newData) {
        setOrders([...orders, ...newData?.data?.data]);
        if (newData?.data?.data.length > 0) {
          setOrders([...orders, ...newData?.data?.data]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const orderReady = async () => {
    setLoading(true);
    try {
      const response = await orderNetwork.orderReady(orderId);
      if (response) {
        ToastAlert(toast, 'sukses', 'Pesanan Berhasil Disiapkan');
      }
      dispatch(resetOrderDetailState());
      return response;
    } catch (error: any) {
      console.log(error);
      ToastAlert(toast, 'error', error?.response?.data?.message);
      throw error;
    } finally {
      handleRefresh();
      setLoading(false);
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
        per_page: numOrders,
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

  const fetchOrders = async (): Promise<RootOrderModel[] | void> => {
    setLoading(true);
    try {
      const dataUser = await cache.get('DataUser');
      const response = await orderNetwork.list({
        search: searchKeyword,
        page: 1,
        per_page: numOrders,
        ref: 'ONLINE',
        sort:
          dataUser.role.toLowerCase() === 'cashier' ||
          dataUser.role.toLowerCase() === 'kitchen'
            ? 'created_at|asc'
            : 'created_at|desc',
        status:
          route?.name.toLowerCase() === 'kitchenscreen' &&
          dataUser.role.toLowerCase() === 'cashier'
            ? 'ready'
            : route?.name.toLowerCase() === 'kitchenscreen' &&
              dataUser.role.toLowerCase() === 'kitchen'
            ? 'confirm'
            : 'pending',
      });
      if (response) {
        setEmptyData(false);
        setMetaProduct(response.data.meta);
        dispatch(setOrderState(response?.data?.data));
        return setOrders(response?.data?.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // This effect will run after the state is updated
    if (page <= metaProduct.last_page) {
      handleNewFetchData(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (isFocused) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword, isFocused, fetchData, setLoading]);
  return {
    orders,
    handleSearch,
    orderReady,
    handleRefresh,
    newFetchData,
    fetchOrdersByStatus,
    emptyData,
  };
};

export default useOrders;
