import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLoading} from '../Context';
import {OrderModel, RootOrderModel} from '../models/OrderModel';
import orderNetwork from '../Network/lib/order';
import {resetOrderDetailState, setOrderState} from '../Redux/Reducers/orders';
import {RootState} from '../Redux/store';
import {MetaModel} from '../models/MetaModel';
import {useAuth} from '../Contexts/Auth';
import {clearStateButton, setLastPage} from '../Redux/Reducers/button';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import useAlert from './useAlert';
import {useTranslation} from 'react-i18next';

const useOrders = () => {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const {authData} = useAuth();
  const {setLoading} = useLoading();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fetchData, setFetchData] = useState(false);
  const orderId = useSelector(
    (state: RootState) => state.buttonSlice?.activeId,
  );
  const order = useSelector((state: RootState) => state.orderSlice.orders);

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
  const alert = useAlert();
  const handleSearch = (newValue: string) => {
    return setSearchKeyword(newValue);
  };
  const navigation = useNavigation<NavigationProp<any>>();
  const routes = navigation.getState()?.routes;
  const routeName = routes[routes.length - 1];
  const {t} = useTranslation();
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
        per_page: numOrders,
        ref: 'ONLINE',
        sort:
          authData?.user?.role.toLowerCase() === 'cashier' ||
          authData?.user?.role.toLowerCase() === 'kitchen'
            ? 'created_at|asc'
            : 'created_at|desc',
        status:
          authData?.user?.role.toLowerCase() === 'cashier'
            ? 'ready'
            : authData?.user?.role.toLowerCase() === 'kitchen'
            ? 'confirm'
            : 'pending',
      });
      if (newData) {
        if (newData.data.meta.current_page >= newData.data.meta.last_page) {
          dispatch(setLastPage(true));
        } else {
          dispatch(setLastPage(false));
        }
        dispatch(setOrderState([...order, ...newData?.data?.data]));
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
        alert.showAlert('success', t('change-status'));
      }
      dispatch(resetOrderDetailState());
      return response;
    } catch (error: any) {
      console.log(error);
      alert.showAlert('error', error?.response?.data?.message);
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
      const response = await orderNetwork.list({
        search: searchKeyword,
        page: 1,
        per_page: numOrders,
        ref: 'ONLINE',
        sort:
          authData?.user?.role.toLowerCase() === 'cashier' ||
          authData?.user?.role.toLowerCase() === 'kitchen'
            ? 'created_at|asc'
            : 'created_at|desc',
        status:
          authData?.user?.role.toLowerCase() === 'cashier'
            ? 'ready'
            : authData?.user?.role.toLowerCase() === 'kitchen'
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
    if (routeName.name !== 'PaymentScreen') {
      dispatch(resetOrderDetailState());
      dispatch(clearStateButton());
    }

    // delay fetching to await token are fully loaded
    setTimeout(() => {
      fetchOrders();
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword, fetchData]);
  return {
    order,
    orders,
    handleSearch,
    orderReady,
    handleRefresh,
    newFetchData,
    fetchOrdersByStatus,
    emptyData,
    metaProduct,
  };
};

export default useOrders;
