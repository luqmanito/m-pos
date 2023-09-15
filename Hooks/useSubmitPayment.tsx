// import {NavigationProp, useNavigation} from '@react-navigation/native';
// import {useState} from 'react';
// import {Dimensions} from 'react-native';
// import {useSelector} from 'react-redux';
// import {RootState} from '../Redux/store';
import cache from '../Util/cache';
import orderNetwork from '../Network/lib/order';
import ToastAlert from '../Components/Toast/Toast';
import {useToast} from 'native-base';
import {useLoading} from '../Context';

export type Root = Root2[];

export interface Root2 {
  products: Product[];
  table_no: string;
  payment_method: number;
  total_paid: number;
  ref: string;
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
  const {setLoading} = useLoading();
  const toast = useToast();
  // const cartItems = useSelector((state: RootState) => state.cartSlice.items);
  // const totalSum = cartItems.reduce((sum, item) => sum + item.subTotal, 0);
  // const [nominal, setNominal] = useState<number>(0);
  // const filteredItems = cartItems.filter(item => item.quantity > 0);
  // const navigation = useNavigation<NavigationProp<any>>();
  // const table_number = useSelector(
  //   (state: RootState) => state.buttonSlice?.table_number,
  // );

  // const submitPayment = async (value: object): Promise<void> => {
  //   try {
  //     const response = await orderNetwork.pay({
  //       products: filteredItems.map(item => {
  //         return {
  //           id: item?.productId,
  //           quantity: item?.quantity,
  //           note: item?.note,
  //         };
  //       }),
  //       table_no: table_number,
  //       payment_method: paymentMethodCode,
  //       total_paid: nominal,
  //       ref: 'ONLINE',
  //     });

  //     if (response) {
  //       ToastAlert(toast, 'sukses', 'Data Berhasil Dikirim');
  //       navigation.navigate('SuccessfulPaymentScreen');
  //     }
  //   } catch (error: any) {
  //     ToastAlert(toast, 'error', error?.response?.data?.message);
  //     throw error;
  //   }
  // };

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
          });

          if (response) {
            dataList = dataList.filter(item => item !== data);
            await cache.store('paymentSubmissions', dataList);
          }

          return response;
        } catch (error) {
          return null;
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

  return {submitPayment};
};

export default usePaymentSubmit;
