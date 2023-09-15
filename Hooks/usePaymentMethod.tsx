import {useIsFocused} from '@react-navigation/native';
import {useEffect, useState} from 'react';

import {useLoading} from '../Context';

import {PaymentMethodModel, PaymentModelContent} from '../models/PaymentMethod';
import paymentNetwork from '../Network/lib/payment';

// import cache from '../Util/cache';
import useNetworkInfo from './useNetworkInfo';

const usePaymentMethod = () => {
  const isFocused = useIsFocused();
  const [paymentMethod, setPaymentMethod] = useState<PaymentModelContent[]>([]);
  const [fetchData, setfetchData] = useState(false);
  const {setLoading} = useLoading();
  const isConnected = useNetworkInfo().isConnected;

  function refreshPage() {
    setfetchData(!fetchData);
  }

  useEffect(() => {
    const fetchPaymentMethods = async (): Promise<
      PaymentMethodModel[] | void
    > => {
      setLoading(true);
      try {
        const response = await paymentNetwork.list();
        if (response) {
          setPaymentMethod(response.data);
          // await cache.store('DataCategory', response.data.data);
          setLoading(false);
          // return setCategories(response.data.data);
        }
      } catch (error) {
        setLoading(false);
        console.error('Error fetching payment:', error);
        throw error;
      }
    };
    const fetchCategoriesCache = async (): Promise<void> => {
      setLoading(true);
      // const dataUser = await cache.get('DataCategory');
      setLoading(false);
      // setCategories(dataUser);
    };
    if (isFocused && !isConnected) {
      fetchCategoriesCache();
    }
    if (isFocused && isConnected) {
      fetchPaymentMethods();
    }
  }, [isFocused, isConnected, fetchData, setLoading]);
  return {paymentMethod, refreshPage, fetchData};
};

export default usePaymentMethod;
