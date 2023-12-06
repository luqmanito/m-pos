import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../Redux/store';
import cache from '../Util/cache';
import orderNetwork from '../Network/lib/order';
import ToastAlert from '../Components/Toast/Toast';
import {useToast} from 'native-base';
import {useLoading} from '../Context';
import useUserInfo from './useUserInfo';
import useOrders from './useOrders';
import {createPayment} from '../Redux/Reducers/payment';
import {useGenerateInvoiceNumber} from './useInvoiceTemporary';
import {getCurrentDateTime} from '../Components/Date/Time';
import {dates} from '../Components/Date/Today';
import {useReport} from './useReport';

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

  const handleRefreshReport = useReport().handleRefresh;
  const dispatch = useDispatch();
  const {setLoading} = useLoading();
  const toast = useToast();
  const {userData} = useUserInfo();
  const invoiceNumber = useGenerateInvoiceNumber();
  const cartItems = useSelector((state: RootState) => state.cartSlice.items);
  // const totalSum = cartItems.reduce((sum, item) => sum + item.subTotal, 0);
  // const [nominal, setNominal] = useState<number>(0);
  const totalSum = cartItems.reduce((sum, item) => sum + item.subTotal, 0);
  const filteredItems = cartItems.filter(item => item.quantity > 0);
  const {handleRefresh} = useOrders();
  const navigation = useNavigation<NavigationProp<any>>();
  const table_number = useSelector(
    (state: RootState) => state.buttonSlice?.table_number,
  );
  const payment_method_id = useSelector(
    (state: RootState) => state.buttonSlice?.payment_methodId,
  );
  const detailOrderItems = useSelector(
    (state: RootState) => state.orderSlice.order_detail,
  );
  const paymentMethodCode = useSelector(
    (state: RootState) => state.buttonSlice?.payment_methodId,
  );
  const id = useSelector((state: RootState) => state.buttonSlice?.selectedId);
  const orderId = useSelector(
    (state: RootState) => state.buttonSlice?.activeId,
  );
  const globalState = useSelector((state: RootState) => state?.buttonSlice);
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
        navigation.navigate('Dashboard', {screen: 'Order'});
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
      handleRefresh();
      return response;
    } catch (error: any) {
      console.log(error);
      ToastAlert(toast, 'error', error?.response?.data?.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const orderCompleted = async () => {
    setLoading(true);
    try {
      const response = await orderNetwork.orderCompleted(orderId);
      if (response) {
        ToastAlert(toast, 'sukses', 'Pesanan Berhasil Diselesaikan');
        // dispatch(clearCartPayment());
        // dispatch(clearStateButton());
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

  const submitCashierPayment = async (nominal: number | undefined) => {
    setLoading(true);
    try {
      const response = await orderNetwork.updatePaymentMethodOrder({
        id: orderId,
        total_paid: nominal,
        payment_method_id,
      });
      if (response) {
        orderCompleted();
        dispatch(
          createPayment({
            products: detailOrderItems?.products,
            totalPrice: detailOrderItems?.total,
            totalPayment: response?.data?.total_paid,
            exchangePayment:
              response?.data?.total_paid - (detailOrderItems?.total ?? 0),
            invoiceNumber: response?.data?.order_code,
            datePayment: response?.data?.created_at,
            cashierName: userData?.name,
          }),
        );
        // ToastAlert(toast, 'sukses', 'Berhasil Bayar');
        navigation.navigate('SuccessfulPaymentScreen');

        ToastAlert(toast, 'sukses', 'Pesanan Berhasil Diselesaikan');
        // dispatch(clearCartPayment());
        // dispatch(clearStateButton());
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
          console.log(error);
        } finally {
          console.log('masok');

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
      handleRefreshReport();
    }
  };

  const singleSubmitPayment = async (): Promise<void> => {
    try {
      // FOR ONLINE MODE
      const response = await orderNetwork.pay({
        products: filteredItems.map(item => {
          return {
            id: item?.productId,
            quantity: item?.quantity,
            note: item?.note,
          };
        }),
        table_no: table_number,
        payment_method: null,
        total_paid: null,
        ref: 'OFFLINE',
        name: globalState?.customerName,
        phone: globalState?.customerPhone,
        email: globalState?.customerEmail,
      });
      if (response) {
        dispatch(
          createPayment({
            products: response?.data?.products,
            totalPrice: totalSum,
            totalPayment: 0,
            exchangePayment: 0,
            invoiceNumber: response?.data?.order_code,
            datePayment: response?.data?.created_at,
            cashierName: userData?.name,
          }),
        );
        ToastAlert(toast, 'sukses', 'Berhasil Bayar');
        navigation.navigate('SuccessfulPaymentScreen');
      }
    } catch (error: any) {
      submitFailedPayment();
      ToastAlert(toast, 'error', error?.response?.data?.message);
      throw error;
    }
  };

  const submitFailedPayment = async (): Promise<void> => {
    const paymentData = {
      products: filteredItems.map(item => {
        return {
          id: item?.productId,
          quantity: item?.quantity,
          note: item?.note,
        };
      }),
      table_no: table_number,
      payment_method: paymentMethodCode,
      total_paid: null,
      ref: 'OFFLINE',
      invoiceNumber,
      date: getCurrentDateTime(),
      total_price: totalSum,
      cashierName: userData?.name,
      name: globalState?.customerName,
      phone: globalState?.customerPhone,
      email: globalState?.customerEmail,
    };
    try {
      // FOR OFFLINE MODE
      let dataSubmissions = await cache.get('paymentSubmissions');
      if (dataSubmissions) {
        dataSubmissions.push(paymentData);
        await cache.store('paymentSubmissions', dataSubmissions);
        ToastAlert(toast, 'sukses', 'Pesanan Berhasil Tersimpan');
        navigation.navigate('SuccessfulPaymentScreen');
        dispatch(
          createPayment({
            // products: filteredItems,
            totalPrice: totalSum,
            totalPayment: null,
            exchangePayment: 0,
            invoiceNumber: invoiceNumber,
            datePayment: dates,
            cashierName: userData?.name,
          }),
        );
      } else {
        dataSubmissions = [];
        dataSubmissions.push(paymentData);
        await cache.store('paymentSubmissions', dataSubmissions);
        ToastAlert(toast, 'sukses', 'Pesanan Berhasil Tersimpan');
        navigation.navigate('SuccessfulPaymentScreen');
        dispatch(
          createPayment({
            // products: filteredItems,
            totalPrice: totalSum,
            totalPayment: null,
            exchangePayment: 0,
            invoiceNumber: invoiceNumber,
            datePayment: dates,
            cashierName: userData?.name,
          }),
        );
      }
    } catch (error: any) {
      ToastAlert(toast, 'error', error?.response?.data?.message);
      // console.error('Error payment:', error);
      throw error;
    }
  };

  return {
    submitPayment,
    singleSubmitPayment,
    // orderReady,
    orderCompleted,
    submitFailedPayment,
    updateOrder,
    confirmOrder,
    submitCashierPayment,
  };
};

export default usePaymentSubmit;
