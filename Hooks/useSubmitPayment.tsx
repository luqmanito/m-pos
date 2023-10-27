import {NavigationProp, useNavigation} from '@react-navigation/native';
// import {useState} from 'react';
// import {Dimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../Redux/store';
import cache from '../Util/cache';
import orderNetwork from '../Network/lib/order';
import ToastAlert from '../Components/Toast/Toast';
import {useToast} from 'native-base';
import {useLoading} from '../Context';
import useUserInfo from './useUserInfo';
import useOrders from './useOrders';
import {clearCartPayment} from '../Redux/Reducers/payment';
import {clearStateButton} from '../Redux/Reducers/button';

export type Root = Root2[];

export interface Root2 {
  products: Product[];
  table_no: string;
  payment_method: number;
  total_paid: number;
  ref: string;
  name: string;
  phone: string;
  email: string;
}

export interface Product {
  id: number;
  quantity: number;
  note: string;
}

const usePaymentSubmit = () => {
  // const paymentMethodCode = useSelector(
  //   (state: RootState) => state.buttonSlice?.payment_methodId,
  // );
  const dispatch = useDispatch();
  const {setLoading} = useLoading();
  const toast = useToast();
  const {userData} = useUserInfo();
  const cartItems = useSelector((state: RootState) => state.cartSlice.items);
  // const totalSum = cartItems.reduce((sum, item) => sum + item.subTotal, 0);
  // const [nominal, setNominal] = useState<number>(0);
  const filteredItems = cartItems.filter(item => item.quantity > 0);
  const {handleRefresh} = useOrders();
  const navigation = useNavigation<NavigationProp<any>>();
  const table_number = useSelector(
    (state: RootState) => state.buttonSlice?.table_number,
  );
  const id = useSelector((state: RootState) => state.buttonSlice?.selectedId);
  const orderId = useSelector(
    (state: RootState) => state.buttonSlice?.activeId,
  );

  const updateOrder = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await orderNetwork.updateOrder({
        id,
        products: filteredItems.map(item => {
          return {
            id: item?.productId,
            quantity: item?.quantity,
            note: item?.note,
          };
        }),
        table_no: table_number || '',
        created_by: userData?.name,
      });

      if (response) {
        ToastAlert(toast, 'sukses', 'Pesanan Berhasil Dikonfirmasi');
        navigation.navigate('Dashboard', {screen: 'Transaction'});
      }
    } catch (error: any) {
      console.log(error);
      ToastAlert(toast, 'error', error?.response?.data?.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const confirmOrder = async () => {
    setLoading(true);
    try {
      const response = await orderNetwork.confirmOrder(id);
      return response;
    } catch (error: any) {
      console.log(error);
      ToastAlert(toast, 'error', error?.response?.data?.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const orderReady = async () => {
    setLoading(true);
    console.log(orderId);
    try {
      const response = await orderNetwork.orderReady(orderId);
      if (response) {
        ToastAlert(toast, 'sukses', 'Pesanan Berhasil Disiapkan');
      }
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
  const orderCompleted = async () => {
    setLoading(true);
    try {
      const response = await orderNetwork.orderCompleted(orderId);
      if (response) {
        ToastAlert(toast, 'sukses', 'Pesanan Berhasil Diselesaikan');
        dispatch(clearCartPayment());
        dispatch(clearStateButton());
      }
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

  const submitPayment = async (dataList: Array<Root2>): Promise<void> => {
    try {
      const requestPromises = dataList.map(async data => {
        setLoading(true);
        try {
          const response = await orderNetwork.pay({
            products: data?.products?.map(item => ({
              id: item?.id,
              quantity: item?.quantity,
              note: item?.note,
            })),
            table_no: data?.table_no,
            payment_method: data?.payment_method,
            total_paid: data?.total_paid,
            ref: data?.ref,
            name: data?.name,
            phone: data?.phone,
            email: data?.email,
          });

          if (response) {
            dataList = dataList.filter(item => item !== data);
            await cache.store('paymentSubmissions', dataList);
          }

          return response;
        } catch (error) {
          return null;
        } finally {
          setLoading(false);
        }
      });

      const responses = await Promise.all(requestPromises);
      let completedResponses = 0;

      for (const response of responses) {
        completedResponses++;
        if (response) {
          ToastAlert(toast, 'sukses', 'Data Berhasil Dikirim');
        } else {
          ToastAlert(toast, 'error', 'Gagal Mengirim Data');
        }
        if (completedResponses === responses.length) {
          setLoading(false);
          ToastAlert(toast, 'sukses', 'Data Berhasil Dikirim');
        }
      }
    } catch (error: any) {
      ToastAlert(toast, 'error', error?.response?.data?.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {submitPayment, orderReady, orderCompleted, updateOrder, confirmOrder};
};

export default usePaymentSubmit;
